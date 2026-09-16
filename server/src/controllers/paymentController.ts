import { Request, Response } from "express";
import Appointment from "../models/Appointment.js";
import { ccavenueEncrypt, ccavenueDecrypt, parseCcavenueResponse } from "../utils/ccavenue.js";
import { notifySSEClients } from "./appointmentController.js";
import { sendBookingReceiptEmail, sendBookingFailureEmail } from "../config/emailService.js";

const CCAVENUE_MERCHANT_ID = process.env.CCAVENUE_MERCHANT_ID || "4469310";
const CCAVENUE_ACCESS_CODE = process.env.CCAVENUE_ACCESS_CODE || "AVWF96NH10CE34FWEC";
const CCAVENUE_WORKING_KEY = process.env.CCAVENUE_WORKING_KEY || "95D34BC6C43072BB4E0E8BECEDD87911";
const CCAVENUE_GATEWAY_URL = "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

/**
 * 1. Create CCAvenue Payment Order / Encrypted Payload
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, pasentname, pasentmail, pasentnumber, appointmenttime, speciality, subject } = req.body;

    if (!amount) {
      res.status(400).json({ message: "Amount is required" });
      return;
    }

    const orderId = `ORD_${Date.now()}`;
    const host = req.get("host") || "localhost:5000";
    const protocol = req.protocol || "http";
    const backendUrl = `${protocol}://${host}`;

    const redirectUrl = `${backendUrl}/api/payments/ccavenue-response`;
    const cancelUrl = `${backendUrl}/api/payments/ccavenue-response`;

    // Encode appointment details into merchant_param1 as a clean pipe-separated string
    const encodedPayload = [
      pasentname || "",
      pasentmail || "",
      pasentnumber || "",
      appointmenttime || "",
      speciality || "",
      subject || "General consultation booking"
    ].join("|");

    // CCAvenue parameters string
    const merchantData = [
      `merchant_id=${encodeURIComponent(CCAVENUE_MERCHANT_ID)}`,
      `order_id=${encodeURIComponent(orderId)}`,
      `currency=INR`,
      `amount=${encodeURIComponent(Number(amount).toFixed(2))}`,
      `redirect_url=${encodeURIComponent(redirectUrl)}`,
      `cancel_url=${encodeURIComponent(cancelUrl)}`,
      `language=EN`,
      `billing_name=${encodeURIComponent(pasentname || "Patient")}`,
      `billing_email=${encodeURIComponent(pasentmail || "patient@srisaihospital.org")}`,
      `billing_tel=${encodeURIComponent(pasentnumber || "9999999999")}`,
      `merchant_param1=${encodeURIComponent(encodedPayload)}`
    ].join("&");

    const encRequest = ccavenueEncrypt(merchantData, CCAVENUE_WORKING_KEY);

    res.status(200).json({
      success: true,
      encRequest,
      accessCode: CCAVENUE_ACCESS_CODE,
      ccavenueUrl: CCAVENUE_GATEWAY_URL,
      orderId
    });
  } catch (error: any) {
    console.error("❌ Error creating CCAvenue order:", error);
    res.status(500).json({ message: "Failed to initiate payment", error: error.message });
  }
};

/**
 * 2. CCAvenue Payment Callback / Response Handler
 */
export const handleCcavenueResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { encResp } = req.body;

    if (!encResp) {
      res.status(400).send("Invalid payment response payload.");
      return;
    }

    const decryptedStr = ccavenueDecrypt(encResp, CCAVENUE_WORKING_KEY);
    const parsedData = parseCcavenueResponse(decryptedStr);

    const orderStatus = parsedData.order_status;
    const trackingId = parsedData.tracking_id || parsedData.order_id || `CCAV_${Date.now()}`;
    const encodedPayload = parsedData.merchant_param1;

    let appointmentInfo: any = null;
    if (encodedPayload) {
      try {
        if (encodedPayload.includes("|")) {
          const parts = encodedPayload.split("|");
          appointmentInfo = {
            pasentname: parts[0] || "",
            pasentmail: parts[1] || "",
            pasentnumber: parts[2] || "",
            appointmenttime: parts[3] || "",
            speciality: parts[4] || "",
            subject: parts[5] || "General consultation booking"
          };
        } else {
          const decodedStr = Buffer.from(encodedPayload, "base64url").toString("utf8");
          appointmentInfo = JSON.parse(decodedStr);
        }
      } catch (err) {
        console.error("Failed to parse appointment info from merchant_param1:", err);
      }
    }

    // Determine Client Host for browser redirect
    const host = req.get("host") || "";
    let clientUrl = process.env.CLIENT_URL || "https://srisaisubhramaniyahospitals.com";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      clientUrl = "http://localhost:5173";
    }

    if (orderStatus === "Success") {
      if (appointmentInfo && appointmentInfo.appointmenttime) {
        const newAppointment = new Appointment({
          pasentname: appointmentInfo.pasentname,
          pasentmail: appointmentInfo.pasentmail,
          pasentnumber: appointmentInfo.pasentnumber,
          appointmenttime: new Date(appointmentInfo.appointmenttime),
          speciality: appointmentInfo.speciality,
          subject: appointmentInfo.subject || "General consultation booking",
          paymentStatus: "paid",
          paymentId: trackingId,
          amount: 1000,
          status: "pending"
        });

        await newAppointment.save();
        notifySSEClients({ type: "NEW_APPOINTMENT", appointment: newAppointment });

        // Trigger receipt email
        sendBookingReceiptEmail({
          to: newAppointment.pasentmail,
          patientName: newAppointment.pasentname,
          amount: newAppointment.amount || 1000,
          paymentId: trackingId,
          speciality: newAppointment.speciality,
          time: new Date(newAppointment.appointmenttime).toLocaleString("en-IN")
        }).catch((e) => console.error("Email receipt error:", e));
      }

      // HTTP 302 redirect back to frontend (bypasses CSP inline script restrictions)
      res.redirect(302, `${clientUrl}/?payment_status=success`);
    } else {
      // Payment Failed or Cancelled
      if (appointmentInfo && appointmentInfo.appointmenttime) {
        const failedAppointment = new Appointment({
          pasentname: appointmentInfo.pasentname,
          pasentmail: appointmentInfo.pasentmail,
          pasentnumber: appointmentInfo.pasentnumber,
          appointmenttime: new Date(appointmentInfo.appointmenttime),
          speciality: appointmentInfo.speciality,
          subject: appointmentInfo.subject || "Payment Failed / Cancelled",
          paymentStatus: "failed",
          paymentId: trackingId,
          amount: 1000,
          status: "cancelled"
        });

        await failedAppointment.save();
        sendBookingFailureEmail({
          to: failedAppointment.pasentmail,
          patientName: failedAppointment.pasentname,
          amount: failedAppointment.amount || 1000,
          paymentId: trackingId,
          speciality: failedAppointment.speciality,
          time: new Date(failedAppointment.appointmenttime).toLocaleString("en-IN")
        }).catch((e) => console.error("Failure email error:", e));
      }

      // HTTP 302 redirect back to frontend (bypasses CSP inline script restrictions)
      res.redirect(302, `${clientUrl}/?payment_status=failed`);
    }
  } catch (error: any) {
    console.error("❌ Error handling CCAvenue response:", error);
    const host = req.get("host") || "";
    let clientUrl = process.env.CLIENT_URL || "https://srisaisubhramaniyahospitals.com";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      clientUrl = "http://localhost:5173";
    }
    res.redirect(302, `${clientUrl}/?payment_status=failed`);
  }
};

/**
 * 3. Payment Verification Endpoint (Legacy / Direct check)
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "CCAvenue verification handled via gateway response", success: true });
};
