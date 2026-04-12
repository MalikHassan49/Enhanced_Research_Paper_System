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
    throw new ApiError(400, "The user with this email is already exist try another email");
  }


  const user = await User.create({
    username,
    email,
    password,
    role
  })

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
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

  if ( !username || !email || !password || !role) {
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

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
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

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
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

export {
  registerUser,
  loginUser,
  logoutUser
}
