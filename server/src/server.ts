import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "node:dns";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";   // ← ADD THIS LINE
import doctorRoutes from "./routes/doctorRoutes.js";


dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

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


// Health check
app.get("/", (req, res) => {
  res.send("✅ Hospital Server Running");
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Database Connected Successfully");

    app.listen(5000, () => {
      console.log("✅ Hospital Server Started on Port 5000");
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error");
    console.error(err);
  }
}

start();