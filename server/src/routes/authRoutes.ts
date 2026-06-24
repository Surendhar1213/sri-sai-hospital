import { Router } from "express";
import { loginAdmin } from "../controllers/authController.js";

const router = Router();

// POST /api/admin/login
router.post("/login", loginAdmin);

export default router;
