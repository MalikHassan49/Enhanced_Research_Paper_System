import { Paper } from "../models/paper.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


const submitPaper = asyncHandler(async (req, res) => {
  console.log("Submit Paper API HIT");

  console.log("Req body: ", req.body);
  console.log("File object: ", req.file);
  console.log("File path: ", req.file.path);
  const { paperTitle, paperAbstract } = req.body;
  const file = req.file;
  const localFilePath = req.file.path;

  // console.log("Request User: ", req.user)

  const userId = req.user?._id;

  if (!paperTitle || !paperAbstract) {
    throw new ApiError(400, "Paper title and Abstract is required");
  }

  if (!req.file || !localFilePath) {
    throw new ApiError(400, "File path is required");
  }


  // file upload on cloudinary

  console.log("1 Api Hit");
  const responseFromCloudinary = await uploadOnCloudinary(localFilePath);
  console.log("2 Cloudinary done");

  if (!responseFromCloudinary) {
    throw new ApiError(400, "Something went wrong while uploading file on cloudinary");
  }

  const fileURL = responseFromCloudinary.secure_url;
  const filePublicId = responseFromCloudinary.public_id;

  const paper = await Paper.create({
    paperTitle,
    paperAbstract,
    file: {
      url: fileURL,
      publicId: filePublicId,
      filename: req.file.originalname
    },
    studentId: userId,
  });

  console.log("3 Mongo db save done");

  console.log("4  Sending response...");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paper,
        "Paper submitted successfully"
      )
    )
  console.log("5 Response send properly...");
});

const studentAllPapers = asyncHandler(async (req, res) => {
  console.log("Student All Papers API HIT");
  const userId = req.user._id;

  const papers = await Paper.find({
    studentId: userId
  })

  if (papers.length > 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          papers,
          "All papers fetched successfully"
        )
      )
  }
  else {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "No papers available"
        )
      )
  }


})

const allSubmittedPapers = asyncHandler(async (req, res) => {
  console.log("All Submitted Papers API HIT !!!");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;
  const userId = req.user._id;

  const totalPapers = await Paper.countDocuments();

  const papers = await Paper.find({
    assignTeacher: userId
  })
    .populate("studentId", "username")
    .populate("reviewedBy", "username")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          papers,
          totalPapers,
          currentPage: page,
          totalPages: Math.ceil(totalPapers / limit)
        },
        "Papers fetched successfully"
      )
    )
})


const allPapers = asyncHandler(async (req, res) => {
  console.log("All Papers API HIT !!!");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;
  const userId = req.user._id;

  const totalPapers = await Paper.countDocuments();

  const papers = await Paper.find({})
    .populate("studentId", "username")
    .populate("reviewedBy", "username")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          papers,
          totalPapers,
          currentPage: page,
          totalPages: Math.ceil(totalPapers / limit)
        },
        "Papers fetched successfully"
      )
    )
})

const reviewPaper = asyncHandler(async (req, res) => {
  console.log("Review Paper API HIT!!!");
  const { comment, paperStatus } = req.body;
  const paperId = req.params.id;
  const userId = req.user.id;

  if (!comment || !paperStatus) {
    throw new ApiError(400, "All fields are required");
  }

  const updatePaper = await Paper.findByIdAndUpdate(paperId, {
    $set: {
      teacherComment: comment,
      status: paperStatus,
      reviewedBy: userId
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
        updatePaper,
        "Your review submitted successfully"
      )
    )
})

const comment = asyncHandler(async (req, res) => {
  console.log("Comment data fetched successfully");
  const paperId = req.params.id;

  const paper = await Paper.findById(paperId)
    .select("teacherComment")
    .populate("reviewedBy", "username");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paper,
        "Comment data fetched successfully"
      )
    )
})

const reviewedPapers = asyncHandler(async (req, res) => {
  console.log("Reviewed papers API HIT!!!");
  const userId = req.user.id;

  const papers = await Paper.find({ reviewedBy: userId })
    .select("paperTitle status")
    .populate("studentId", "username")

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        papers,
        "Reviewed papers fetched succesfully"
      )
    )
})

// delete paper

const deletePaper = asyncHandler(async (req, res) => {
  console.log("Delete paper API HIT!!!");
  const paperId = req.params.id;

  const file = await Paper.findById(paperId).select("file");
  const publicId = file.publicId;

  const paper = await Paper.findByIdAndDelete(paperId);

  if (!paper) {
    throw new ApiError(400, "Something wrong while deleting paper from DB!");
  }

  const responseFromCloudinary = await deleteFromCloudinary(publicId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paper,
        "Paper deleted successfully"
      )
    )
})


const papersStatus = asyncHandler(async (req, res) => {
  const acceptedPapers = await Paper.countDocuments({ status: "Accepted" })
  const rejectedPapers = await Paper.countDocuments({ status: "Rejected" });
  const pendingPapers = await Paper.countDocuments({ status: "Pending" });
  const underReviewPapers = await Paper.countDocuments({ status: "Under Review" });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          acceptedPapers, rejectedPapers, pendingPapers, underReviewPapers
        },
        "Paper status fetched successfully!"
      )
    )
})


const assignTeacher = asyncHandler(async (req, res) => {
  console.log("Assign Teacher API HIT!");
  console.log(req.params);
  const { paperId } = req.params;
  const { teacherId } = req.body;

  if (!teacherId) {
    throw new ApiError(400, "Teacher Id is required");
  }

  const assignedTeacher = await Paper.findByIdAndUpdate(paperId, {
    $set: {
      assignTeacher: teacherId
    }
  },
    {
      returnDocument: "after"
    }
  )

  if (!assignedTeacher) {
    throw new ApiError(404, "Paper not found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        assignedTeacher,
        "Teacher assigned successfully"
      )
    )

})

export {
  submitPaper,
  studentAllPapers,
  allSubmittedPapers,
  allPapers,
  reviewPaper,
  comment,
  reviewedPapers,
  deletePaper,
  papersStatus,
  assignTeacher
}