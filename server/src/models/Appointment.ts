import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  pasentname: string;
  pasentmail: string;
  pasentnumber: string;
  appointmenttime: Date;
  speciality: string;
  subject?: string;
  status: "pending" | "approved" | "cancelled" | "completed" | "missed";
  assignedDoctor?: mongoose.Types.ObjectId;
  paymentStatus: "pending" | "paid" | "failed";
  paymentId?: string;
  amount?: number;
  meetingLink?: string;
  prescription?: string;
  createdAt: Date;
  updatedAt: Date;
}


const AppointmentSchema: Schema = new Schema(
  {
    pasentname: { type: String, required: true },
    pasentmail: { type: String, required: true },
    pasentnumber: { type: String, required: true },
    appointmenttime: { type: Date, required: true },
    speciality: { type: String, required: true },
    subject: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed", "missed"],
      default: "pending",
    },
    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentId: { type: String, default: "" },
    amount: { type: Number, default: 1000 },
    meetingLink: { type: String, default: "" },
    prescription: { type: String, default: "" },
  },
  { timestamps: true }
);

// [NEW INDEX ADDED HERE]
AppointmentSchema.index(
  { appointmenttime: 1, speciality: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { status: { $ne: "cancelled" } } 
  }
);
AppointmentSchema.index({ pasentmail: 1 });
AppointmentSchema.index({ createdAt: -1 });

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);

