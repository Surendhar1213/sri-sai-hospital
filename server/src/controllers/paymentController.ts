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
 * Helper to determine secure backend URL for CCAvenue callback
 * Ensures HTTPS is forced in production to prevent cPanel HTTP->HTTPS 301 POST payload drops
 */
const getBackendUrl = (req: Request): string => {
  const host = req.get("host") || "srisaisubhramaniyahospitals.com";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  if (isLocal) {
    return (process.env.VITE_API_URL || `http://${host}`).replace(/\/+$/, "");
  }
  let url = process.env.VITE_API_URL || `https://${host}`;
  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }
  return url.replace(/\/+$/, "");
};

/**
 * Helper to determine frontend client URL for browser redirects
 */
const getClientUrl = (req: Request): string => {
  const host = req.get("host") || "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:5173";
  }
  const rawUrl = process.env.CLIENT_URL || "https://srisaisubhramaniyahospitals.com";
  return rawUrl.replace(/\/+$/, "");
};

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
    const backendUrl = getBackendUrl(req);

    const redirectUrl = `${backendUrl}/api/payments/ccavenue-response`;
    const cancelUrl = `${backendUrl}/api/payments/ccavenue-response`;

    // Pre-create appointment in MongoDB so cancelled or failed bookings are ALWAYS saved and logged
    if (pasentname && pasentmail && pasentnumber && appointmenttime && speciality) {
      try {
        const pendingAppointment = new Appointment({
          pasentname: pasentname.trim(),
          pasentmail: pasentmail.trim().toLowerCase(),
          pasentnumber: pasentnumber.trim(),
          appointmenttime: new Date(appointmenttime),
          speciality: speciality.trim(),
          subject: subject || "General consultation booking",
          paymentStatus: "failed",
          paymentId: orderId,
          amount: Number(amount) || 1000,
          status: "cancelled"
        });
        await pendingAppointment.save();
        notifySSEClients({ type: "NEW_APPOINTMENT", appointment: pendingAppointment });
      } catch (dbErr: any) {
        console.error("⚠️ Pre-saving pending appointment warning:", dbErr.message);
      }
    }

    // Safely encode appointment payload in Base64URL format to prevent special characters like '&' from breaking CCAvenue query parser
    const payloadObj = {
      name: pasentname || "",
      email: pasentmail || "",
      phone: pasentnumber || "",
      time: appointmenttime || "",
      speciality: speciality || "",
      subject: subject || "General consultation booking"
    };
    const encodedPayload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");

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
  const clientUrl = getClientUrl(req);

  try {
    const encResp = req.body?.encResp || req.query?.encResp || req.body?.encResponse || req.body?.enc_response;

    if (!encResp) {
      console.error("❌ CCAvenue response error: encResp missing in req.body/query", req.body, req.query);
      res.redirect(302, `${clientUrl}/?payment_status=failed`);
      return;
    }

    const decryptedStr = ccavenueDecrypt(encResp, CCAVENUE_WORKING_KEY);
    const parsedData = parseCcavenueResponse(decryptedStr);

    const orderStatus = (parsedData.order_status || "").trim();
    const orderId = parsedData.order_id || "";
    const trackingId = parsedData.tracking_id || orderId || `CCAV_${Date.now()}`;
    const paidAmount = Number(parsedData.amount) || 1000;
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
          const parsed = JSON.parse(decodedStr);
          appointmentInfo = {
            pasentname: parsed.name || parsed.pasentname || "",
            pasentmail: parsed.email || parsed.pasentmail || "",
            pasentnumber: parsed.phone || parsed.pasentnumber || "",
            appointmenttime: parsed.time || parsed.appointmenttime || "",
            speciality: parsed.speciality || "",
            subject: parsed.subject || "General consultation booking"
          };
        }
      } catch (err) {
        console.error("Failed to parse appointment info from merchant_param1:", err);
      }
    }

    // Try finding pre-created appointment record in MongoDB
    let appointment = null;
    if (orderId) {
      appointment = await Appointment.findOne({ paymentId: orderId });
    }
    if (!appointment && trackingId) {
      appointment = await Appointment.findOne({ paymentId: trackingId });
    }

    const isSuccess = orderStatus.toLowerCase() === "success";

    if (isSuccess) {
      if (appointment) {
        appointment.paymentStatus = "paid";
        appointment.status = "pending";
        appointment.paymentId = trackingId;
        await appointment.save();
      } else if (appointmentInfo && appointmentInfo.appointmenttime) {
        appointment = new Appointment({
          pasentname: appointmentInfo.pasentname,
          pasentmail: appointmentInfo.pasentmail,
          pasentnumber: appointmentInfo.pasentnumber,
          appointmenttime: new Date(appointmentInfo.appointmenttime),
          speciality: appointmentInfo.speciality,
          subject: appointmentInfo.subject || "General consultation booking",
          paymentStatus: "paid",
          paymentId: trackingId,
          amount: paidAmount,
          status: "pending"
        });
        await appointment.save();
      }

      if (appointment) {
        notifySSEClients({ type: "NEW_APPOINTMENT", appointment });

        // Trigger receipt email
        sendBookingReceiptEmail({
          to: appointment.pasentmail,
          patientName: appointment.pasentname,
          amount: appointment.amount || paidAmount,
          paymentId: trackingId,
          speciality: appointment.speciality,
          time: new Date(appointment.appointmenttime).toLocaleString("en-IN")
        }).catch((e) => console.error("Email receipt error:", e));
      }

      // HTTP 302 redirect back to frontend (bypasses CSP inline script restrictions)
      res.redirect(302, `${clientUrl}/?payment_status=success`);
    } else {
      // Payment Failed or Cancelled
      if (appointment) {
        appointment.paymentStatus = "failed";
        appointment.status = "cancelled";
        if (trackingId) appointment.paymentId = trackingId;
        await appointment.save();
      } else if (appointmentInfo && appointmentInfo.appointmenttime) {
        appointment = new Appointment({
          pasentname: appointmentInfo.pasentname,
          pasentmail: appointmentInfo.pasentmail,
          pasentnumber: appointmentInfo.pasentnumber,
          appointmenttime: new Date(appointmentInfo.appointmenttime),
          speciality: appointmentInfo.speciality,
          subject: appointmentInfo.subject || "Payment Failed / Cancelled",
          paymentStatus: "failed",
          paymentId: trackingId,
          amount: paidAmount,
          status: "cancelled"
        });
        await appointment.save();
      }

      if (appointment) {
        notifySSEClients({ type: "UPDATE_APPOINTMENT", appointment });

        sendBookingFailureEmail({
          to: appointment.pasentmail,
          patientName: appointment.pasentname,
          amount: appointment.amount || paidAmount,
          paymentId: trackingId,
          speciality: appointment.speciality,
          time: new Date(appointment.appointmenttime).toLocaleString("en-IN")
        }).catch((e) => console.error("Failure email error:", e));
      }

      // HTTP 302 redirect back to frontend (bypasses CSP inline script restrictions)
      res.redirect(302, `${clientUrl}/?payment_status=failed`);
    }
  } catch (error: any) {
    console.error("❌ Error handling CCAvenue response:", error);
    res.redirect(302, `${clientUrl}/?payment_status=failed`);
  }
};

/**
 * 3. Payment Verification Endpoint (Legacy / Direct check)
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "CCAvenue verification handled via gateway response", success: true });
};
