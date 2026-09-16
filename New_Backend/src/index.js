import dns from "node:dns";
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/db.js";

dns.setServers(["8.8.8.8"]);

dotenv.config({path: "./.env"});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
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
