import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// OAuth2 configuration setup (Admin / Client ID credential validation keys)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Session authorization using Saved Refresh Token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN || null,
});


const calendar = google.calendar({ version: "v3", auth: oauth2Client });

interface MeetEventOptions {
  patientEmail: string;
  doctorEmail?: string;
  speciality: string;
  startTime: Date;
}

/**
 * Google Calendar dynamic event with Google Meet link auto-generation helper
 */
export const createMeetEvent = async (options: MeetEventOptions) => {
  const { patientEmail, doctorEmail, speciality, startTime } = options;

  // Calendar meeting event time slots details (e.g. 30 Minutes Consultation block)
  const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); 

  const event = {
    summary: `🩺 ${speciality} Consultation - Sri Sai Hospital`,
    description: `Virtual consultation session with specialist. Google Meet video conferencing is enabled.`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: "Asia/Kolkata", // Indian timezone setup
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    // Inviting both Patient and Doctor
    attendees: [
      { email: patientEmail },
      ...(doctorEmail ? [{ email: doctorEmail }] : []),
    ],
    // 💡 KEY PART: Requests Google Meet creation request!
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary", // Schedules on main account's calendar
      requestBody: event,
      conferenceDataVersion: 1, // Must be 1 to enable conference link creation!
    });

    // Extracting generated Google Meet Link 🌐
    const meetLink = response.data.hangoutLink;
    console.log("📅 Google Calendar Event created successfully!");
    console.log("🔗 Generated Google Meet Link:", meetLink);

    return meetLink;
  } catch (error) {
    console.error("❌ Google Calendar API Event Creation Error:", error);
    // If OAuth configuration fails, fallback to null so the app doesn't crash
    return null;
  }
};
