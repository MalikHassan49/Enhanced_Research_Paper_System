import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { submitPaper } from "../controllers/paper.controller.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/submit-paper").post(upload.single("file"), submitPaper);

export default router;