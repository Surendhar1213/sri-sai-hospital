import { Router } from "express";
import { loginAdmin } from "../controllers/authController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// POST /api/admin/login (Rate limited to prevent brute-force attacks)
router.post("/login", authLimiter, loginAdmin);

// GET /api/admin/verify (Token verification)
router.get("/verify", verifyAdminToken, (req, res) => {
  res.status(200).json({ valid: true, admin: (req as any).admin });
});

export default router;
