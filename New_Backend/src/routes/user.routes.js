import express from "express";
import { registerUser, verifyOTP, resendOTP, loginUser, forgotPassword, verifyResetOTP,
  resetPassword, logoutUser, allTeachers, deleteTeacher, allStudents,
  deleteStudent, getCurrentUser, updateTeacher,
  updateStudent, createTeacher
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { otpLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.route("/register").post(otpLimiter, registerUser);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(otpLimiter, resendOTP);
router.route("/login").post(loginUser);
router.route("/create-teacher").post(verifyJWT, createTeacher);
router.route("/forgot-password").post(otpLimiter, forgotPassword);
router.route("/verify-reset-otp").post(verifyResetOTP);
router.route("/reset-password").post(resetPassword);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/all-teachers").get(verifyJWT, allTeachers);
router.route("/:id/delete-teacher").delete(verifyJWT, deleteTeacher);
router.route("/all-students").get(verifyJWT, allStudents);
router.route("/:id/delete-student").delete(verifyJWT, deleteStudent);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
router.route("/:id/update-teacher").patch(verifyJWT, updateTeacher);
router.route("/:id/update-student").patch(verifyJWT, updateStudent);

export default router;

