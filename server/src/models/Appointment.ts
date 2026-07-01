import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  pasentname: string;
  pasentmail: string;
  pasentnumber: string;
  appointmenttime: Date;
  speciality: string;
  subject?: string;
  status: "pending" | "approved" | "cancelled";
  assignedDoctor?: mongoose.Types.ObjectId;
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
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
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
export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);

