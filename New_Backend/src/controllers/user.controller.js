import { Paper } from "../models/paper.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redisClient from "../redis/redisClient.js";
import { sendEmail } from "../utils/email.js";
import { generateOTP } from "../utils/otp.js";
import { registerSchema, loginSchema, verifyOTPSchema, resendOTPSchema, forgotPasswordSchema, resetPasswordSchema, createTeacherSchema } from "../validations/auth.validation.js";

// generate access token and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log("REAL ERROR: ", error);
    throw new ApiError(400, "Something went wrong while generating Access and RefreshToken")
  }
}

// register controller
const registerUser = asyncHandler(async (req, res) => {

  // Zod Validation
  const validatedData = registerSchema.parse(req.body);
  // Destructuring
  const { username, email, password, role } = validatedData;
  // Check existing user in MongoDB
  const existingUser = await User.findOne({ email });
  // if User already exist
  if (existingUser) {
    throw new ApiError(400, "Email already exist");
  }
  // Check existing OTP in redis
  const existingOTP = await redisClient.get(`otp:${email}`);
  // if OTP already exist
  if (existingOTP) {
    // convert redis string into object
    const parsedOTP = JSON.parse(existingOTP);
    // get remaining expiry time
    const remainingTime = await redisClient.ttl(`otp:${email}`);
    // convert seconds into minutes
    const remainingMinutes = Math.ceil(remainingTime / 60);
    // Resend same OTP
    await sendEmail(
  email,
  "🔐 Verify Your Email Address",
  `Your OTP is ${parsedOTP.otp}`,
  `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f7fc;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .header {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        text-align: center;
        padding: 30px;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
      }

      .content {
        padding: 30px;
        color: #333;
        line-height: 1.6;
      }

      .otp-box {
        background: #f3f4f6;
        border: 2px dashed #4f46e5;
        border-radius: 10px;
        text-align: center;
        padding: 20px;
        margin: 25px 0;
      }

      .otp {
        font-size: 36px;
        font-weight: bold;
        color: #4f46e5;
        letter-spacing: 8px;
      }

      .info {
        background: #eef2ff;
        padding: 15px;
        border-left: 4px solid #4f46e5;
        border-radius: 6px;
        margin-top: 20px;
      }

      .footer {
        text-align: center;
        background: #f9fafb;
        padding: 20px;
        color: #6b7280;
        font-size: 13px;
      }

      .warning {
        color: #dc2626;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">

      <div class="header">
        <h1>🔐 Email Verification</h1>
        <p>Secure One-Time Password (OTP)</p>
      </div>

      <div class="content">
        <h2>Hello 👋</h2>

        <p>
          We received a request to verify your email address.
          Please use the following OTP to complete your verification process:
        </p>

        <div class="otp-box">
          <div class="otp">${parsedOTP.otp}</div>
        </div>

        <div class="info">
          ⏳ This OTP is valid for
          <strong>${remainingMinutes} minute(s)</strong>.
        </div>

        <p class="warning">
          Do not share this OTP with anyone.
        </p>

        <p>
          If you did not request this verification, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        <p>© 2026 HassanSoft. All Rights Reserved.</p>
        <p>This is an automated email, please do not reply.</p>
      </div>

    </div>
  </body>
  </html>
  `
);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "OTP resent successfully"
        )
      )
  }
  // generate new otp
  const otp = generateOTP();
  // Store user data temporary in Redis database
  // User data 15 min
  await redisClient.set(
    `user:${email}`,
    JSON.stringify({
      username,
      email,
      password,
      role
    }),
    {
      EX: 900
    }
  );
  // otp data 5 min
  await redisClient.set(
    `otp:${email}`,
    JSON.stringify({
      otp
    }),
    {
      EX: 300
    }
  );
  // Send OTP email
  await sendEmail(
    email,
    "OTP Verification",
    `Your otp is ${otp}`,
    `
    <h1>Email Verification</h1>
    <h2>Your otp is ${otp}</h2>
    <p>OTP valid for 5 minutes</p>
    `
  )
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP sent successfully"
      )
    )
});

const verifyOTP = asyncHandler(async (req, res) => {
  const validatedData = verifyOTPSchema.parse(req.body);

  const { email, otp } = validatedData;

  const otpData = await redisClient.get(`otp:${email}`);

  if (!otpData) {
    throw new ApiError(400, "OTP expired.Please resend otp");
  }

  const parsedData = JSON.parse(otpData);

  if (parsedData.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // get user data from redis
  const userData = await redisClient.get(`user:${email}`);

  if (!userData) {
    throw new ApiError(400, "Registration failed.Please register again");
  }

  const parsedUser = JSON.parse(userData);

  const user = await User.create({
    username: parsedUser.username,
    email: parsedUser.email,
    password: parsedUser.password,
    role: parsedUser.role,
    isVerified: true
  });

  await redisClient.del(`user:${email}`);
  await redisClient.del(`otp:${email}`);

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  console.log("AccessToken: ", accessToken);
  console.log("RefreshToken: ", refreshToken);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  const isProduction = process.env.NOD_ENV === "Production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "Lax"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "User verified successfully"
      )
    )
})

const resendOTP = asyncHandler(async (req, res) => {
  const validatedData = resendOTPSchema.parse(req.body);

  const { email } = validatedData;

  // Cooldown check

  const cooldown = await redisClient.get(`cooldown:${email}`);
  console.log("cooldown", cooldown);

  if (cooldown) {
    const ttl = await redisClient.ttl(`cooldown:${email}`);
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { ttl },
          `Wait for ${ttl}s  before requesting another otp`
        )
      )
  }

  // User check

  const userData = await redisClient.get(`user:${email}`);

  if (!userData) {
    throw new ApiError(400, "Registration expired.Please register again");
  }

  // Otp check
  const otpData = await redisClient.get(`otp:${email}`);

  let otpToSend;

  if (otpData) {
    const parsedOTP = JSON.parse(otpData);
    otpToSend = parsedOTP.otp;
  }
  else {
    // generate new otp
    otpToSend = generateOTP();
    await redisClient.set(
      `otp:${email}`,
      JSON.stringify({
        otp: otpToSend
      }),
      {
        EX: 300
      }
    );
  }

  // Send Email
  await sendEmail(
    email,
    "Resend OTP",
    `Your otp is ${otpToSend}`,
    `
      <h1>OTP Verification</h1>,
      <h2>Your OTP is ${otpToSend}</h2>
      <p>OTP valid for 5 minutes</p>
      `
  );

  await redisClient.set(
    `cooldown:${email}`,
    "true",
    {
      EX: 30
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP resend successfully"
      )
    )
})

const loginUser = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password, role } = validatedData;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(400, "Verify your email first");
  }

  if (user.role !== role) {
    throw new ApiError(400, "Invalid User");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  }
  console.log("Step5");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const isProduction = process.env.NOD_ENV === "Production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "Lax"
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        loggedInUser,
        "User login successfully"
      )
    )

})

const forgotPassword = asyncHandler(async (req, res) => {
  console.log("Forgot password api hit");
  console.log("Req body: ", req.body);
  const validatedData = forgotPasswordSchema.parse(req.body);
  console.log("Validated Data: ", validatedData);
  const { email } = validatedData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const otp = generateOTP();
  console.log("OTP: ", otp);

  // normalized the email
  const normalizedEmail = email.toLowerCase().trim();
  await redisClient.set(
    `reset:${normalizedEmail}`,
    otp,
    {
      EX: 300
    }
  );

  await sendEmail(
    normalizedEmail,
    "Reset Password OTP",
    `Your otp is ${otp}`,
    `
    <h1>Reset Password</h1>
    <h2>Your otp is ${otp}</h2>
    `
  )

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Reset OTP sent"
      )
    )
});

const verifyResetOTP = asyncHandler(async (req, res) => {
  const validatedData = verifyOTPSchema.parse(req.body);

  const { email, otp } = validatedData;
  console.log("EMAIL: ", email);
  console.log("REDIS KEY: ", `reset:${email}`);
  // normalize the email
  const normalizedEmail = email.toLowerCase().trim();

  const storedOTP = await redisClient.get(`reset:${normalizedEmail}`);
  console.log("STORED OTP: ", storedOTP);

  if (!storedOTP) {
    throw new ApiError(400, "OTP expired");
  }

  if (storedOTP !== otp) {
    throw new ApiError(400, "Invalid otp");
  }

  await redisClient.set(
    `reset-verified:${email}`,
    "true",
    {
      EX: 300
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP verified successfully"
      )
    )
});


const resetPassword = asyncHandler(async (req, res) => {
  console.log("Reset Password API HIT!");
  console.log("Req Body: ", req.body);
  const validatedData = resetPasswordSchema.parse(req.body);

  const { email, newPassword } = validatedData;

  const verified = await redisClient.get(`reset-verified:${email}`);

  if (!verified) {
    throw new ApiError(400, "OTP verification required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  await redisClient.del(`reset:${email}`);
  await redisClient.del(`reset-verify:${email}`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset successfully"
      )
    )
})

// logout controller

const logoutUser = asyncHandler(async (req, res) => {
  console.log("logout API hit");
  await User.findByIdAndUpdate(req.user._id,
    {
      $unset: {
        refreshToken: ""
      }
    },
    {
      returnDocument: "after"
    }
  )

  const isProduction = process.env.NOD_ENV === "Production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "Lax"
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {},
        "User logout successfully"
      )
    )

})

const createTeacher = asyncHandler(async (req, res) => {
  console.log("Teacher Data: ", req.body);
  console.log("Create teacher API HIT!");
  // zod validation
  const validatedData = createTeacherSchema.parse(req.body);
  // Destructuring
  const { username, email, password, role } = validatedData;
  // check existing user
  const existingTeacher = await User.findOne({ email });

  if (existingTeacher) {
    throw new ApiError(400, "Teacher already exists");
  }

  const teacher = await User.create({
    username,
    email,
    password,
    role,
    isVerified: true
  });

  await sendEmail(
    email,
    "Teacher account created",
    `Your account has been created`,
    `
    <h2>Welcome to Research Paper Management System</h2>
    <p>Your account has been created successfully by admin.</p>
    <p><strong>Email: </strong> ${email} </p>
    <p><strong>Password: </strong> ${password} </p>
    <p><strong>Role: </strong> Teacher </p>

    <p>Please Login and change your password.</p>
    `
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        teacher,
        "Teacher created successfully"
      )
    )
});


const allTeachers = asyncHandler(async (req, res) => {
  console.log("All Teachers API HIT!!!");
  const teachers = await User.find({ role: "Teacher" })
    .select("username email role")
    .sort({ createdAt: -1 })

  if (teachers.length > 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          teachers,
          "All teachers fetched successfully"
        )
      )
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Teacher are not registered"
      )
    )
})

const deleteTeacher = asyncHandler(async (req, res) => {
  console.log("Delete teacher API HIT!!!");
  console.log("id: ", req.params?.id);
  const teacherId = req.params?.id;


  const teacher = await User.findByIdAndDelete(teacherId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        teacher,
        "Teacher deleted successfully"
      )
    )
})


const allStudents = asyncHandler(async (req, res) => {
  console.log("All Students API HIT!!!");
  const students = await User.find({ role: "Student" })
    .select("username email role")
    .sort({ createdAt: -1 })

  if (students.length > 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          students,
          "All students fetched successfully"
        )
      )
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Student are not registered"
      )
    )
})

const deleteStudent = asyncHandler(async (req, res) => {
  console.log("Delete student API HIT!!!");
  const studentId = req.params.id;

  const student = await User.findByIdAndDelete(studentId);
  const deletePapers = await Paper.deleteMany({ studentId: studentId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        student,
        "Student and all papers deleted successfully"
      )
    )
});

const getCurrentUser = asyncHandler(async (req, res) => {
  console.log("Current User API HIT!!!");
  const userId = req.user?.id;

  const user = await User.findById(userId).select("username");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Current user fetched successfull"
      )
    )
});

const updateTeacher = asyncHandler(async (req, res) => {
  console.log("Teacher update data API HIT!");
  const teacherId = req.params?.id;
  const { username, email } = req.body;

  const alreadyExist = await User.findOne({
    email,
    _id: { $ne: teacherId }
  });

  if (alreadyExist) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Email already exist"
        )
      )
  }

  const updateUser = await User.findByIdAndUpdate(teacherId,
    {
      $set: {
        username: username,
        email: email
      }
    },
    {
      returnDocument: "after"
    }
  )

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateUser,
        "Teacher data update successfully!"
      )
    )

})

const updateStudent = asyncHandler(async (req, res) => {
  console.log("Student update data API HIT!");
  const studentId = req.params?.id;
  const { username, email } = req.body;

  const alreadyExist = await User.findOne({
    email,
    _id: { $ne: studentId }
  });

  if (alreadyExist) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Email already exist"
        )
      )
  }

  const updateUser = await User.findByIdAndUpdate(studentId,
    {
      $set: {
        username: username,
        email: email
      }
    },
    {
      returnDocument: "after"
    }
  )

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateUser,
        "Student data update successfully!"
      )
    )

})


export {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  createTeacher,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  logoutUser,
  allTeachers,
  deleteTeacher,
  allStudents,
  deleteStudent,
  getCurrentUser,
  updateTeacher,
  updateStudent,
}


// ********* OTP verification code **********

// import crypto from "crypto";
// import { redis } from "../config/redis.js";
// import { sendEmail } from "../utils/email.js";

// register controller
// const registerUser = asyncHandler(async (req, res) => {
//   console.log("Register API hit");
//   // flow of api
//   // Take email,password etc from user
//   // Check email,password etc

//   const { username, email, password, role } = req.body;
//   console.log("Username: ", username);
//   console.log("Email: ", email);
//   console.log("Password: ", password);
//   console.log("Role: ", role);

//   // safe validation
//   if (!username || !email || !password || !role) {
//     throw new ApiError(400, "All fields are required");
//   }

//   const alreadyExist = await User.findOne({ email })

//   if (alreadyExist) {
//     throw new ApiError(400, "Email already exist");
//   }


//   const user = await User.create({
//     username,
//     email,
//     password,
//     role
//   })

//   // generate verification token
//   const token = crypto.randomBytes(32).toString("hex");

//   await redis.set(`verify:${token}`, user._id.toString(), { EX: 3600 });

//   const link = `${process.env.BASE_URL}/verify-email?token=${token}`;

//   await sendEmail({
//     to: email,
//     from: process.env.FROM_EMAIL,
//     subject: "Email verification",
//     html: `<h3>Click to verify</h3><a href="${link}">
//     Verify Email</a>`
//   })

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         user,
//         "User registered successfully, but not verified"
//       )
//     )
// })

// verify email
// const verifyEmail = asyncHandler(async (req, res) => {
//   const { token } = req.query;

//   const userId = await redis.get(`verify:${token}`);

//   if (!userId) {
//     throw new ApiError(400, "Invalid or expired token!");
//   }

//   const verifiedUser = await User.findByIdAndUpdate(userId,
//     { isVerified: true },
//     {returnDocument: "after"}
//   );

//   await redis.del(`verify:${token}`);

//   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(verifiedUser._id)

//   const createdUser = await User.findById(verifiedUser._id).select("-password -refreshToken");

//   const isProduction = process.env.NOD_ENV === "Production";

//   const options = {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "none" : "Lax"
//   }

//   return res
//     .status(201)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         201,
//         createdUser,
//         "Email verified successfully"
//       )
//     )
// })