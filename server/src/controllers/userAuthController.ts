import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { sendResetOTPEmail } from "../config/emailService.js";

// ─────────────────────────────────────────
// REGISTER — New patient create பண்ண
// ─────────────────────────────────────────
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, age, gender, bloodGroup } = req.body;

    // 1. Empty check
    if (!name || !email || !password || !phone || !age || !gender) {
      res.status(400).json({ message: "Please fill all required fields" });
      return;
    }

    // 2. Email already registered-ஆ check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered. Please login." });
      return;
    }

    // 3. Password hash பண்ணு (plain text save பண்ணக்கூடாது)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. New user DB-ல save பண்ணு
    const newUser = await User.create({
      name,
      
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      bloodGroup: bloodGroup || "Unknown",
    });

    res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────
// LOGIN — Existing patient login பண்ண
// ─────────────────────────────────────────
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Empty check
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    // 2. DB-ல email search பண்ணு
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // 3. Password match பண்ணு
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // 4. JWT Token generate பண்ணு
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // 7 days valid
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        bloodGroup: user.bloodGroup,
        address: user.address || "",
        alternatePhone: user.alternatePhone || "",
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────
// GET ALL USERS — Admin-க்கு patients list
// ─────────────────────────────────────────
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Password தவிர மற்ற எல்லாம் return பண்ணு
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────
// UPDATE PROFILE — Update patient details
// ─────────────────────────────────────────
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, phone, age, gender, bloodGroup, address, alternatePhone } = req.body;

    // Verify JWT Token and ownership
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized access: Token missing." });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized access: Token invalid." });
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      res.status(401).json({ message: "Unauthorized access: Token invalid or expired." });
      return;
    }

    if (decoded.id !== id && decoded.role !== "admin") {
      res.status(403).json({ message: "Forbidden: You can only update your own profile details." });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (age) user.age = Number(age);
    if (gender) user.gender = gender;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (address !== undefined) user.address = address;
    if (alternatePhone !== undefined) user.alternatePhone = alternatePhone;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        address: user.address || "",
        alternatePhone: user.alternatePhone || "",
      },
    });
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// FORGOT PASSWORD — Generate OTP and email it
// ─────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Please provide your email address" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "No account found with this email address" });
      return;
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = otpExpires;
    await user.save();

    const emailSent = await sendResetOTPEmail({
      to: user.email,
      patientName: user.name,
      otp,
    });

    if (!emailSent) {
      res.status(500).json({ message: "Failed to send reset code. Please try again." });
      return;
    }

    res.status(200).json({ message: "Verification code sent to your email address" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────
// RESET PASSWORD — Verify OTP and set new password
// ─────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if OTP matches and is not expired
    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    if (!user.resetPasswordOTPExpires || new Date() > user.resetPasswordOTPExpires) {
      res.status(400).json({ message: "Verification code has expired. Please request a new one." });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset password fields
    user.resetPasswordOTP = null as any;
    user.resetPasswordOTPExpires = null as any;
    await user.save();

    res.status(200).json({ message: "Password updated successfully! Please login with your new password." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────
// VERIFY OTP — Verify OTP correctness
// ─────────────────────────────────────────
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: "Please provide email and verification code" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if OTP matches and is not expired
    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    if (!user.resetPasswordOTPExpires || new Date() > user.resetPasswordOTPExpires) {
      res.status(400).json({ message: "Verification code has expired. Please request a new one." });
      return;
    }

    res.status(200).json({ message: "Verification successful" });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────
// GET PROFILE — Fetch single patient details
// ─────────────────────────────────────────
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        address: user.address || "",
        alternatePhone: user.alternatePhone || "",
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




