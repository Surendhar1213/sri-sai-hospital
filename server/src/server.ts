import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "node:dns";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";   // ← ADD THIS LINE
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

// Validate critical environment variables on startup
const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];
REQUIRED_ENV_VARS.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ CRITICAL ERROR: Environment variable "${envVar}" is missing!`);
    process.exit(1);
  }
});
console.log("✅ Environment variables validated successfully.");

const app = express();

// ✅ Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ Response Compression
app.use(compression());

// ✅ CORS — Allow all origins dynamically (makes Vercel deployment seamless)
app.use(cors({
  origin: true,
  credentials: true,
}));

// ✅ JSON body parse pannanum (req.body work aaga)
app.use(express.json());

// ✅ Admin Auth Routes register pannanum
app.use("/api/admin", authRoutes);

// ✅ User Auth Routes register pannanum
app.use("/api/user", userRoutes);

app.use("/api/doctor", doctorRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/payments", paymentRoutes);



// Health check
app.get("/", (req, res) => {
  res.send("✅ Hospital Server Running");
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Database Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Hospital Server Started on Port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error");
    console.error(err);
  }
}

start();