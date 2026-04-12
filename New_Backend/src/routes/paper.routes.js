import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { submitPaper } from "../controllers/paper.controller.js";


const router = express.Router();

router.route("/submit-paper").post(verifyJWT, submitPaper);

export default router;