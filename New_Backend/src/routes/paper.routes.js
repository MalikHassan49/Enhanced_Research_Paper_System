import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { submitPaper, studentAllPapers, allSubmittedPapers, reviewPaper, comment, reviewedPapers, deletePaper, papersStatus, assignTeacher  } from "../controllers/paper.controller.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/submit-paper").post(verifyJWT, upload.single("file"), submitPaper);
router.route("/student-papers").get(verifyJWT, studentAllPapers);
router.route("/all-submitted-papers").get(verifyJWT, allSubmittedPapers);
router.route("/:id/review-paper").put(verifyJWT, reviewPaper);
router.route("/:id/comment").get(verifyJWT, comment);
router.route("/reviewed-papers").get(verifyJWT, reviewedPapers);
router.route("/:id/delete-paper").delete(verifyJWT, deletePaper);
router.route("/papers-status").get(verifyJWT, papersStatus);
router.route("/:id/assign-teacher").patch(verifyJWT, assignTeacher);

export default router;