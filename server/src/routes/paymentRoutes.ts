import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = Router();

// /api/payments/create-order -> ஆர்டர் உருவாக்க
router.post("/create-order", createOrder);

// /api/payments/verify -> பேமெண்ட் சரிபார்க்க
router.post("/verify", verifyPayment);

export default router;
