import { Router } from "express";
import { createOrder, verifyPayment, handleCcavenueResponse } from "../controllers/paymentController.js";

const router = Router();

// /api/payments/create-order -> initiate CCAvenue payment
router.post("/create-order", createOrder);

// /api/payments/ccavenue-response -> CCAvenue gateway callback POST route
router.post("/ccavenue-response", handleCcavenueResponse);

// /api/payments/verify -> legacy verify endpoint
router.post("/verify", verifyPayment);

export default router;
