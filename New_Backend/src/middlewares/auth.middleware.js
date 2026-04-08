import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler( async(req, _, next) => {
 try {
   const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "");

  if(!token) {
    throw new ApiError(401, "Unauthorized user");
  }

  const decodedToken = await jwt.verify(token, process.env.ACCESS.TOKEN.SECRET);
  console.log("Decoded access token: ", decodedToken);

  const user = await User.findById(decodedToken._id).select("password", "refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next();
 } catch (error) {
    throw new ApiError(error?.message || "Invalid access token")
 }

})

export { verifyJWT }