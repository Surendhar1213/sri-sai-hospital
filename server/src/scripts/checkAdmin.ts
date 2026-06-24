import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import { Admin } from "../models/Admin.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    const admin = await Admin.findOne({ username: "admin" });

    if (admin) {
        console.log("✅ Admin found in DB!");
        console.log("Username:", admin.username);
        console.log("Role:", admin.role);
        console.log("Password hash (first 20 chars):", admin.password.substring(0, 20) + "...");
        console.log("Created at:", admin.createdAt);
    } else {
        console.log("❌ No admin found in DB!");
    }

    process.exit(0);
};

check();
