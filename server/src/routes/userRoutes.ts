import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/userAuthController.js";

const router = Router();

// POST /api/user/register — New patient register
router.post("/register", registerUser);

// POST /api/user/login — Patient login
router.post("/login", loginUser);

// GET /api/user/all — Admin show all patient list view
router.get("/all", getAllUsers);

export default router;