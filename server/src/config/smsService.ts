import dotenv from "dotenv";
dotenv.config();

/**
 * Sends a Quick SMS using Fast2SMS Gateway
 * @param to 10-digit Indian Mobile Number
 * @param message Message content (max 160 characters per SMS credit)
 */
export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ FAST2SMS_API_KEY is not defined in .env. Skipping SMS.");
      return false;
    }

    // Clean phone number (Extract last 10 digits to remove +91 prefix)
    let cleanNumber = to.replace(/\D/g, "");
    if (cleanNumber.length > 10) {
      cleanNumber = cleanNumber.slice(-10);
    }

    if (cleanNumber.length !== 10) {
      console.error(`❌ Invalid Indian phone number format: ${to}`);
      return false;
    }

    console.log(`✉️ Attempting to send SMS to ${cleanNumber}...`);

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "q", // "q" denotes Quick SMS route (ideal for DLT-free testing)
        message: message,
        language: "english",
        numbers: cleanNumber
      })
    });

    const data = await response.json() as any;

    if (response.ok && data.return === true) {
      console.log(`✅ SMS successfully sent to ${cleanNumber}`);
      return true;
    } else {
      console.error("❌ Fast2SMS API Error Response:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to send SMS via Fast2SMS:", error);
    return false;
  }
};
