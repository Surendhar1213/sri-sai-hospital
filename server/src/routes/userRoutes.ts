import { Router } from "express";
import { registerUser, loginUser, getAllUsers, updateUserProfile } from "../controllers/userAuthController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /api/user/register — New patient register
router.post("/register", registerUser);

// POST /api/user/login — Patient login
router.post("/login", loginUser);

// GET /api/user/all — Admin show all patient list view
router.get("/all", verifyAdminToken as any, getAllUsers);

// PUT /api/user/update/:id — Update patient profile details
router.put("/update/:id", updateUserProfile);

export default router;