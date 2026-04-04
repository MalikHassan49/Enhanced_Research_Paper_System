import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

    console.log(`MongoDB connected !! ${connectionInstance}`);
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
}

export default connectDB;