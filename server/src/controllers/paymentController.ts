import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

// Razorpay instans-ஐ .env load 
let razorpay: Razorpay | null = null;
try {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (key_id && key_secret) {
    razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  } else {
    console.warn("⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from environment variables. Razorpay payment integration will not work.");
  }
} catch (err) {
  console.error("❌ Failed to initialize Razorpay:", err);
}

// 1. Create a new order 
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body; // Amount in INR (Ex: 1000)

    if (!amount) {
      res.status(400).json({ message: "Amount is required" });
      return;
    }

    if (!razorpay) {
      res.status(500).json({
        message: "Razorpay payment gateway is not configured on the server. Please check environment variables (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)."
      });
      return;
    }

    const options = {
      amount: Number(amount) * 100, // Razorpay-க்கு convert to paisa (₹1 = 100 Paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order); // Razorpay வழங்கிய ஆர்டர் விவரங்களை அனுப்புகிறோம்
  } catch (error: any) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

// 2. பேமெண்ட் செக்யூரிட்டி செக் (Verify Payment Signature)
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay) {
      res.status(500).json({
        message: "Razorpay payment gateway is not configured on the server.",
        success: false
      });
      return;
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    // Razorpay சிக்னேச்சரும் நமது கணக்கீடும் ஒத்துப்போகிறதா என்று பார்க்கிறோம்
    if (razorpay_signature === expectedSign) {
      res.status(200).json({ message: "Payment verified successfully", success: true });
    } else {
      res.status(400).json({ message: "Invalid payment signature", success: false });
    }
  } catch (error: any) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ message: "Server error during verification", error: error.message });
  }
};
