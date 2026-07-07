import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = Router();

// /api/payments/create-order -> create order 
router.post("/create-order", createOrder);

// /api/payments/verify -> review the payment
router.post("/verify", verifyPayment);

export default router;
