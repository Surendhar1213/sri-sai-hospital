import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Appointment.css"; // We'll create this CSS file for styles
import AuthModal from "../../AuthModal/AuthModal";

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
  const navigate = useNavigate();
  // Pre-fill from localStorage if logged in
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [formData, setFormData] = useState({
    pasentname: userInfo?.name || "",
    pasentmail: userInfo?.email || "",
    pasentnumber: userInfo?.phone || "",
    appointmenttime: "",
    speciality: "",
    subject: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const TIME_SLOTS = [
    // Morning Session (10:00 AM - 01:00 PM)
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    // 01:00 PM to 02:00 PM Lunch Break (ஸ்லாட்டுகள் தவிர்க்கப்பட்டுள்ளன)
    // Afternoon & Evening Session (02:00 PM - 07:00 PM)
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM"
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

  const getTodayLocalDateStr = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isSlotInPast = (slot: string): boolean => {
    if (!selectedDate) return false;
    const todayStr = getTodayLocalDateStr();
    if (selectedDate === todayStr) {
      const slotTime = combineDateAndTime(selectedDate, slot);
      return slotTime.getTime() < Date.now();
    }
    return false;
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
    const interval = setInterval(fetchBookedSlots, 5000);
    return () => clearInterval(interval);
  }, [selectedDate, formData.speciality]);

  // Check if returning from CCAvenue payment callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment_status");
    if (paymentStatus === "success") {
      setShowSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === "failed") {
      setShowFailure(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showTermsModal || showSuccess || isAuthModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showTermsModal, showSuccess, isAuthModalOpen]);

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
    let { name, value } = e.target;
    if (name === "pasentnumber") {
      value = value.replace(/\D/g, "");
      if (value.length > 0 && !/^[6-9]/.test(value)) {
        setPhoneError("Indian mobile numbers must start with 6, 7, 8, or 9.");
      } else if (value.length > 0 && value.length < 10) {
        setPhoneError("Mobile number must be exactly 10 digits.");
      } else {
        setPhoneError("");
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert("Please select a date and time slot first.");
      return;
    }

    const phoneVal = formData.pasentnumber.replace(/\D/g, "");
    if (phoneVal.length !== 10 || !/^[6-9]/.test(phoneVal)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    setAcceptedTerms(false);
    setShowTermsModal(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    const freshUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setFormData((prev) => ({
      ...prev,
      pasentname: freshUser?.name || prev.pasentname,
      pasentmail: freshUser?.email || prev.pasentmail,
      pasentnumber: freshUser?.phone || prev.pasentnumber,
    }));
    setAcceptedTerms(false);
    setShowTermsModal(true);
  };


  const handleProceedToPayment = async () => {
    if (!acceptedTerms) return;
    setShowTermsModal(false);
    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const consultationFee = 5;
      const appointmenttime = combineDateAndTime(selectedDate, selectedSlot).toISOString();

      let orderResponse;
      try {
        orderResponse = await fetch(`${backendUrl}/api/payments/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: consultationFee,
            pasentname: formData.pasentname,
            pasentmail: formData.pasentmail,
            pasentnumber: `+91${formData.pasentnumber}`,
            appointmenttime,
            speciality: formData.speciality,
            subject: formData.subject || "General consultation booking"
          }),
        });
      } catch (err: any) {
        alert(`Network Connection Error!\nFailed to connect to: ${backendUrl}/api/payments/create-order\nError: ${err.message}`);
        setIsSubmitting(false);
        return;
      }

      const responseText = await orderResponse.text();
      let orderData;
      try {
        orderData = JSON.parse(responseText);
      } catch (err: any) {
        alert(`API Error: Expected JSON response.\n\nResponse Preview:\n${responseText.substring(0, 150)}`);
        setIsSubmitting(false);
        return;
      }

      if (!orderResponse.ok || !orderData.success) {
        alert(orderData.message || "Failed to initiate payment order");
        setIsSubmitting(false);
        return;
      }

      // Automatically construct and submit hidden form to CCAvenue Gateway
      const form = document.createElement("form");
      form.method = "POST";
      form.action = orderData.ccavenueUrl;

      const inputEncReq = document.createElement("input");
      inputEncReq.type = "hidden";
      inputEncReq.name = "encRequest";
      inputEncReq.value = orderData.encRequest;
      form.appendChild(inputEncReq);

      const inputAccessCode = document.createElement("input");
      inputAccessCode.type = "hidden";
      inputAccessCode.name = "access_code";
      inputAccessCode.value = orderData.accessCode;
      form.appendChild(inputAccessCode);

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      alert(err.message || "Failed to process payment flow.");
      setIsSubmitting(false);
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
                            disabled={!formData.pasentname.trim()}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper phone-input-wrapper">
                          <span className="phone-prefix">+91</span>
                          <input
                            type="text"
                            name="pasentnumber"
                            className="form-control phone-input"
                            placeholder="Your Number*"
                            value={formData.pasentnumber}
                            onChange={handleChange}
                            required
                            disabled={!formData.pasentmail.trim()}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                          />
                        </div>
                        {phoneError && (
                          <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
                            <span>⚠️</span> {phoneError}
                          </div>
                        )}
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
                            disabled={!formData.pasentnumber.trim()}
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
                            min={getTodayLocalDateStr()}
                            disabled={!formData.speciality}
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
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#64748B", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>🕒 Select Preferred Time Slot (30 Mins Session)</span>
                          </label>


                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {TIME_SLOTS.filter(slot => !isSlotInPast(slot)).map((slot) => {
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
                                    borderColor: isBooked ? "#E2E8F0" : isSelected ? "#4A65FF" : "#CBD5E1",
                                    backgroundColor: isBooked ? "#F1F5F9" : isSelected ? "#4A65FF" : "#FFFFFF",
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
                      <div className="form-group col-md-12 col-lg-12" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <button
                          type="submit"
                          className="btn submit-btn"
                          disabled={isSubmitting || !selectedDate || !selectedSlot}
                          style={{
                            width: "auto",
                            minWidth: "280px"
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner"></span>
                              Submitting...
                            </>
                          ) : (
                            "Pay ₹1,000 & Book Appointment"
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
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(6, 15, 45, 0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "16px",
          boxSizing: "border-box",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "32px 24px",
            maxWidth: "420px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxSizing: "border-box"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#10B981",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              margin: "0 auto 16px auto"
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: "21px", fontWeight: "700", color: "#060F2D", marginBottom: "10px" }}>
              Request Submitted!
            </h3>
            <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: "1.6", marginBottom: "22px" }}>
              Your appointment request has been logged. Our administration team will contact you shortly to confirm your scheduled slot.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/profile?tab=appointments");
              }}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#4A65FF",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2B44DD"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4A65FF"}
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      )}

      {showFailure && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(6, 15, 45, 0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "16px",
          boxSizing: "border-box",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "32px 24px",
            maxWidth: "420px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxSizing: "border-box"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#EF4444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              margin: "0 auto 16px auto",
              fontWeight: "bold"
            }}>
              ⚠️
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#060F2D", marginBottom: "10px" }}>
              Booking Cancelled
            </h3>
            <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: "1.6", marginBottom: "22px" }}>
              Your payment attempt was cancelled or failed, so the slot was not booked. If any amount was deducted, it will be refunded automatically by your bank within 5-7 business days.
            </p>
            <button
              onClick={() => setShowFailure(false)}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#DC2626"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#EF4444"}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="terms-modal-overlay">
          <style>{`
            .terms-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(15, 23, 42, 0.75);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
              padding: 16px;
              box-sizing: border-box;
              overflow-y: auto;
              animation: fadeIn 0.3s ease-out;
            }
            .terms-modal-card {
              background-color: #FFFFFF;
              border-radius: 24px;
              padding: 32px 28px;
              max-width: 500px;
              width: 100%;
              max-height: calc(100vh - 32px);
              box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
              border: 1px solid rgba(255, 255, 255, 0.8);
              display: flex;
              flex-direction: column;
              gap: 18px;
              position: relative;
              overflow: hidden;
              box-sizing: border-box;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .terms-scroll-container::-webkit-scrollbar {
              width: 5px;
            }
            .terms-scroll-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .terms-scroll-container::-webkit-scrollbar-thumb {
              background-color: #CBD5E1;
              border-radius: 20px;
            }
            .terms-scroll-container::-webkit-scrollbar-thumb:hover {
              background-color: #94A3B8;
            }
            @media (max-width: 640px) {
              .terms-modal-overlay {
                padding: 12px;
              }
              .terms-modal-card {
                padding: 20px 16px !important;
                border-radius: 20px !important;
                gap: 14px !important;
                max-height: 92vh !important;
              }
              .terms-modal-title {
                font-size: 19px !important;
              }
              .terms-modal-subtitle {
                font-size: 12.5px !important;
              }
              .terms-modal-icon {
                width: 48px !important;
                height: 48px !important;
                border-radius: 14px !important;
              }
              .terms-modal-icon svg {
                width: 24px !important;
                height: 24px !important;
              }
              .terms-scroll-container {
                padding: 12px 14px !important;
                max-height: 150px !important;
                font-size: 12px !important;
              }
              .terms-modal-checkbox {
                padding: 8px 10px !important;
                font-size: 12px !important;
              }
              .terms-modal-buttons {
                gap: 8px !important;
              }
              .terms-modal-btn {
                padding: 12px 14px !important;
                font-size: 13.5px !important;
                border-radius: 12px !important;
              }
            }
          `}</style>
          <div className="terms-modal-card">
            {/* Soft top gradient accent line */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "5px",
              background: "linear-gradient(90deg, #DA4D4F 0%, #276BD4 100%)"
            }}></div>

            {/* Close button for quick mobile dismissal */}
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#F1F5F9",
                border: "none",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                zIndex: 10
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div className="terms-modal-icon" style={{
                width: "58px",
                height: "58px",
                borderRadius: "18px",
                backgroundColor: "rgba(39, 107, 212, 0.08)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#276BD4",
                boxShadow: "inset 0 0 12px rgba(39, 107, 212, 0.05)"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="terms-modal-title" style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0", letterSpacing: "-0.03em" }}>
                  Terms & Privacy Policy
                </h3>
                <p className="terms-modal-subtitle" style={{ fontSize: "13.5px", color: "#64748B", margin: 0, fontWeight: "500" }}>
                  Please read and accept the terms to proceed with payment
                </p>
              </div>
            </div>

            {/* Scrollable Terms Content */}
            <div className="terms-scroll-container" style={{
              maxHeight: "180px",
              overflowY: "auto",
              padding: "16px 18px",
              backgroundColor: "#F8FAFC",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              fontSize: "13px",
              color: "#475569",
              lineHeight: "1.55",
              textAlign: "left"
            }}>
              <h4 style={{ fontWeight: "700", color: "#0F172A", fontSize: "13.5px", margin: "0 0 6px 0" }}>1. Booking & Cancellation Policy</h4>
              <p style={{ margin: "0 0 14px 0" }}>
                Appointments can be booked online by paying a standard consultation fee of ₹5. Cancellations made at least 24 hours prior to the slot are eligible for a full refund.
              </p>
              <h4 style={{ fontWeight: "700", color: "#0F172A", fontSize: "13.5px", margin: "0 0 6px 0" }}>2. Privacy & Data Protection</h4>
              <p style={{ margin: "0 0 14px 0" }}>
                Sri Sai Hospital values your privacy. The patient details (Name, Contact, and Email) provided during booking will only be used for appointment coordination, health record maintenance, and notifications.
              </p>
              <h4 style={{ fontWeight: "700", color: "#0F172A", fontSize: "13.5px", margin: "0 0 6px 0" }}>3. Consultation Terms</h4>
              <p style={{ margin: 0 }}>
                The fee paid covers online consultation scheduling or in-hospital checkups for the selected specialty. Please ensure you arrive 15 minutes before your slot.
              </p>
            </div>

            {/* Checkbox Agreement */}
            <label className="terms-modal-checkbox" style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontSize: "13px",
              color: "#334155",
              cursor: "pointer",
              userSelect: "none",
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: "12px",
              backgroundColor: "rgba(241, 245, 249, 0.6)",
              border: "1px solid #E2E8F0",
              transition: "all 0.2s"
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0.9)";
                e.currentTarget.style.borderColor = "#CBD5E1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0.6)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  minWidth: "18px",
                  accentColor: "#276BD4",
                  cursor: "pointer",
                  marginTop: "2px",
                  border: "2px solid #CBD5E1",
                  borderRadius: "5px"
                }}
              />
              <span style={{ fontWeight: "500", lineHeight: "1.4" }}>
                I agree to the <b style={{ color: "#0F172A" }}>Terms of Booking</b> and authorize Sri Sai Hospital to contact me regarding this appointment.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="terms-modal-buttons" style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <button
                type="button"
                className="terms-modal-btn"
                onClick={() => setShowTermsModal(false)}
                style={{
                  flex: 1,
                  padding: "14px 18px",
                  backgroundColor: "#F1F5F9",
                  color: "#64748B",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "14.5px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#E2E8F0";
                  e.currentTarget.style.color = "#475569";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#F1F5F9";
                  e.currentTarget.style.color = "#64748B";
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="terms-modal-btn"
                disabled={!acceptedTerms}
                onClick={handleProceedToPayment}
                style={{
                  flex: 1.3,
                  padding: "14px 18px",
                  background: acceptedTerms
                    ? "linear-gradient(90deg, #DA4D4F 0%, #276BD4 100%)"
                    : "#CBD5E1",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "14.5px",
                  cursor: acceptedTerms ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  boxShadow: acceptedTerms ? "0 4px 15px rgba(39, 107, 212, 0.25)" : "none"
                }}
                onMouseOver={(e) => {
                  if (acceptedTerms) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(39, 107, 212, 0.35)";
                  }
                }}
                onMouseOut={(e) => {
                  if (acceptedTerms) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(39, 107, 212, 0.25)";
                  }
                }}
              >
                Agree & Pay ₹5
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Appointment;
