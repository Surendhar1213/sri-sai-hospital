import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 1. Empty check
    if (!username || !password) {
      res.status(400).json({ message: "Please provide username and password" });
      return;
    }

    // 2. Database la indha username irukka nu check
    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // 3. Password match aagudha nu check
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // 4. JWT Token generate — successful login
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" } // 1 day valid
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        username: admin.username,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
