import http from "http";
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./src/db/db.js"

dotenv.config({ path: './.env' });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      app.on("error", (error) => {
        console.log("ERROR", error);
        throw error;
      })
    });
  })

  .catch((err) => {
    console.log("MongoDB connection error ", err);
  })
