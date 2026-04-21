import mongoose, { Schema } from "mongoose";

const paperSchema = new Schema({
  paperTitle: {
    type: String,
    required: true,
    trim: true
  },
  paperAbstract: {
    type: String,
    required: true,
    trim: true
  },
  file: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    filename: { type: String, required: true }
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  status: {
    type: String,
    enum: ["Pending", "Under Review", "Accepted", "Rejected"],
    default: "Pending"
  },
  teacherComment: {
    type: String,
    default: ""
  }
}, { timestamps: true });


export const Paper = mongoose.model("Paper", paperSchema);