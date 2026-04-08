import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// upload the file on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
  
    console.log("Cloudinary Response: ", response);
    console.log("Remove the locally saved file when successfully upload on cloudinary", fs.unlinkSync(localFilePath));
    return response;
  } catch (error) {
    console.log("Remove the local file when upload operation is failed ", fs.unlinkSync(localFilePath));
    return null;
  }
}

// remove the file from cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    const response = await cloudinary.uploader.destroy(public_id);
    return response;
  } catch (error) {
    console.log("Error while removing file from cloudinary ", error);
    return null;
  }
}

export { uploadOnCloudinary, deleteFromCloudinary }