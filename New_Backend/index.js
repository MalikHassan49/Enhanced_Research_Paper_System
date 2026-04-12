import dotenv from "dotenv";
dotenv.config({ path: './.env' });
import { app } from "./app.js";
import connectDB from "./src/db/db.js"

console.log("ENV Check: ", process.env);

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
