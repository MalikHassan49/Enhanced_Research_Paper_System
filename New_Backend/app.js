import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://127.0.0.1:3000"
    ];
    if(!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } 
    else {
      callback(new Error("Not allowed by CORS"));
    }
  }, 
  credentials: true
}));

// app.use(cors());


app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())


// import routes
import userRouter from "./src/routes/user.routes.js";
import paperRouter from "./src/routes/paper.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/papers", paperRouter);

export { app }