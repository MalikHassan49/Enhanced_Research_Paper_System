import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({limit: '15kb'}));
app.use(express.urlencoded({urlencoded: true, limit: '15kb'}));
app.use(express.static('public'));
app.use(cookieParser());

// import routes
import userRouter from "./src/routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export { app }