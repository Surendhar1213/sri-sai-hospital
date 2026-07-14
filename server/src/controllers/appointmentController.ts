import { Request, Response } from "express";
import Appointment from "../models/Appointment.js";
import schedule from "node-schedule";

import { Doctor } from "../models/Doctor.js"; // Named import syntax (with curly braces)
// 
import { createMeetEvent } from "../config/googleCalendar.js"; 
import { sendAppointmentEmail, sendPrescriptionEmail, sendBookingReceiptEmail, sendDoctorNotificationEmail, sendBookingFailureEmail, sendReminderEmail, sendMissedAppointmentEmail } from "../config/emailService.js";



let sseClients: Response[] = [];

export const appointmentSSE = (req: Request, res: Response): void => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*"
  });

  // Keep-alive heartbeat to prevent timeout
  const keepAlive = setInterval(() => {
    res.write(": keepalive\n\n");
  }, 20000);

  sseClients.push(res);

  req.on("close", () => {
    clearInterval(keepAlive);
    sseClients = sseClients.filter((client) => client !== res);
  });
};

export const notifySSEClients = (data: any) => {
  sseClients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

// 1. User book panna new appointment create pannanum (With Double Booking Check)
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pasentname, pasentmail, pasentnumber, appointmenttime, speciality, subject, paymentStatus, paymentId, amount } = req.body;

    if (!pasentname || !pasentmail || !pasentnumber || !appointmenttime || !speciality) {
      res.status(400).json({ message: "All required fields must be filled" });
      return;
    }

    // [CHECK IF DOCTOR IS BLOCKED FOR THIS DATE]
    const dateObj = new Date(appointmenttime);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString();
    const bookingDateStr = localISOTime.split("T")[0] || ""; // YYYY-MM-DD in local time representation

    const doctorsOfSpeciality = await Doctor.find({ speciality, isAvailable: true });
    if (doctorsOfSpeciality.length > 0) {
      const allBlocked = doctorsOfSpeciality.every(doc => doc.blockedDates && doc.blockedDates.includes(bookingDateStr));
      if (allBlocked) {
        res.status(400).json({ message: `Sorry, specialists for ${speciality} are not available on ${bookingDateStr}.` });
        return;
      }
    }

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
      paymentStatus: paymentStatus || "pending",
      paymentId: paymentId || "",
      amount: amount || 1000,
      status: paymentStatus === "paid" ? "pending" : "cancelled"
    });

    await newAppointment.save();

    // 💡 [இந்த இடத்தில் தான் சேர்க்க வேண்டும்]
    if (paymentStatus === "paid") {
      const formattedTime = new Date(newAppointment.appointmenttime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });
      setImmediate(async () => {
        try {
          await sendBookingReceiptEmail({
            to: newAppointment.pasentmail || "",
            patientName: newAppointment.pasentname || "",
            amount: newAppointment.amount || 1000,
            paymentId: newAppointment.paymentId || "", // <--- empty string fallback
            speciality: newAppointment.speciality || "",
            time: formattedTime,
          });
        } catch (emailErr) {
          console.error("❌ Failed to send automatic booking receipt email in background:", emailErr);
        }
      });
    } else if (paymentStatus === "failed") {
      const formattedTime = new Date(newAppointment.appointmenttime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });
      setImmediate(async () => {
        try {
          await sendBookingFailureEmail({
            to: newAppointment.pasentmail || "",
            patientName: newAppointment.pasentname || "",
            amount: newAppointment.amount || 1000,
            paymentId: newAppointment.paymentId || "",
            speciality: newAppointment.speciality || "",
            time: formattedTime,
          });
        } catch (emailErr) {
          console.error("❌ Failed to send booking failure/cancellation email in background:", emailErr);
        }
      });
    }

    
    // Trigger SSE notification
    notifySSEClients({ event: "new-appointment", data: newAppointment });

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

    const dateStr = (date as string).split("T")[0] || ""; // "YYYY-MM-DD"

    // Fetch doctors of this speciality
    const doctors = await Doctor.find({ speciality: speciality as string, isAvailable: true });
    
    // Check if ALL doctors of this specialty have blocked this date
    const allDoctorsBlocked = doctors.length > 0 && doctors.every(doc => doc.blockedDates && doc.blockedDates.includes(dateStr));

    if (allDoctorsBlocked) {
      // If blocked, return all possible slots as booked
      const TIME_SLOTS = [
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
        "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
      ];
      
      const blockedTimes = TIME_SLOTS.map(slotStr => {
        const parts = slotStr.split(" ");
        const time = parts[0] || "";
        const modifier = parts[1] || "";
        const timeParts = time.split(":").map(Number);
        let hours = timeParts[0] || 0;
        let minutes = timeParts[1] || 0;
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        
        const dateObj = new Date(date as string);
        dateObj.setHours(hours, minutes, 0, 0);
        return dateObj.toISOString();
      });
      
      res.status(200).json(blockedTimes);
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

// 2. Admin dashboard-ku/User profile-ku appointments-ai fetch pannanum
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    const filter = email ? { pasentmail: String(email) } : {};
    const appointments = await Appointment.find(filter).populate("assignedDoctor", "name email speciality").sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: "Server error while fetching appointments", error: error.message });
  }
};


// 3. Admin status change panna/Doctor assign panna update API
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedDoctor, prescription, paymentStatus } = req.body; // prescription details handling parameters

    // 1. Existing appointment query parameters get pannanum
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Checking if the assigned doctor is already booked at this exact time slot for another approved/completed appointment
    if ((status === "approved" || status === "completed") && assignedDoctor) {
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: id as any },
        assignedDoctor,
        appointmenttime: new Date(appointment.appointmenttime),
        status: { $in: ["approved", "completed"] }
      });

      if (conflictingAppointment) {
        res.status(400).json({
          message: "Conflict: This doctor is already assigned to another approved/completed appointment at this time slot."
        });
        return;
      }
    }

    let meetingLink = appointment.meetingLink;

    // இதைச் சேர்க்கவும் (Debug Log):
    console.log("🔍 DEBUG CHECK:", {
      incomingStatus: status,
      incomingDoctor: assignedDoctor,
      currentMeetingLink: meetingLink,
      shouldEnterBlock: (status === "approved" && assignedDoctor && !meetingLink)
    });

        // 2. Checking if Status is updated to "approved" AND Doctor is assigned AND meetingLink not generated yet
    if (status === "approved" && assignedDoctor && !meetingLink) {
      // Find Doctor details (especially doctor email)
      const doctorDetails = await Doctor.findById(assignedDoctor);
      
      if (doctorDetails) {
        console.log(`📅 Scheduling Google Meet: Patient(${appointment.pasentmail}) with Doctor(${doctorDetails.email})`);
        
        // Google Calendar call panni Google Meet link generate panrom
        const generatedLink = await createMeetEvent({
          patientEmail: appointment.pasentmail,
          doctorEmail: doctorDetails.email,
          speciality: appointment.speciality,
          startTime: new Date(appointment.appointmenttime),
        });

        if (generatedLink) {
          meetingLink = generatedLink; 
          console.log(`🔗 Generated Google Meet Link: ${meetingLink}`);
        } else {
          console.error("❌ Google Calendar API failed to return meeting link.");
          meetingLink = ""; // Fail aana empty string-ah podrom
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
        prescription: prescription !== undefined ? prescription : appointment.prescription,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : appointment.paymentStatus
      },
      { returnDocument: "after" }
    ).populate("assignedDoctor", "name email speciality");

    if (!updatedAppointment) {
      res.status(404).json({ message: "Appointment not found after update" });
      return;
    }

       // 4. Send Confirmation Email if status approved now (Wrapped in Try-Catch)
    if (status === "approved" && updatedAppointment.assignedDoctor) {
      const doctorObj = updatedAppointment.assignedDoctor as any;
      const formattedTime = new Date(updatedAppointment.appointmenttime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      // API Response ஐ லேட் செய்யாமல் இருக்க பின்னணியில் (Asynchronously) மின்னஞ்சல்களை அனுப்புகிறோம்
      setImmediate(async () => {
        try {
          console.log("✉️ Sending appointment confirmation email in background...");
          // Email trigger to Patient
          await sendAppointmentEmail({
            to: updatedAppointment.pasentmail,
            patientName: updatedAppointment.pasentname,
            doctorName: doctorObj.name,
            speciality: updatedAppointment.speciality,
            time: formattedTime,
            meetingLink: updatedAppointment.meetingLink,
          });

          // Email trigger for Prescription to Patient
          if (prescription) {
            await sendPrescriptionEmail({
              to: updatedAppointment.pasentmail,
              patientName: updatedAppointment.pasentname,
              doctorName: doctorObj.name,
              prescription: updatedAppointment.prescription || ""
            });
          }
        } catch (emailError) {
          console.error("❌ Background Email Sending Failed:", emailError);
        }
      });

      // Schedule a 15-minute prior reminder if meetingLink exists and time is in the future
      try {
        if (updatedAppointment.meetingLink) {
          const appTime = new Date(updatedAppointment.appointmenttime);
          const reminderTime = new Date(appTime.getTime() - 15 * 60 * 1000); // 15 minutes before

          if (reminderTime > new Date()) {
            console.log(`⏰ Scheduling 15-min email reminders at: ${reminderTime} for appointment ${updatedAppointment._id}`);
            
            schedule.scheduleJob(updatedAppointment._id.toString(), reminderTime, async () => {
              console.log(`🔔 Executing scheduled 15-min email reminders for appointment: ${updatedAppointment._id}`);
              
              // Send email alert to Patient
              await sendReminderEmail({
                to: updatedAppointment.pasentmail,
                patientName: updatedAppointment.pasentname,
                doctorName: doctorObj.name,
                speciality: updatedAppointment.speciality,
                time: formattedTime,
                meetingLink: updatedAppointment.meetingLink || "",
                role: "patient"
              });

              // Send email alert to Doctor
              if (doctorObj.email) {
                await sendReminderEmail({
                  to: doctorObj.email,
                  patientName: updatedAppointment.pasentname,
                  doctorName: doctorObj.name,
                  speciality: updatedAppointment.speciality,
                  time: formattedTime,
                  meetingLink: updatedAppointment.meetingLink || "",
                  role: "doctor"
                });
              }
            });
          } else {
            console.log(`⚠️ Reminder time ${reminderTime} is in the past. Skipping schedule.`);
          }
        }
      } catch (emailError) {
        // மெயில் அனுப்ப முடியவில்லை என்றாலும் லாக் மட்டும் காட்டிவிட்டு சர்வர் தொடர்ந்து ஓடும்
        console.error("❌ Email Sending / Scheduling Failed but Appointment is saved:", emailError);
      }
    }

    // 5. Send Missed Appointment Notification if status is missed (Wrapped in Try-Catch)
    if (status === "missed") {
      const doctorObj = updatedAppointment.assignedDoctor as any;
      const doctorName = doctorObj ? doctorObj.name : "Assigned Specialist";
      const formattedTime = new Date(updatedAppointment.appointmenttime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      setImmediate(async () => {
        try {
          console.log("✉️ Sending missed appointment email in background...");
          // Email to Patient
          await sendMissedAppointmentEmail({
            to: updatedAppointment.pasentmail,
            patientName: updatedAppointment.pasentname,
            doctorName,
            speciality: updatedAppointment.speciality,
            time: formattedTime,
          });
        } catch (err) {
          console.error("❌ Failed to send missed email notification:", err);
        }
      });
    }


    // Trigger SSE notification
    notifySSEClients({ event: "update-appointment", data: updatedAppointment });

    res.status(200).json({ message: "Appointment updated successfully", data: updatedAppointment });
  } catch (error: any) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ message: "Server error while updating appointment", error: error.message });
  }
};

// 6. Get payments and revenue statistics (Today, Weekly, Monthly)
export const getRevenueStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    
    // Today starts at 00:00:00 in local timezone
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of this week (assume Monday as start of week)
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);
    
    // Start of this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all paid appointments
    const paidAppointments = await Appointment.find({ paymentStatus: "paid" });

    let todayRevenue = 0;
    let todayCount = 0;
    let weekRevenue = 0;
    let weekCount = 0;
    let monthRevenue = 0;
    let monthCount = 0;
    let totalRevenue = 0;
    let totalCount = 0;

    paidAppointments.forEach((app) => {
      const amount = app.amount || 1000;
      const appDate = new Date(app.createdAt || app.appointmenttime);
      
      totalRevenue += amount;
      totalCount += 1;

      if (appDate >= startOfToday) {
        todayRevenue += amount;
        todayCount += 1;
      }
      if (appDate >= startOfWeek) {
        weekRevenue += amount;
        weekCount += 1;
      }
      if (appDate >= startOfMonth) {
        monthRevenue += amount;
        monthCount += 1;
      }
    });

    res.status(200).json({
      today: { revenue: todayRevenue, count: todayCount },
      week: { revenue: weekRevenue, count: weekCount },
      month: { revenue: monthRevenue, count: monthCount },
      total: { revenue: totalRevenue, count: totalCount }
    });
  } catch (error: any) {
    console.error("❌ Error calculating revenue stats:", error);
    res.status(500).json({ message: "Server error calculating revenue stats", error: error.message });
  }
};

// 7. Check meeting link status (Too Early, Active, Expired)
export const checkMeetingLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({ status: "error", message: "Appointment record not found." });
      return;
    }

    if (!appointment.meetingLink) {
      res.status(400).json({ status: "error", message: "Meeting link has not been generated yet. Please contact admin." });
      return;
    }

    const now = new Date();
    const appTime = new Date(appointment.appointmenttime);
    
    // Configurable validation bounds (in minutes)
    // TEMPORARY FOR DEMO/TESTING: Set to 24 hours (1440 mins) so links are active easily
    const earlyBoundMinutes = 1440; // 24 hours before
    const lateBoundMinutes = 1440;  // 24 hours after
    /*
    const earlyBoundMinutes = 15; // 15 mins before
    const lateBoundMinutes = 45;  // 45 mins after start time
    */

    const startTimeLimit = new Date(appTime.getTime() - earlyBoundMinutes * 60 * 1000);
    const endTimeLimit = new Date(appTime.getTime() + lateBoundMinutes * 60 * 1000);

    if (now < startTimeLimit) {
      const formattedTime = appTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      res.status(200).json({
        status: "early",
        message: `Too Early! This consultation starts at ${formattedTime}. Please try joining within 15 minutes of your slot.`,
      });
      return;
    }

    if (now > endTimeLimit) {
      res.status(200).json({
        status: "expired",
        message: "This consultation slot/meeting link has expired.",
      });
      return;
    }

    // Active slot
    res.status(200).json({
      status: "active",
      meetingLink: appointment.meetingLink,
    });
  } catch (error: any) {
    console.error("❌ Error validating meeting link:", error);
    res.status(500).json({ status: "error", message: "Failed to validate meeting slot.", error: error.message });
  }
};


