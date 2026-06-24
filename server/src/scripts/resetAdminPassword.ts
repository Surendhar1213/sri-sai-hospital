import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "node:dns";
import { Admin } from "../models/Admin.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ DB Connected");

    const newPassword = "srisai@123"; // ← Unga new password idhaan

    const hashed = await bcrypt.hash(newPassword, 12);
    
    const result = await Admin.updateOne(
      { username: "admin" },
      { password: hashed }
    );

    if (result.modifiedCount === 1) {
      console.log("✅ Password updated successfully!");
      console.log("New password:", newPassword);
    } else {
      console.log("⚠️ Admin not found.");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

resetPassword();
