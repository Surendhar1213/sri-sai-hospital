import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();    // email user,pass complie load aagurathukku idhu best

// Nodemailer transport configuration (SMTP server properties setup)
const transporter = nodemailer.createTransport({
  service: "gmail", // standard Gmail service setup
  auth: {
    user: process.env.EMAIL_USER, // Environment variable for email user
    pass: process.env.EMAIL_PASS, // App password generate panni set pannanum
  },
});

interface AppointmentMailOptions {
  to: string;
  patientName: string;
  doctorName: string;
  speciality: string;
  time: string;
  meetingLink?: string | undefined;
}


interface PrescriptionMailOptions {
  to: string;
  patientName: string;
  doctorName: string;
  prescription: string;
}

// 1. Function to send Appointment Booking Email with Google Meet details
export const sendAppointmentEmail = async (options: AppointmentMailOptions) => {
  const { to, patientName, doctorName, speciality, time, meetingLink } = options;

  const mailOptions = {
    from: `"Sri Sai Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🏥 Appointment Confirmed - Sri Sai Hospital",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0d9488; text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">Sri Sai Hospital</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Your appointment has been successfully scheduled and confirmed!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Specialist:</td>
            <td style="padding: 8px 0; color: #1e293b;">${doctorName} (${speciality})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Date & Time:</td>
            <td style="padding: 8px 0; color: #1e293b;">${time}</td>
          </tr>
          ${meetingLink ? `
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Video Consultation:</td>
            <td style="padding: 8px 0;"><a href="${meetingLink}" target="_blank" style="color: #0d9488; font-weight: bold; text-decoration: none;">Join Google Meet Link 🌐</a></td>
          </tr>
          ` : ""}
        </table>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-size: 13px; color: #64748b;">
          Note: If you have chosen virtual consultation, please click the Google Meet link above at the scheduled time to connect with the specialist.
        </div>
        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Sri Sai Hospital. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Appointment Confirmation Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending Appointment Confirmation email:", error);
    return false;
  }
};

// 2. Function to send Doctor's Prescription Email
export const sendPrescriptionEmail = async (options: PrescriptionMailOptions) => {
  const { to, patientName, doctorName, prescription } = options;

  const mailOptions = {
    from: `"Sri Sai Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "💊 Medical Prescription - Sri Sai Hospital",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0d9488; text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">Sri Sai Hospital</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Your specialist <strong>${doctorName}</strong> has written your medical prescription details below:</p>
        
        <div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 14px; color: #1e293b; margin: 20px 0;">
          ${prescription}
        </div>
        
        <p>Please follow the dosage instructions as mentioned in the prescription card. Take care of your health!</p>
        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Sri Sai Hospital. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Prescription Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending Prescription email:", error);
    return false;
  }
};
