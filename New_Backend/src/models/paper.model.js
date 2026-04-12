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
    publicId: { type: String, required: true }
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["submitted", "reviewing", "accepted", "rejected"],
    default: "submitted"
  },
  teacherCommet: {
    type: String,
    default: ""
  }
}, { timestamps: true });


export const Paper = mongoose.model("Paper", paperSchema);