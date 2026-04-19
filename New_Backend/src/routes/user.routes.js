import express from "express";
import { registerUser, loginUser, logoutUser, allTeachers, deleteTeacher, allStudents,
  deleteStudent
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/all-teachers").get(verifyJWT, allTeachers);
router.route("/:id/delete-teacher").delete(verifyJWT, deleteTeacher);
router.route("/all-students").get(verifyJWT, allStudents);
router.route("/:id/delete-student").delete(verifyJWT, deleteStudent);

export default router;

