import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// app.use(cors());

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://127.0.0.1:3000",
      "https://enhanced-research-paper-system.vercel.app"
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

// app.use(cors({
//   origin: [
//     "http://127.0.0.1:3000",
//     "https://enhanced-research-paper-system-le9g.vercel.app"
//   ],
//   credentials: true
// }));


app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
// app.use("/temp", express.static("src/public/temp"));
app.use(cookieParser())


// import routes
import userRouter from "./routes/user.routes.js";
import paperRouter from "./routes/paper.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/papers", paperRouter);

app.use(errorHandler);

export { app }