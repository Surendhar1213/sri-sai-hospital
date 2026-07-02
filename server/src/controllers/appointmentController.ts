import { Request, Response } from "express";
import Appointment from "../models/Appointment.js";

import { Doctor } from "../models/Doctor.js"; // Named import syntax (with curly braces)
// வரிகள் 5-6 இல் இப்படி மாற்றவும்:
import { createMeetEvent } from "../config/googleCalendar.js"; 
import { sendAppointmentEmail, sendPrescriptionEmail } from "../config/emailService.js"; // <--- sendPrescriptionEmail சேர்க்கவும்



// 1. User book panna new appointment create pannanum (With Double Booking Check)
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pasentname, pasentmail, pasentnumber, appointmenttime, speciality, subject } = req.body;

    if (!pasentname || !pasentmail || !pasentnumber || !appointmenttime || !speciality) {
      res.status(400).json({ message: "All required fields must be filled" });
      return;
    }

    // [CHECK IF SLOT ALREADY BOOKED]
       // [CHECK IF SLOT ALREADY BOOKED]
    console.log("--- BACKEND CHECK ---");
    console.log("Incoming time string:", appointmenttime);
    console.log("Converted Date object:", new Date(appointmenttime).toISOString());
    console.log("Incoming Speciality:", speciality);

    const existingBooking = await Appointment.findOne({
      appointmenttime: new Date(appointmenttime),
      speciality,
      status: { $ne: "cancelled" }
    });

    console.log("Existing Booking Found:", existingBooking ? "YES" : "NO");


    if (existingBooking) {
      res.status(400).json({ message: "This slot is already booked. Please choose another time." });
      return;
    }

    const newAppointment = new Appointment({
      pasentname,
      pasentmail,
      pasentnumber,
      appointmenttime,
      speciality,
      subject,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment submitted successfully!", data: newAppointment });
  } catch (error: any) {
    // MongoDB unique index constraints error handle panrom
    if (error.code === 11000) {
      res.status(400).json({ message: "This slot is already booked by someone else." });
      return;
    }
    res.status(500).json({ message: "Server error while saving appointment", error: error.message });
  }
};

// [NEW API CONTROLLER FOR GETTING BOOKED SLOTS]
export const getBookedSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, speciality } = req.query;

    if (!date || !speciality) {
      res.status(400).json({ message: "Date and speciality parameters are required." });
      return;
    }

    // Andha date-in start to end time window set panrom
    const startOfDay = new Date(date as string);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date as string);
    endOfDay.setHours(23, 59, 59, 999);

    // active appointments retrieve panrom
    const bookings = await Appointment.find({
      speciality: speciality as string,
      appointmenttime: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" }
    }).select("appointmenttime");

    // Book aana timeslots-ai mattum extract panni anupuroam (e.g. ["2026-07-02T16:00:00.000Z"])
    const bookedTimes = bookings.map(b => b.appointmenttime.toISOString());
    res.status(200).json(bookedTimes);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching booked slots", error: error.message });
  }
};

// 2. Admin dashboard-ku ella appointments-aiyum fetch pannanum
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find().populate("assignedDoctor", "name email speciality").sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: "Server error while fetching appointments", error: error.message });
  }
};

// 3. Admin status change panna/Doctor assign panna update API
// 3. Admin status change panna/Doctor assign panna update API
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedDoctor, prescription } = req.body; // prescription details handling parameters

    // 1. Existing appointment query parameters get pannanum
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    let meetingLink = appointment.meetingLink;

    // 2. Checking if Status is updated to "approved" AND Doctor is assigned AND meetingLink not generated yet
    if (status === "approved" && assignedDoctor && !meetingLink) {
      // Find Doctor details (especially doctor email)
      const doctorDetails = await Doctor.findById(assignedDoctor);
      
      if (doctorDetails) {
        console.log(`📅 Scheduling Meet: Patient(${appointment.pasentmail}) with Doctor(${doctorDetails.email})`);
        
        // Google Calendar call panni meet link gen panrom
        const generatedLink = await createMeetEvent({
          patientEmail: appointment.pasentmail,
          doctorEmail: doctorDetails.email,
          speciality: appointment.speciality,
          startTime: new Date(appointment.appointmenttime),
        });

        if (generatedLink) {
          meetingLink = generatedLink; // save setup link details
        }
      }
    }

    // 3. DB values update panrom
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        status, 
        assignedDoctor, 
        meetingLink,
        prescription: prescription !== undefined ? prescription : appointment.prescription
      },
      { new: true }
    ).populate("assignedDoctor", "name email speciality");

    if (!updatedAppointment) {
      res.status(404).json({ message: "Appointment not found after update" });
      return;
    }

    // 4. Send Confirmation Email if status approved now
    if (status === "approved" && updatedAppointment.assignedDoctor) {
      const doctorObj = updatedAppointment.assignedDoctor as any;
      const formattedTime = new Date(updatedAppointment.appointmenttime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      // Email trigger to Patient
      await sendAppointmentEmail({
        to: updatedAppointment.pasentmail,
        patientName: updatedAppointment.pasentname,
        doctorName: doctorObj.name,
        speciality: updatedAppointment.speciality,
        time: formattedTime,
        meetingLink: updatedAppointment.meetingLink,
      });
      // வரிகள் 178-179 க்கு நடுவில் (sendAppointmentEmail பிளாக்கிற்கு கீழே) இதைச் சேர்க்கவும்:

// Email trigger for Prescription to Patient
        if (prescription && updatedAppointment.assignedDoctor) {
          const doctorObj = updatedAppointment.assignedDoctor as any;
          await sendPrescriptionEmail({
            to: updatedAppointment.pasentmail,
            patientName: updatedAppointment.pasentname,
            doctorName: doctorObj.name,
            prescription: updatedAppointment.prescription || ""
  });
}


    }

    res.status(200).json({ message: "Appointment updated successfully", data: updatedAppointment });
  } catch (error: any) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ message: "Server error while updating appointment", error: error.message });
  }
};

