import { sendAppointmentEmail } from "../config/emailService.js";


async function test() {
  console.log("Sending test email...");
  const success = await sendAppointmentEmail({
    to: "chandruleo769@gmail.com",
    patientName: "Test Patient",
    doctorName: "Dr. Sai",
    speciality: "General Medicine",
    time: new Date().toLocaleString(),
  });

  if (success) {
    console.log("✅ Test email sent successfully!");
  } else {
    console.log("❌ Test email sending failed.");
  }
}

test();
