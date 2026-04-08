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
    await user.save({validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log("REAL ERROR: ", error);
    throw new ApiError(400, "Something went wrong while generating Access and RefreshToken")
  }
}

// register controller
const registerUser = asyncHandler(async(req, res) => {
  console.log("API HIT");
  // flow of api
  // Take email,password etc from user
  // Check email,password etc
  // 
  const {email, password, role } = req.body;
  console.log("Email: ", email);
  console.log("Password: ", password);
  console.log("Role: ", role);

  if(
    [email, password, role].some(field => field.trim() === "")
  ) {
    throw new ApiError(400, "All the fields are required");
  }

  const alreadyExist = await User.findOne({email})

  if(alreadyExist) {
    throw new ApiError(400, "The user with this email is already exist try another email");
  }

  const user = await User.create({
    email, 
    password,
    role
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res
  .status(200)
  .json(
    new ApiResponse(
      201,
      createdUser,
      "User registered successfully"
    )
  )
})

// login controller
const loginUser = asyncHandler(async(req, res) => {
  // Take the email, apssword, role
  // Check the fields
  // Match passowrd, email in database

  const {email, password, role} = req.body;

  if(
    [email, password, role].some(field => field?.trim() === "")
  ) {
    throw new ApiError(400, "Invalid credentials");
  }

  const user = await User.findOne({
    $or: [{email}, {password}]
  })

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if(!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    http: true,
    secure: true
  }


  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { loggedInUser, accessToken, refreshToken }, 
      "User loggedIn successfully"
    )
  )
})

export { 
  registerUser, loginUser
}
