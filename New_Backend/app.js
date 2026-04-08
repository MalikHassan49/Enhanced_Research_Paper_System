import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
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

// simple route test
app.get("/", (req, res) => {
  res.send("Backend working");
});

// import routes
import userRouter from "./src/routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export { app }