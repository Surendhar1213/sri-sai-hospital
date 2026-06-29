import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    // Patient full name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Login- use
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Hashed password save 
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // Patient phone number
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Patient age
    age: {
      type: Number,
      required: [true, "Age is required"],
    },

    // Male / Female / Other
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },

    // Blood group — optional
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },

    // User role — always "user"
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true } // createdAt, updatedAt auto add ஆகும்
);

export const User = mongoose.model("User", UserSchema);
