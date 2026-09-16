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


try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (_e) {
  // Ignore DNS override errors on cPanel shared hosting
}

dotenv.config();

// Validate critical environment variables on startup
const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];
REQUIRED_ENV_VARS.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ CRITICAL ERROR: Environment variable "${envVar}" is missing!`);
  }
});
console.log("✅ Environment variables validated successfully.");

const app = express();

// Enable trust proxy for Render deployment (required by express-rate-limit)
app.set("trust proxy", 1);


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

// ✅ JSON & Form body parse pannanum (req.body work aaga)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Admin Auth Routes register pannanum
app.use(["/api/admin", "/admin"], authRoutes);

// ✅ User Auth Routes register pannanum
app.use(["/api/user", "/user"], userRoutes);

app.use(["/api/doctor", "/doctor"], doctorRoutes);

app.use(["/api/appointments", "/appointments"], appointmentRoutes);

app.use(["/api/payments", "/payments"], paymentRoutes);



// Health check
app.get("/", (req, res) => {
  res.send("✅ Hospital Server Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Hospital Server Started on Port ${PORT}`);
});

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}