import mongoose, { Schema } from "mongoose";

// scheme defining

const AdminSchema = new Schema(
    {
        username: { type: String, required: [true, "Username is required"], unique: true, trim: true, lowercase: true },
        password: { type: String, required: [true, "Password is required"] },
        role: { type: String, default: "admin" },
    },
    { timestamps: true }
);

export const Admin = mongoose.model("Admin", AdminSchema);

