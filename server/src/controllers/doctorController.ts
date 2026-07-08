import { Request, Response } from "express";
import { Doctor } from "../models/Doctor.js";

// Add Doctor logic
export const addDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, speciality, email, experience, timing } = req.body;

    // 1. Mandatory fields validation
    if (!name || !speciality || !email || !experience || !timing) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // 2. Database query: email verification
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      res.status(400).json({ message: "A doctor with this email already exists" });
      return;
    }

    // 3. New doctor record instantiating
    const newDoctor = new Doctor({
      name,
      speciality,
      email,
      experience,
      timing,
      isAvailable: true, // Default active/available
    });

    // 4. Save to Database
    await newDoctor.save();

    res.status(201).json({ 
      message: "Doctor registered successfully", 
      doctor: newDoctor 
    });
  } catch (error: any) {
    console.error("Add Doctor Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get All Doctors from Database
export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    // Database query: sort with latest registered doctor first
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json({ doctors });
  } catch (error: any) {
    console.error("Get All Doctors Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Update Doctor Controller (Status toggle and Details edit)
export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Request parameters matching database edit check
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body }, // Body dynamic variables (Name, Speciality, Experience, Timing, isAvailable etc.)
      { returnDocument: "after" } // Latest updated state output return
    );

    if (!updatedDoctor) {
      res.status(404).json({ message: "Doctor profile not found" });
      return;
    }

    res.status(200).json({ 
      message: "Doctor details updated successfully", 
      doctor: updatedDoctor 
    });
  } catch (error: any) {
    console.error("Update Doctor Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


// Delete Doctor Profile
export const deleteDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      res.status(404).json({ message: "Doctor profile not found" });
      return;
    }

    res.status(200).json({ message: "Doctor profile removed successfully from database" });
  } catch (error: any) {
    console.error("Delete Doctor Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


