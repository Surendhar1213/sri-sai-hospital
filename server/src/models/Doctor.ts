import { Schema, model, Document } from "mongoose";

// Doctor structure-oda TypeScript interface check rules
export interface IDoctor extends Document {
  name: string;
  speciality: string;
  email: string;
  experience: number;
  timing: string;
  isAvailable: boolean;
  blockedDates: string[]; // Store YYYY-MM-DD strings
  createdAt: Date;
}

// Database-la custom model collection create panna schema definitions
const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, trim: true },
    speciality: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    experience: { type: Number, required: true },
    timing: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }, // Available/Unavailable check
    blockedDates: { type: [String], default: [] }, // Blocked slot dates YYYY-MM-DD
  },
  { timestamps: true } // Auto create "createdAt" and "updatedAt"
);

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
