import { Router } from "express";
import { addDoctor, getAllDoctors } from "../controllers/doctorController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Public route to view doctors (no login required for patient side to view)
router.get("/all", getAllDoctors);

// Secure routes (requires admin token to add)
router.post("/add", verifyAdminToken as any, addDoctor);

export default router;
