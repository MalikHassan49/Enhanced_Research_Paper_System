import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/user.model.js";
dotenv.config();


async function createAdmin() {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

    console.log(`MONGODB connected ${connectionInstance}`);

    await User.create({
      username: "Hassan",
      email: "hassan.raza.developer10@gmail.com",
      password: "Raza250$",
      role: "Admin"
    });

    console.log("Admin created successfull");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createAdmin();