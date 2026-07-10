import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
  }, [selectedDate, formData.speciality]);

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
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Razorpay SDK-ஐ பிரவுசரில் லோடு செய்வதற்கான ஹெல்பர்
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert("Please select a date and time slot first.");
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
      // 1. Razorpay ஸ்கிரிப்ட் லோடு செய்யப்படுகிறதா எனச் சோதிக்கவும்
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // 2. பேமெண்ட் கட்டணத்தை ₹1000 ஆக செட் செய்கிறோம்
      const consultationFee = 1000;
      let orderResponse;
      try {
        orderResponse = await fetch(`${backendUrl}/api/payments/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: consultationFee }),
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
        alert(`API Error: Expected JSON but received HTML.\n\n` +
          `Requested URL: ${backendUrl}/api/payments/create-order\n` +
          `HTTP Status: ${orderResponse.status} ${orderResponse.statusText}\n\n` +
          `Response Preview (First 150 chars):\n${responseText.substring(0, 150)}`);
        setIsSubmitting(false);
        return;
      }

      if (!orderResponse.ok) {
        alert(orderData.message || "Failed to initiate payment order");
        setIsSubmitting(false);
        return;
      }

      // 3. தேதி மற்றும் நேரத்தை ஒருங்கிணைக்கிறோம் (இங்கு ஏற்கனவே உள்ள combineDateAndTime-ஐப் பயன்படுத்துகிறோம்)
      const appointmenttime = combineDateAndTime(selectedDate, selectedSlot).toISOString();

      let paymentProcessed = false;

      // 4. Razorpay பாப்-அப் விண்டோவிற்கான ஆப்ஷன்கள்
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TBQAbNQmdj88dM", // உங்களது Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sri Sai Hospital",
        description: `Appointment Consultation Fee - ${formData.speciality}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          paymentProcessed = true;
          try {
            // 5. பேமெண்ட் வெற்றிகரமாக முடிந்ததும் வெரிஃபை செய்கிறோம்
            const verifyResponse = await fetch(`${backendUrl}/api/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData.success) {
              alert("Payment verification failed");
              return;
            }

            // 6. வெரிஃபிகேஷன் முடிந்ததும் அப்பாயிண்ட்மென்ட்டை மங்கோடிபியில் சேமிக்கிறோம்
            const bookingResponse = await fetch(`${backendUrl}/api/appointments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                pasentname: formData.pasentname,
                pasentmail: formData.pasentmail,
                pasentnumber: `+91${formData.pasentnumber}`,
                appointmenttime,
                speciality: formData.speciality,
                subject: formData.subject || "General consultation booking",
                paymentStatus: "paid",
                paymentId: response.razorpay_payment_id
              }),
            });

            const bookingData = await bookingResponse.json();
            if (!bookingResponse.ok) {
              alert(bookingData.message || "Failed to save appointment after payment");
              return;
            }

            // புக் ஆனது உறுதியானதும் வெற்றிப் பாப்-அப்பைக் காட்டுகிறோம்
            setShowSuccess(true);

            // பார்ம் வேல்யூக்களை ரீசெட் செய்கிறோம்
            setFormData({
              pasentname: "",
              pasentmail: "",
              pasentnumber: "",
              appointmenttime: "",
              speciality: "",
              subject: "",
            });
            setSelectedDate("");
            setSelectedSlot("");
          } catch (err: any) {
            alert(`Payment successful, but appointment save error: ${err.message}`);
          }
        },
        prefill: {
          name: formData.pasentname,
          email: formData.pasentmail,
          contact: formData.pasentnumber,
        },
        theme: {
          color: "#3F59FF",
        },
        modal: {
          ondismiss: async function () {
            if (paymentProcessed) return;
            try {
              const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
              await fetch(`${backendUrl}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  pasentname: formData.pasentname,
                  pasentmail: formData.pasentmail,
                  pasentnumber: `+91${formData.pasentnumber}`,
                  appointmenttime,
                  speciality: formData.speciality,
                  subject: formData.subject || "Payment Cancelled / Dismissed by User",
                  paymentStatus: "failed",
                  paymentId: orderData.id || "cancelled_order"
                }),
              });
              setShowFailure(true);
            } catch (err) {
              console.error("Failed to log failed/cancelled appointment:", err);
            }
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err: any) {
      alert(err.message || "Failed to process booking flow.");
    } finally {
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
                            min={new Date().toISOString().split("T")[0]}
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
              onClick={() => {
                setShowSuccess(false);
                navigate("/profile?tab=appointments");
              }}
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

      {showFailure && (
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
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#EF4444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "32px",
              margin: "0 auto 20px auto",
              fontWeight: "bold"
            }}>
              ⚠️
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#060F2D", marginBottom: "10px" }}>
              Booking Cancelled
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.6", marginBottom: "25px" }}>
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
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(16px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          animation: "fadeIn 0.3s ease-out",
          touchAction: "none"
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "28px",
            padding: "40px",
            maxWidth: "520px",
            width: "90%",
            boxShadow: "0 30px 70px rgba(15, 23, 42, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            transform: "scale(1)",
            transition: "transform 0.3s ease",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Soft top gradient accent line */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "5px",
              background: "linear-gradient(90deg, #DA4D4F 0%, #276BD4 100%)"
            }}></div>

            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "18px",
                backgroundColor: "rgba(39, 107, 212, 0.08)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#276BD4",
                boxShadow: "inset 0 0 12px rgba(39, 107, 212, 0.05)"
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: "23px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0", letterSpacing: "-0.03em" }}>
                  Terms & Privacy Policy
                </h3>
                <p style={{ fontSize: "14px", color: "#64748B", margin: 0, fontWeight: "500" }}>
                  Please read and accept the terms to proceed with payment
                </p>
              </div>
            </div>

            {/* Scrollable Terms Content */}
            <div className="terms-scroll-container" style={{
              maxHeight: "180px",
              overflowY: "auto",
              padding: "20px",
              backgroundColor: "#F8FAFC",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              fontSize: "13px",
              color: "#475569",
              lineHeight: "1.6",
              textAlign: "left"
            }}>
              <style>{`
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
              `}</style>
              <h4 style={{ fontWeight: "700", color: "#0F172A", fontSize: "14px", margin: "0 0 8px 0" }}>1. Booking & Cancellation Policy</h4>
              <p style={{ margin: "0 0 16px 0" }}>
                Appointments can be booked online by paying a standard consultation fee of ₹1,000. Cancellations made at least 24 hours prior to the slot are eligible for a full refund.
              </p>
              <h4 style={{ fontWeight: "700", color: "#0F172A", fontSize: "14px", margin: "0 0 8px 0" }}>2. Privacy & Data Protection</h4>
              <p style={{ margin: "0 0 16px 0" }}>
                Sri Sai Hospital values your privacy. The patient details (Name, Contact, and Email) provided during booking will only be used for appointment coordination, health record maintenance, and notifications.
              </p>
              <h4 style={{ fontWeight: "700", color: "#0F172A", fontSize: "14px", margin: "0 0 8px 0" }}>3. Consultation Terms</h4>
              <p style={{ margin: 0 }}>
                The fee paid covers online consultation scheduling or in-hospital checkups for the selected specialty. Please ensure you arrive 15 minutes before your slot.
              </p>
            </div>

            {/* Checkbox Agreement */}
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              fontSize: "13.5px",
              color: "#334155",
              cursor: "pointer",
              userSelect: "none",
              textAlign: "left",
              padding: "8px 12px",
              borderRadius: "12px",
              backgroundColor: "rgba(241, 245, 249, 0.5)",
              border: "1px solid #E2E8F0",
              transition: "all 0.2s"
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0.9)";
                e.currentTarget.style.borderColor = "#CBD5E1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0.5)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  accentColor: "#276BD4",
                  cursor: "pointer",
                  marginTop: "2px",
                  border: "2px solid #CBD5E1",
                  borderRadius: "6px"
                }}
              />
              <span style={{ fontWeight: "500", lineHeight: "1.4" }}>
                I agree to the <b style={{ color: "#0F172A" }}>Terms of Booking</b> and authorize Sri Sai Hospital to contact me regarding this appointment.
              </span>
            </label>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "14px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  backgroundColor: "#F1F5F9",
                  color: "#64748B",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "15px",
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
                disabled={!acceptedTerms}
                onClick={handleProceedToPayment}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  background: acceptedTerms
                    ? "linear-gradient(90deg, #DA4D4F 0%, #276BD4 100%)"
                    : "#CBD5E1",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "15px",
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
                Agree & Pay ₹1,000
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
