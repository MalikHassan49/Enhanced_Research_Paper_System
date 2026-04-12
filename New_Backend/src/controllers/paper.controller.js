import { Paper } from "../models/paper.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const submitPaper = asyncHandler(async (req, res) => {
  console.log("Submit Paper API HIT");

  console.log("Req body: ", req.body);
  console.log("File object: ", req.file);
  console.log("File path: ", req.file.path);
  const { paperTitle, paperAbstract } = req.body;
  const file = req.file;
  const localFilePath = req.file.path;

  const userId = 1234;

  if (!paperTitle || !paperAbstract) {
    throw new ApiError(400, "Paper title and Abstract is required");
  }

  if (!req.file || !localFilePath) {
    throw new ApiError(400, "File path is required");
  }

  // file upload on cloudinary
  const responseFromCloudinary = await uploadOnCloudinary(localFilePath);

  if (!responseFromCloudinary) {
    throw new ApiError(400, "Something went wrong while uploading file on cloudinary");
  }

  const fileURL = responseFromCloudinary.url;
  const filePublicId = responseFromCloudinary.public_id;

  const paper = await Paper.create({
    paperTitle,
    paperAbstract,
    file: {
      url: fileURL,
      publicId: filePublicId
    },
    student: userId,
  })

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paper,
        "Paper submitted successfully"
      )
    )
});

export { submitPaper }