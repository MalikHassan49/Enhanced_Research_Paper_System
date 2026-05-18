import { Paper } from "../models/paper.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
  console.log("Register API hit");
  // flow of api
  // Take email,password etc from user
  // Check email,password etc

  const { username, email, password, role } = req.body;
  console.log("Username: ", username);
  console.log("Email: ", email);
  console.log("Password: ", password);
  console.log("Role: ", role);

  // safe validation
  if (!username || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  const alreadyExist = await User.findOne({ email })

  if (alreadyExist) {
    throw new ApiError(400, "Email already exist");
  }


  const user = await User.create({
    username,
    email,
    password,
    role
  })

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  const isProduction = process.env.NOD_ENV === "Production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "Lax"
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully"
      )
    )
})

// login controller
const loginUser = asyncHandler(async (req, res) => {
  // Take the email, apssword, role
  // Check the fields
  // Match passowrd, email in database
  console.log("login API hit");
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

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
        "User loggedIn successfully"
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
  loginUser,
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