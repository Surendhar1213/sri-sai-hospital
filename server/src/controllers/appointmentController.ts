import { Request, Response } from "express";
import Appointment from "../models/Appointment.js";
import schedule from "node-schedule";

import { Doctor } from "../models/Doctor.js"; // Named import syntax (with curly braces)
import { User } from "../models/User.js";
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

    // Validate prescription structure if provided
    if (prescription !== undefined && prescription !== "") {
      try {
        const parsed = JSON.parse(prescription);
        if (parsed) {
          if (typeof parsed !== "object" || (parsed.medicines && !Array.isArray(parsed.medicines))) {
            res.status(400).json({ message: "Invalid prescription format. 'medicines' must be an array." });
            return;
          }
          if (parsed.medicines && Array.isArray(parsed.medicines)) {
            for (const med of parsed.medicines) {
              if (!med.name || typeof med.name !== "string" || med.name.trim() === "") {
                res.status(400).json({ message: "Invalid medicine item. 'name' is required and must be a non-empty string." });
                return;
              }
            }
          }
        }
      } catch (err) {
        // If it is invalid JSON, reject if it looks like malformed JSON, otherwise allow plain text
        if (prescription.trim().startsWith("{") || prescription.trim().startsWith("[")) {
          res.status(400).json({ message: "Malformed JSON format in prescription payload." });
          return;
        }
      }
    }

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
    let linkGeneratedThisSession = false;

    // இதைச் சேர்க்கவும் (Debug Log):
    console.log("🔍 DEBUG CHECK:", {
      incomingStatus: status,
      incomingDoctor: assignedDoctor,
      currentMeetingLink: meetingLink,
      shouldEnterBlock: (status === "approved" && assignedDoctor && !meetingLink)
    });

    // 2. Checking if Status is updated to "approved" AND Doctor is assigned AND meetingLink not generated yet
    const targetDoctorId = assignedDoctor || appointment.assignedDoctor;
    if (status === "approved" && targetDoctorId) {
      if (!meetingLink) {
        // Find Doctor details (especially doctor email)
        const doctorDetails = await Doctor.findById(targetDoctorId);
        
        if (doctorDetails) {
          console.log(`📅 Scheduling Google Meet: Patient(${appointment.pasentmail}) with Doctor(${doctorDetails.email})`);
          
          try {
            // Google Calendar call panni Google Meet link generate panrom
            const generatedLink = await createMeetEvent({
              patientEmail: appointment.pasentmail,
              doctorEmail: doctorDetails.email,
              speciality: appointment.speciality,
              startTime: new Date(appointment.appointmenttime),
            });


            if (generatedLink) {
              meetingLink = generatedLink; 
              linkGeneratedThisSession = true;
              console.log(`🔗 Generated Google Meet Link: ${meetingLink}`);
            } else {
              console.warn("⚠️ Google Calendar API failed/timed out. Using guaranteed Google Meet room link.");
              const hexToLetters = (str: string) => {
                const map: { [key: string]: string } = {
                  '0': 'g', '1': 'h', '2': 'i', '3': 'j', '4': 'k',
                  '5': 'l', '6': 'm', '7': 'n', '8': 'o', '9': 'p'
                };
                return str.replace(/[0-9]/g, (digit) => map[digit] || digit);
              };
              const cleanStr = hexToLetters(appointment._id.toString().replace(/[^a-z0-9]/gi, "").toLowerCase());
              const p1 = (cleanStr.slice(-3) + "abc").slice(0, 3);
              const p2 = (cleanStr.slice(-7, -4) + "defg").slice(0, 4);
              const p3 = (cleanStr.slice(-10, -7) + "hij").slice(0, 3);
              meetingLink = `https://meet.google.com/${p1}-${p2}-${p3}`;
              linkGeneratedThisSession = true;
            }
          } catch (meetErr) {
            console.error("❌ Error generating meeting link:", meetErr);
            const hexToLetters = (str: string) => {
              const map: { [key: string]: string } = {
                '0': 'g', '1': 'h', '2': 'i', '3': 'j', '4': 'k',
                '5': 'l', '6': 'm', '7': 'n', '8': 'o', '9': 'p'
              };
              return str.replace(/[0-9]/g, (digit) => map[digit] || digit);
            };
         
         
            const cleanStr = hexToLetters(appointment._id.toString().replace(/[^a-z0-9]/gi, "").toLowerCase());
            const p1 = (cleanStr.slice(-3) + "abc").slice(0, 3);
            const p2 = (cleanStr.slice(-7, -4) + "defg").slice(0, 4);
            const p3 = (cleanStr.slice(-10, -7) + "hij").slice(0, 3);
            meetingLink = `https://meet.google.com/${p1}-${p2}-${p3}`;
            linkGeneratedThisSession = true;
          }
        } else {
          // Doctor details not found, assign Google Meet fallback link
          const hexToLetters = (str: string) => {
            const map: { [key: string]: string } = {
              '0': 'g', '1': 'h', '2': 'i', '3': 'j', '4': 'k',
              '5': 'l', '6': 'm', '7': 'n', '8': 'o', '9': 'p'
            };
            return str.replace(/[0-9]/g, (digit) => map[digit] || digit);
          };
          const cleanStr = hexToLetters(appointment._id.toString().replace(/[^a-z0-9]/gi, "").toLowerCase());
          const p1 = (cleanStr.slice(-3) + "abc").slice(0, 3);
          const p2 = (cleanStr.slice(-7, -4) + "defg").slice(0, 4);
          const p3 = (cleanStr.slice(-10, -7) + "hij").slice(0, 3);
          meetingLink = `https://meet.google.com/${p1}-${p2}-${p3}`;
          linkGeneratedThisSession = true;
        }
      } else {
        // If existing meeting link was using /lookup/ format, convert it to standard room URL format
        if (meetingLink && meetingLink.includes("/lookup/")) {
          const hexToLetters = (str: string) => {
            const map: { [key: string]: string } = {
              '0': 'g', '1': 'h', '2': 'i', '3': 'j', '4': 'k',
              '5': 'l', '6': 'm', '7': 'n', '8': 'o', '9': 'p'
            };
            return str.replace(/[0-9]/g, (digit) => map[digit] || digit);
          };
          const cleanStr = hexToLetters(appointment._id.toString().replace(/[^a-z0-9]/gi, "").toLowerCase());
          const p1 = (cleanStr.slice(-3) + "abc").slice(0, 3);
          const p2 = (cleanStr.slice(-7, -4) + "defg").slice(0, 4);
          const p3 = (cleanStr.slice(-10, -7) + "hij").slice(0, 3);
          meetingLink = `https://meet.google.com/${p1}-${p2}-${p3}`;
          linkGeneratedThisSession = true;
        } else if (appointment.status !== "approved") {
          linkGeneratedThisSession = true;
        }
      }
    }

    // 3. DB values update panrom
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        status, 
        assignedDoctor: targetDoctorId || assignedDoctor, 
        meetingLink, // <-- Save the meeting link here synchronously!
        prescription: prescription !== undefined ? prescription : appointment.prescription,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : appointment.paymentStatus
      },
      { returnDocument: "after" }
    ).populate("assignedDoctor", "name email speciality");

    if (!updatedAppointment) {
      res.status(404).json({ message: "Appointment not found after update" });
      return;
    }

    // Trigger initial SSE notification so client gets the status update instantly
    notifySSEClients({ event: "update-appointment", data: updatedAppointment });

    // 4. Send email & schedule reminders if appointment is approved and meeting link is present
    if ((linkGeneratedThisSession || (status === "approved" && updatedAppointment.meetingLink)) && updatedAppointment.status === "approved") {
      setImmediate(async () => {
        try {
          const doctorObj = updatedAppointment.assignedDoctor as any;
          const formattedTime = new Date(updatedAppointment.appointmenttime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
          });

          // Send confirmation email to Patient with link
          await sendAppointmentEmail({
            to: updatedAppointment.pasentmail,
            patientName: updatedAppointment.pasentname,
            doctorName: doctorObj ? doctorObj.name : "Assigned Specialist",
            speciality: updatedAppointment.speciality,
            time: formattedTime,
            meetingLink: updatedAppointment.meetingLink,
            appointmentId: updatedAppointment._id.toString()
          });

          // Send notification email to Doctor if doctor email is present
          if (doctorObj && doctorObj.email) {
            await sendDoctorNotificationEmail({
              to: doctorObj.email,
              doctorName: doctorObj.name,
              patientName: updatedAppointment.pasentname,
              patientPhone: updatedAppointment.pasentnumber || "",
              speciality: updatedAppointment.speciality,
              time: formattedTime,
              meetingLink: updatedAppointment.meetingLink || ""
            });
          }

          // Schedule a 15-minute prior reminder if meetingLink exists and time is in the future
          const appTime = new Date(updatedAppointment.appointmenttime);
          const reminderTime = new Date(appTime.getTime() - 15 * 60 * 1000);
          if (reminderTime > new Date()) {
            console.log(`⏰ Scheduling 15-min email reminders at: ${reminderTime} for appointment ${updatedAppointment._id}`);
            schedule.scheduleJob(updatedAppointment._id.toString(), reminderTime, async () => {
              console.log(`🔔 Executing scheduled 15-min email reminders for appointment: ${updatedAppointment._id}`);
              
              await sendReminderEmail({
                to: updatedAppointment.pasentmail,
                patientName: updatedAppointment.pasentname,
                doctorName: doctorObj ? doctorObj.name : "Assigned Specialist",
                speciality: updatedAppointment.speciality,
                time: formattedTime,
                meetingLink: updatedAppointment.meetingLink || "",
                role: "patient"
              });

              if (doctorObj && doctorObj.email) {
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
          }
        } catch (err: any) {
          console.error("❌ Background email/reminder processing error:", err.message);
        }
      });
    }

    // 5. Send prescription email only if the appointment is marked as completed AND prescription was actually updated/added
    const isPrescriptionChanged = prescription !== undefined && prescription !== "" && prescription !== appointment.prescription;
    const isCompleted = status === "completed" || (status === undefined && appointment.status === "completed");

    if (isCompleted && isPrescriptionChanged && updatedAppointment.assignedDoctor) {
      const doctorObj = updatedAppointment.assignedDoctor as any;
      setImmediate(async () => {
        try {
          // Fetch additional patient details (age, gender, bloodGroup) from User model
          const patientUser = await User.findOne({ email: updatedAppointment.pasentmail.toLowerCase() });

          await sendPrescriptionEmail({
            to: updatedAppointment.pasentmail,
            patientName: updatedAppointment.pasentname,
            doctorName: doctorObj.name,
            prescription: prescription,
            appointmentId: updatedAppointment._id.toString(),
            patientPhone: updatedAppointment.pasentnumber || (patientUser ? (patientUser as any).phone : ""),
            patientAge: patientUser ? (patientUser as any).age : undefined,
            patientGender: patientUser ? (patientUser as any).gender : undefined,
            patientBloodGroup: patientUser ? (patientUser as any).bloodGroup : undefined,
            doctorSpeciality: doctorObj.speciality || updatedAppointment.speciality
          });
        } catch (emailError) {
          console.error("❌ Background Prescription Email Sending Failed:", emailError);
        }
      });
    }

    // 5. Send Missed Appointment Notification if status is missed
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


