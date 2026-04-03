import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const registerUser = asyncHandler(async(req, res, next) => {
  // flow of api
  // Take email,password etc from user
  // 
  const {email, password, confirmPassword, role } = req.body;


})