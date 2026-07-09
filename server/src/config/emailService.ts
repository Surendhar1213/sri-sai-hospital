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
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🏥 Appointment Confirmed - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0d9488; text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">Srisai Subhramaniya Hospitals</h2>
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
        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
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
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "💊 Medical Prescription - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0d9488; text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">Srisai Subhramaniya Hospitals</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Your specialist <strong>${doctorName}</strong> has written your medical prescription details below:</p>
        
        <div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 14px; color: #1e293b; margin: 20px 0;">
          ${prescription}
        </div>
        
        <p>Please follow the dosage instructions as mentioned in the prescription card. Take care of your health!</p>
        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
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

// 3. Function to send Email Notification to the Doctor when appointed
interface DoctorMailOptions {
  to: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  speciality: string;
  time: string;
  meetingLink?: string;
}

export const sendDoctorNotificationEmail = async (options: DoctorMailOptions) => {
  const { to, doctorName, patientName, patientPhone, speciality, time, meetingLink } = options;

  const mailOptions = {
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🩺 New Appointment Assigned - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f766e; text-align: center; border-bottom: 2px solid #0f766e; padding-bottom: 10px;">Srisai Subhramaniya Hospitals - Doctor Portal</h2>
        <p>Dear <strong>Dr. ${doctorName}</strong>,</p>
        <p>You have been assigned a new appointment. Here are the patient and consultation details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Patient Name:</td>
            <td style="padding: 8px 0; color: #1e293b;">${patientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Patient Contact:</td>
            <td style="padding: 8px 0; color: #1e293b;">${patientPhone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Department/Speciality:</td>
            <td style="padding: 8px 0; color: #1e293b;">${speciality}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Date & Time:</td>
            <td style="padding: 8px 0; color: #1e293b;">${time}</td>
          </tr>
          ${meetingLink ? `
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Google Meet Link:</td>
            <td style="padding: 8px 0;"><a href="${meetingLink}" target="_blank" style="color: #0f766e; font-weight: bold; text-decoration: none;">Start Consultation 🌐</a></td>
          </tr>
          ` : ""}
        </table>
        
        <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; font-size: 13px; color: #0f766e;">
          <strong>Security Note:</strong> Please click the Google Meet link to host the meeting. You will need to admit the patient when they try to join.
        </div>
        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Doctor Notification Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending Doctor Notification email:", error);
    return false;
  }
};

// 4. Function to send Booking Confirmation & Receipt Email to Patient
interface ReceiptMailOptions {
  to: string;
  patientName: string;
  amount: number;
  paymentId: string;
  speciality: string;
  time: string;
}

export const sendBookingReceiptEmail = async (options: ReceiptMailOptions) => {
  const { to, patientName, amount, paymentId, speciality, time } = options;

  const mailOptions = {
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "💳 Payment Received & Booking Confirmed - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        
        <!-- Header with logo style -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; background-color: #0d9488; color: white; font-size: 24px; font-weight: bold; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; text-align: center;">🏥</div>
          <h2 style="color: #0e37ecff; margin: 10px 0 0 0;">Srisai Subhramaniya Hospitals</h2>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Your healthcare is our priority</p>
        </div>

        <p>Dear <strong>${patientName}</strong>,</p>
        <p>We have successfully received your payment. Your appointment booking is confirmed and is currently pending doctor assignment by our administration.</p>
        
        <!-- Payment details receipt -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Payment & Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Payment ID:</td>
              <td style="padding: 6px 0; color: #1e293b; font-weight: bold; font-size: 14px;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Amount Paid:</td>
              <td style="padding: 6px 0; color: #10b981; font-weight: bold; font-size: 14px;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Department:</td>
              <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${speciality}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Requested Date & Time:</td>
              <td style="padding: 6px 0; color: #1e293b; font-size: 14px;">${time}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 6px; font-size: 13px; color: #b45309; text-align: center;">
          ℹ️ <strong>What next?</strong> Our admin will assign a specialist doctor for you. Once assigned, you will receive a second email with the Google Meet link.
        </div>

        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Booking receipt email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending booking receipt email:", error);
    return false;
  }
};
