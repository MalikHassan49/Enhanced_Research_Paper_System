import { z } from "zod";

// implement register validation schema
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be al least 3 characters"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["Student", "Teacher", "Admin"])
});

// implement resend OTP schema
export const resendOTPSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
});

// implement login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(3, "Password must be atleast 6 characters"),

  role: z.enum(["Student", "Teacher", "Admin"])
});

// implement verify OTP Schema
export const verifyOTPSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  otp: z
    .string()
    .length(6, "OTP must be at least 6 digits"),
});

// implement forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
});

// implement reset password schema
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
});