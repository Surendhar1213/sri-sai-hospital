import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./Appointment.css"; // We'll create this CSS file for styles

import image1 from "../../../assets/home/appointment/proj-1.jpg";
import image2 from "../../../assets/home/appointment/proj-2.jpg";
import image3 from "../../../assets/home/appointment/proj-3.jpg";
import image4 from "../../../assets/home/appointment/proj-4.jpg";

// Speciality to Doctor Mapping
const SPECIALITY_DOCTORS: Record<string, string[]> = {
  "Gynecology & Women's Health": ["Dr. R. Anuradha"],
  "Infertility & Fertility": ["Dr. R. Anuradha"],
  "Obstetrics & Maternity": ["Dr. R. Anuradha"],
  "Pelvic Floor Rehabilitation": ["Dr. R. Anuradha"],
  "Women's Intimate Wellness": ["Dr. R. Anuradha"],
  "Dermatology & Cosmetology": ["Dr. R. Jayashree", "Dr. R. Arunkarthick"],
  "Hair & Nail Clinic": ["Dr. R. Jayashree", "Dr. R. Arunkarthick"],
  "Endocrinology": ["Dr. R. Anuradha"], 
  "Obesity & Weight Loss": ["Dr. R. Anuradha"],
  "Diabetology": ["Dr. R. Anuradha"],
  "Urology": ["Dr. R. Anuradha"],
  "General Medicine": ["Dr. R. Anuradha"]
};

const Appointment = () => {
  const [formData, setFormData] = useState({
    pasentname: "",
    pasentmail: "",
    pasentnumber: "",
    appointmenttime: "",
    speciality: "",
    subject: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const TIME_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM"
  ];

  const combineDateAndTime = (dateStr: string, slotStr: string): Date => {
    const [time, modifier] = slotStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    const dateObj = new Date(dateStr);
    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj;
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || !formData.speciality) {
        setBookedSlots([]);
        return;
      }
      try {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${backendUrl}/api/appointments/booked-slots?date=${selectedDate}&speciality=${encodeURIComponent(formData.speciality)}`
        );
        const slots = await response.json();
        if (response.ok) {
          setBookedSlots(slots || []);
        }
      } catch (err) {
        console.error("Error fetching booked slots:", err);
      }
    };
    fetchBookedSlots();
  }, [selectedDate, formData.speciality]);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    setSelectedDate(dateVal);
    setSelectedSlot("");
    setFormData((prev) => ({
      ...prev,
      appointmenttime: "",
    }));
  };

  const checkIsSlotBooked = (slot: string): boolean => {
    if (!selectedDate) return false;
    const combinedISO = combineDateAndTime(selectedDate, slot).toISOString();
    return bookedSlots.some(
      (bookedTime) => new Date(bookedTime).getTime() === new Date(combinedISO).getTime()
    );
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true); // <--- Inga `isSubmitting` iruku

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${backendUrl}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Inga formData direct-a backend schema fields oda matching
      });

      const data = await response.json();

            if (response.ok) {
        setShowSuccess(true); // <--- Pop-up active aagum
        // Form field-la time, speciality and subject-ai reset panrom
        setFormData((prev) => ({
          ...prev,
          appointmenttime: "",
          speciality: "",
          subject: "",
        }));
      } else {
        alert("Booking failed: " + data.message);
      }

    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false); // <--- Inga `isSubmitting`
    }
  };




  return (
    <div className="my-bd" id="appointment-section">
      <div className="adjust_section">
        {/* about start */}
        <div className="container appointments section-space pt-80">
          <div className="cg-about-wrap">
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="0ms" data-wow-duration="500ms">
                <img src={image1} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="100ms" data-wow-duration="500ms">
                <img src={image2} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="200ms" data-wow-duration="500ms">
                <img src={image3} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="300ms" data-wow-duration="500ms">
                <img src={image4} alt="image" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="cg-about-top">
                <div className="section-title mb-130">
                  <h2 className="title">Request an Appointment</h2>
                  <div className="cg-funfact-wrap" style={{ justifyContent: "center", display: "flex", textAlign: "center" }}>
                    <h5 className="cg-funfact-title xb-text-reveal">
                      Need expert medical consultation? Schedule your
                      appointment online and connect with our specialists for
                      timely diagnosis and treatment.
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="appointment-form-wrapper" id="appointment-form-wrapper">
            <div className="appointment-form-container">
              <div className="appointment-form-inner">
                <div className="appointment-form-content">
                  <form className="appointment-form" noValidate onSubmit={handleSubmit}>
                    <div className="form-row">
                      {/* Name */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            id="pasentname"
                            name="pasentname"
                            className="form-control"
                            placeholder="Your Name*"
                            value={formData.pasentname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="email"
                            name="pasentmail"
                            className="form-control"
                            placeholder="Your Mail*"
                            value={formData.pasentmail}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="pasentnumber"
                            className="form-control"
                            placeholder="Your Number*"
                            value={formData.pasentnumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Speciality Dropdown */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <select
                            name="speciality"
                            className="form-control"
                            value={formData.speciality}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Choose Speciality...</option>
                            {Object.keys(SPECIALITY_DOCTORS).map((spec) => (
                              <option key={spec} value={spec}>
                                {spec}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Date Selection */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="date"
                            name="selectedDate"
                            className="form-control"
                            value={selectedDate}
                            onChange={handleDateChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>

                      {/* Subject (Optional) */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="subject"
                            className="form-control"
                            placeholder="Subject (Optional)"
                            value={formData.subject}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Time Slots Grid (Only show if date is selected) */}
                      {selectedDate && (
                        <div className="form-group col-md-12 col-lg-12">
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#64748B", marginBottom: "12px", display: "block" }}>Select Time Slot</label>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {TIME_SLOTS.map((slot) => {
                              const isBooked = checkIsSlotBooked(slot);
                              const isSelected = selectedSlot === slot;

                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => {
                                    setSelectedSlot(slot);
                                    const combined = combineDateAndTime(selectedDate, slot);
                                    setFormData((prev) => ({
                                      ...prev,
                                      appointmenttime: combined.toISOString(),
                                    }));
                                  }}
                                  style={{
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    border: "1.5px solid",
                                    borderColor: isBooked ? "#E2E8F0" : isSelected ? "#3F59FF" : "#CBD5E1",
                                    backgroundColor: isBooked ? "#F1F5F9" : isSelected ? "#3F59FF" : "#FFFFFF",
                                    color: isBooked ? "#94A3B8" : isSelected ? "#FFFFFF" : "#0F172A",
                                    cursor: isBooked ? "not-allowed" : "pointer",
                                    fontWeight: "600",
                                    textDecoration: isBooked ? "line-through" : "none",
                                    transition: "all 0.2s"
                                  }}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="form-group col-md-12 col-lg-12">
                        <button
                          type="submit"
                          className="btn submit-btn"
                          disabled={isSubmitting || !selectedDate || !selectedSlot}
                          style={{ 
                            width: "100%", 
                            backgroundColor: (!selectedDate || !selectedSlot) ? "#94A3B8" : "", 
                            cursor: (!selectedDate || !selectedSlot) ? "not-allowed" : "pointer" 
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner"></span>
                              Submitting...
                            </>
                          ) : (
                            "Make Appointment"
                          )}
                        </button>
                      </div>

                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="adjust_shape">
          <img src="assets/img/bg/bg_shapes.png" alt="" />
        </div>
      </div>

      {showSuccess && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(6, 15, 45, 0.4)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "420px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.8)",
            transform: "scale(1)",
            transition: "transform 0.3s ease"
          }}>
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#10B981",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "32px",
              margin: "0 auto 20px auto"
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#060F2D", marginBottom: "10px" }}>
              Request Submitted!
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.6", marginBottom: "25px" }}>
              Your appointment request has been logged. Our administration team will contact you shortly to confirm your scheduled slot.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#3F59FF",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2B44DD"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3F59FF"}
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
