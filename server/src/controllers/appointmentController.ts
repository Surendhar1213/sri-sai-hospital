import { Request, Response } from "express";
import Appointment from "../models/Appointment.js";

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
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedDoctor } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, assignedDoctor },
      { new: true }
    ).populate("assignedDoctor", "name email speciality");

    if (!updatedAppointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    res.status(200).json({ message: "Appointment updated successfully", data: updatedAppointment });
  } catch (error: any) {
    res.status(500).json({ message: "Server error while updating appointment", error: error.message });
  }
};
