import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// OAuth2 Client authorization setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || ""
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN || "",
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
    summary: `🩺 Sri Sai Hospital - ${speciality} Consultation`,
    description: `Virtual video consultation.\nPatient: ${patientEmail}\nDoctor: ${doctorEmail || "Not Assigned"}`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    // attendees: [
    //   { email: patientEmail },
    //   ...(doctorEmail ? [{ email: doctorEmail }] : []),
    // ],
    // Google Meet லிங்க் உருவாக்கச் சொல்கிறோம்
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
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: event,
      conferenceDataVersion: 1, // கூகுள் மீட் லிங்க் வர இது மிக முக்கியம்!
    });

    const meetLink = response.data.hangoutLink;
    console.log("📅 Google Calendar Event created successfully!");
    console.log("🔗 Generated Google Meet Link:", meetLink);

    return meetLink;
  } catch (error) {
    console.error("❌ Google Calendar API Event Creation Error:", error);
    return null;
  }
};


