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
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,   // 5 seconds
  socketTimeout: 5000,     // 5 seconds
});

interface AppointmentMailOptions {
  to: string;
  patientName: string;
  doctorName: string;
  speciality: string;
  time: string;
  meetingLink?: string | undefined;
  appointmentId?: string;
}

interface PrescriptionMailOptions {
  to: string;
  patientName: string;
  doctorName: string;
  prescription: string;
  appointmentId?: string;
  patientPhone?: string;
  patientAge?: number | string;
  patientGender?: string;
  patientBloodGroup?: string;
  doctorSpeciality?: string;
}

// 1. Function to send Appointment Booking Email with Google Meet details
export const sendAppointmentEmail = async (options: AppointmentMailOptions) => {
  const { to, patientName, doctorName, speciality, time, meetingLink, appointmentId } = options;

  const mailOptions: any = {
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
            <td style="padding: 10px; border: 1px solid #e2e8f0; background-color: #f9fafb; font-weight: bold; width: 35%;">Doctor</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">Dr. ${doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; background-color: #f9fafb; font-weight: bold;">Speciality</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${speciality}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; background-color: #f9fafb; font-weight: bold;">Time Slot</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${time}</td>
          </tr>
          ${meetingLink ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; background-color: #f9fafb; font-weight: bold;">Meeting Link</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="${meetingLink}" style="color: #0d9488; font-weight: bold; text-decoration: none;">Join Video Consultation</a></td>
          </tr>
          ` : ""}
        </table>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #166534; font-size: 14px;"><strong>Consultation Guidelines:</strong> Please log in 5 minutes prior to your meeting time. Ensure a stable internet connection and a quiet space for your online consultation.</p>
        </div>
        
        <p>Thank you for choosing Sri Sai Hospital.</p>
        <p style="color: #64748b; font-size: 12px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
      </div>
    `,
  };

  if (appointmentId) {
    const threadMessageId = `<appointment-${appointmentId}@srisaihospital.com>`;
    mailOptions.messageId = threadMessageId;
    mailOptions.headers = {
      "In-Reply-To": threadMessageId,
      "References": threadMessageId,
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Appointment Confirmation Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending booking email:", error);
    return false;
  }
};

// HTML escaping helper function to prevent HTML/XSS injection in emails
const escapeHtml = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// 2. Function to send Doctor's Prescription Email
export const sendPrescriptionEmail = async (options: PrescriptionMailOptions) => {
  const { 
    to, 
    patientName, 
    doctorName, 
    prescription, 
    appointmentId,
    patientPhone,
    patientAge,
    patientGender,
    patientBloodGroup,
    doctorSpeciality
  } = options;
  const escapedPatientName = escapeHtml(patientName || "");
  const escapedDoctorName = escapeHtml(doctorName || "");
  
  let isStructured = false;
  let medicinesList: any[] = [];
  let adviceNotes = prescription || "";
  let prescriptionHtml = "";

  try {
    const parsed = JSON.parse(prescription || "");
    if (parsed && (Array.isArray(parsed.medicines) || parsed.notes !== undefined)) {
      isStructured = true;
      medicinesList = parsed.medicines || [];
      adviceNotes = parsed.notes || "";
    }
  } catch (e) {
    // Not JSON
  }

  if (isStructured) {
    let tableRows = "";
    if (medicinesList.length > 0) {
      tableRows = medicinesList.map(med => {
        const morningBadge = med.morning 
          ? `<span style="background-color: #FEF3C7; color: #D97706; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-right: 4px; display: inline-block;">Morning</span>`
          : `<span style="background-color: #F1F5F9; color: #94A3B8; padding: 4px 8px; border-radius: 6px; font-size: 11px; margin-right: 4px; display: inline-block; text-decoration: line-through;">Morning</span>`;
        
        const noonBadge = med.noon 
          ? `<span style="background-color: #E0F2FE; color: #0284C7; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-right: 4px; display: inline-block;">Noon</span>`
          : `<span style="background-color: #F1F5F9; color: #94A3B8; padding: 4px 8px; border-radius: 6px; font-size: 11px; margin-right: 4px; display: inline-block; text-decoration: line-through;">Noon</span>`;
          
        const nightBadge = med.night 
          ? `<span style="background-color: #EEF2FF; color: #4F46E5; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; display: inline-block;">Night</span>`
          : `<span style="background-color: #F1F5F9; color: #94A3B8; padding: 4px 8px; border-radius: 6px; font-size: 11px; display: inline-block; text-decoration: line-through;">Night</span>`;

        let timingBadge = "";
        if (med.timing === "before") {
          timingBadge = `<span style="background-color: #D1FAE5; color: #059669; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; display: inline-block;">🍽 Before Food</span>`;
        } else if (med.timing === "after") {
          timingBadge = `<span style="background-color: #DBEAFE; color: #2563EB; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; display: inline-block;">🍽 After Food</span>`;
        } else {
          timingBadge = `<span style="background-color: #FEF3C7; color: #D97706; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; display: inline-block;">⚠ SOS</span>`;
        }

        return `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px; font-weight: bold; color: #060F2D;">${escapeHtml(med.name)}</td>
            <td style="padding: 12px;">${morningBadge}${noonBadge}${nightBadge}</td>
            <td style="padding: 12px;">${timingBadge}</td>
            <td style="padding: 12px; font-weight: bold; color: #475569;">${escapeHtml(med.duration || "")}</td>
          </tr>
        `;
      }).join("");
    }

    prescriptionHtml = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748B; font-weight: bold;">
            <th style="padding: 12px;">Medicine</th>
            <th style="padding: 12px;">Dosage</th>
            <th style="padding: 12px;">Timing</th>
            <th style="padding: 12px;">Duration</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows || `<tr><td colspan="4" style="padding: 16px; text-align: center; color: #94A3B8;">No medicines listed.</td></tr>`}
        </tbody>
      </table>

      ${adviceNotes ? `
        <div style="margin-top: 24px;">
          <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: bold; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Advice & Instructions</span>
          <div style="padding: 16px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13.5px; color: #334155; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(adviceNotes)}</div>
        </div>
      ` : ""}
    `;
  } else {
    prescriptionHtml = `
      <div style="background-color: #f1f5f9; border-left: 4px solid #4A65FF; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 14px; color: #1e293b; margin: 20px 0;">${escapeHtml(prescription || "")}</div>
    `;
  }

  const mailOptions: any = {
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "💊 Medical Prescription - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 12px rgba(6, 15, 45, 0.05);">
        <!-- Header Banner -->
        <div style="background-color: #060F2D; padding: 24px; color: #FFFFFF; text-align: left;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <h2 style="margin: 0; font-size: 22px; font-weight: 850; letter-spacing: 0.5px; color: #FFFFFF; font-family: 'Arial Black', Arial, sans-serif;">SRI SAI HOSPITAL</h2>
                <span style="font-size: 11px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; font-weight: bold;">CLINICAL CONSULTATION SLIP</span>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Content Area -->
        <div style="padding: 24px;">
          <!-- Patient & Doctor Info Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px; color: #475569;">
            <tr>
              <td style="width: 50%; padding-bottom: 12px; vertical-align: top;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; display: block; margin-bottom: 4px;">Patient Details</span>
                <strong style="font-size: 15px; color: #060F2D; display: block; margin-bottom: 2px;">${escapedPatientName}</strong>
                ${patientPhone ? `<span style="display: block; margin-bottom: 2px; color: #64748B;">Phone: ${escapeHtml(patientPhone)}</span>` : ""}
                ${(patientAge || patientGender || patientBloodGroup) ? `
                  <span style="display: block; color: #64748B;">
                    ${patientAge ? `Age: ${escapeHtml(patientAge.toString())}` : ""} 
                    ${patientGender ? ` &nbsp;Gender: ${escapeHtml(patientGender)}` : ""} 
                    ${(patientBloodGroup && patientBloodGroup !== "Unknown") ? ` &nbsp;Blood: ${escapeHtml(patientBloodGroup)}` : ""}
                  </span>
                ` : ""}
              </td>
              <td style="width: 50%; padding-bottom: 12px; text-align: right; vertical-align: top;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; display: block; margin-bottom: 4px;">Consultant Doctor</span>
                <strong style="font-size: 15px; color: #060F2D; display: block; margin-bottom: 2px;">Dr. ${escapedDoctorName}</strong>
                ${doctorSpeciality ? `<span style="display: block; color: #64748B;">${escapeHtml(doctorSpeciality)}</span>` : ""}
              </td>
            </tr>
          </table>

          <div style="border-top: 1px dashed #e2e8f0; margin-bottom: 24px;"></div>

          <h3 style="font-size: 12px; color: #4A65FF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; font-weight: 700; margin-top: 0;">Rx Prescriptions</h3>
          
          ${prescriptionHtml}
          
          <div style="border-top: 1px dashed #e2e8f0; margin-top: 30px; margin-bottom: 20px;"></div>

          <!-- Doctor Signature & Verification Footer -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="vertical-align: bottom; padding-bottom: 10px;">
                <span style="font-size: 11px; color: #94a3b8;">Prescription Issued:</span>
                <strong style="font-size: 12.5px; color: #475569; display: block; margin-top: 2px;">${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</strong>
              </td>
              <td style="text-align: right; vertical-align: bottom;">
                <div style="width: 150px; border-bottom: 1px solid #cbd5e1; margin-left: auto; margin-bottom: 6px;"></div>
                <span style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 8px;">Doctor's Signature</span>
                <span style="color: #4A65FF; font-weight: 700; font-size: 12px; letter-spacing: 0.5px;">Sri Sai Hospital Telehealth Verified</span>
              </td>
            </tr>
          </table>
          
          <p style="margin-top: 30px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 15px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Enable threading in email clients (Gmail/Outlook) by supplying fixed Message-ID/In-Reply-To/References based on Appointment ID
  if (appointmentId) {
    const threadMessageId = `<prescription-${appointmentId}@srisaihospital.com>`;
    mailOptions.messageId = threadMessageId;
    mailOptions.headers = {
      "In-Reply-To": threadMessageId,
      "References": threadMessageId,
    };
  }

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

// 5. Function to send Booking Failure & Payment Cancelled Email to Patient
interface FailureMailOptions {
  to: string;
  patientName: string;
  amount: number;
  paymentId: string;
  speciality: string;
  time: string;
}


export const sendBookingFailureEmail = async (options: FailureMailOptions) => {
  const { to, patientName, amount, paymentId, speciality, time } = options;

  const mailOptions = {
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "⚠️ Booking Failed / Payment Cancelled - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        
        <!-- Header with logo style -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; background-color: #ef4444; color: white; font-size: 24px; font-weight: bold; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; text-align: center;">⚠️</div>
          <h2 style="color: #ef4444; margin: 10px 0 0 0;">Booking Failed</h2>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Srisai Subhramaniya Hospitals</p>
        </div>

        <p>Dear <strong>${patientName}</strong>,</p>
        <p>We noticed that your payment attempt for booking an appointment was cancelled or failed. As a result, your appointment slot has not been booked.</p>
        
        <!-- Details -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Attempt Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Attempt/Order ID:</td>
              <td style="padding: 6px 0; color: #1e293b; font-weight: bold; font-size: 14px;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Amount:</td>
              <td style="padding: 6px 0; color: #ef4444; font-weight: bold; font-size: 14px;">₹${amount}</td>
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

        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px; font-size: 13px; color: #b91c1c; text-align: center;">
          If the amount was deducted from your account, it will be refunded automatically by your bank within 5-7 business days. Please try booking again.
        </div>

        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Booking failure email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending booking failure email:", error);
    return false;
  }
};


// 6. Function to send Consultation Alert Reminder Email (15 minutes prior)
interface ReminderMailOptions {
  to: string;
  patientName: string;
  doctorName: string;
  speciality: string;
  time: string;
  meetingLink: string;
  role: "patient" | "doctor";
}

export const sendReminderEmail = async (options: ReminderMailOptions) => {
  const { to, patientName, doctorName, speciality, time, meetingLink, role } = options;

  const recipientName = role === "patient" ? patientName : `Dr. ${doctorName}`;
  const subject = role === "patient" 
    ? "⏰ Alert: Your Consultation starts in 15 Minutes!" 
    : "⏰ Alert: Upcoming Consultation in 15 Minutes!";

  const mailOptions = {
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; background-color: #3f59ff; color: white; font-size: 24px; font-weight: bold; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; text-align: center;">⏰</div>
          <h2 style="color: #0d9488; margin: 10px 0 0 0;">Consultation Reminder</h2>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Srisai Subhramaniya Hospitals</p>
        </div>

        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>This is a reminder that the virtual video consultation is scheduled to begin in <strong>15 minutes</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Patient:</td>
            <td style="padding: 8px 0; color: #1e293b;">${patientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Doctor Assigned:</td>
            <td style="padding: 8px 0; color: #1e293b;">Dr. ${doctorName} (${speciality})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Consultation Time:</td>
            <td style="padding: 8px 0; color: #1e293b;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Google Meet Link:</td>
            <td style="padding: 8px 0;">
              <a href="${meetingLink}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #3f59ff; color: white; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 10px rgba(63, 89, 255, 0.2);">
                Join Google Meet 🎥
              </a>
            </td>
          </tr>
        </table>
        
        <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; font-size: 13px; color: #0f766e; text-align: center;">
          Please make sure you have a stable internet connection and click the link above when ready.
        </div>
        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 15-Min Reminder Email sent successfully to ${to}:`, info.messageId);
    return true;
  } catch (error) {
    console.error(`❌ Error sending 15-Min Reminder email to ${to}:`, error);
    return false;
  }
};

interface MissedMailOptions {
  to: string;
  patientName: string;
  doctorName: string;
  speciality: string;
  time: string;
}

export const sendMissedAppointmentEmail = async (options: MissedMailOptions) => {
  const { to, patientName, doctorName, speciality, time } = options;

  const mailOptions = {
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "⚠️ Appointment Missed / No-Show Notice - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; background-color: #ef4444; color: white; font-size: 24px; font-weight: bold; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; text-align: center;">⚠️</div>
          <h2 style="color: #ef4444; margin: 10px 0 0 0;">Appointment Missed</h2>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Srisai Subhramaniya Hospitals</p>
        </div>

        <p>Dear <strong>${patientName}</strong>,</p>
        <p>This email is to inform you that you missed your scheduled virtual consultation with <strong>Dr. ${doctorName}</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Department:</td>
            <td style="padding: 8px 0; color: #1e293b;">${speciality}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Doctor:</td>
            <td style="padding: 8px 0; color: #1e293b;">Dr. ${doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569; font-weight: bold;">Missed Slot Time:</td>
            <td style="padding: 8px 0; color: #1e293b;">${time}</td>
          </tr>
        </table>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; font-size: 13px; color: #991b1b; text-align: center;">
          If you missed this appointment by mistake or wish to reschedule, please contact the hospital administration as soon as possible.
        </div>
        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
      </div>
    `,
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Missed Appointment Email sent successfully to ${to}:`, info.messageId);
    return true;
  } catch (error) {
    console.error(`❌ Error sending Missed Appointment email to ${to}:`, error);
    return false;
  }
};

// 7. Function to send Password Reset OTP Email
interface ResetOTPMailOptions {
  to: string;
  patientName: string;
  otp: string;
}

export const sendResetOTPEmail = async (options: ResetOTPMailOptions) => {
  const { to, patientName, otp } = options;

  const mailOptions = {
    from: `"Srisai Subhramaniya Hospitals" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔒 Password Reset Verification Code - Srisai Subhramaniya Hospitals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; background-color: #3f59ff; color: white; font-size: 24px; font-weight: bold; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; text-align: center;">🔒</div>
          <h2 style="color: #0d9488; margin: 10px 0 0 0;">Reset Your Password</h2>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Srisai Subhramaniya Hospitals</p>
        </div>

        <p>Dear <strong>${patientName}</strong>,</p>
        <p>We received a request to reset the password for your patient portal account. Use the following verification code (OTP) to proceed with your password reset. This code is valid for <strong>10 minutes</strong>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; padding: 15px 35px; background-color: #f1f5f9; border: 2px dashed #3f59ff; border-radius: 10px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #3f59ff;">
            ${otp}
          </div>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 6px; font-size: 13px; color: #b45309; text-align: center;">
          ⚠️ <strong>Security Notice:</strong> If you did not request a password reset, please ignore this email or contact support if you have security concerns. Do not share this code with anyone.
        </div>

        <p style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">&copy; Srisai Subhramaniya Hospitals. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Reset Password OTP Email sent successfully to ${to}:`, info.messageId);
    return true;
  } catch (error) {
    console.error(`❌ Error sending Reset Password OTP email to ${to}:`, error);
    return false;
  }
};


