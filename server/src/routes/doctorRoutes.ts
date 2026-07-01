import { Router } from "express";
import { addDoctor, getAllDoctors, updateDoctor, deleteDoctor } from "../controllers/doctorController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/all", getAllDoctors);
router.post("/add", verifyAdminToken as any, addDoctor);

// Secure router update details
router.put("/update/:id", verifyAdminToken as any, updateDoctor as any);
router.delete("/delete/:id", verifyAdminToken as any, deleteDoctor as any);


export default router;
