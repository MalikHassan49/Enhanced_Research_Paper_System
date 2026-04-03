import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


// generate access token and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({validateBeforeSave: false});

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(400, "Something went wrong while generating access and refresh token");
  }
}


// register controller
const registerUser = asyncHandler(async(req, res, next) => {
  // flow of api
  // Take email,password etc from user
  // Check email,password etc
  // 
  const {email, password, confirmPassword, role } = req.body;

  if(
    [email, password, confirmPassword, role].some(field => field.trim() === "")
  ) {
    throw new ApiError(400, "All the fields are required");
  }

  const alreadyExist = await User.find({
    email
  })

  if(alreadyExist) {
    throw new ApiError(400, "The user with this email is already exist try another email");
  }

  const user = await User.create({
    email, 
    password,
    confirmPassword,
    role
  })

  const createdUser = await User.findById(user._id).select("-password", "-refreshToken");

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,

    )
  )
})

// login controller
const loginUser = asyncHandler(async(req, res, next) => {
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

  const isValidPassword = user.isPasswordCorrect(password);

  if(!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id);

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