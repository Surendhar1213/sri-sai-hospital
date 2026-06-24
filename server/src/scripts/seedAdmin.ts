import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import dns from "node:dns";

import { Admin } from "../models/Admin.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);


// Environment variables configuration load
dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Connect database using MONGO_URI in .env file
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected for Seeding");

    // 2. Default credentials configure
    const username = "admin";
    const plainPassword = "srisaSaiHospitalAdminSecure123!" // Indha password neenga change pannanum na pannikalam

    // 3. Duplicate checks in database
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`⚠️ Admin with username '${username}' already exists.`);
      process.exit(0);
    }

    // 4. Secure hashing process (Salt rounds = 12)
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // 5. Database instance save
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log(`✅ Admin seeded successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${plainPassword}`);
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run the function
seedAdmin();
