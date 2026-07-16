import { Router } from "express";
import { registerUser, loginUser, getAllUsers, updateUserProfile, forgotPassword, resetPassword, verifyOTP } from "../controllers/userAuthController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /api/user/register — New patient register
router.post("/register", registerUser);

// POST /api/user/login — Patient login
router.post("/login", loginUser);

// POST /api/user/forgot-password — Request password reset OTP
router.post("/forgot-password", forgotPassword);

// POST /api/user/verify-otp — Verify OTP before password change page
router.post("/verify-otp", verifyOTP);

// POST /api/user/reset-password — Reset password using OTP
router.post("/reset-password", resetPassword);


// GET /api/user/all — Admin show all patient list view
router.get("/all", verifyAdminToken as any, getAllUsers);

// PUT /api/user/update/:id — Update patient profile details
router.put("/update/:id", updateUserProfile);

export default router;