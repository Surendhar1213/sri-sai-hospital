import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
   FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaStethoscope,
  FaCommentMedical,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "./BookAppointment.css";

const SPECIALITIES = [
  { id: "gynecology", label: "Gynecology & Women's Health", icon: "🌸" },
  { id: "fertility", label: "Infertility & Fertility", icon: "👶" },
  { id: "obstetrics", label: "Obstetrics & Maternity", icon: "🤱" },
  { id: "endocrinology", label: "Endocrinology", icon: "⚗️" },
  { id: "obesity", label: "Obesity & Weight Loss", icon: "🏃" },
  { id: "diabetology", label: "Diabetology", icon: "💉" },
  { id: "dermatology", label: "Dermatology & Cosmetology", icon: "✨" },
  { id: "hairandnail", label: "Hair & Nail Clinic", icon: "💇" },
  { id: "urology", label: "Urology", icon: "🏥" },
  { id: "generalmedicine", label: "General Medicine", icon: "🩺" },
  { id: "pelvicfloor", label: "Pelvic Floor Rehabilitation", icon: "💪" },
  { id: "womens-wellness", label: "Women's Intimate Wellness", icon: "🌺" },
];

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM",     
];

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Speciality, 2 = Details, 3 = Confirm
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auth Guard — Login இல்லாட்டி /login க்கு redirect
  
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Pre-fill from localStorage if logged in
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    speciality: "",
    specialityLabel: "",
    date: "",
    timeSlot: "",
    doctorPreference: "",
    notes: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Get tomorrow's date as min
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  // Get max date (3 months from now)
  const getMaxDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split("T")[0];
  };

  const handleSpecialitySelect = (id: string, label: string) => {
    setFormData({ ...formData, speciality: id, specialityLabel: label });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && !formData.speciality) {
      setError("Please select a speciality");
      return;
    }
    if (step === 2) {
      if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.timeSlot) {
        setError("Please fill all required fields");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call (replace with real endpoint when ready)
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitted(true);
    } catch {
      setError("Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <div className="appt-page">
        <div className="appt-success-card">
          <div className="appt-success-icon">
            <FaCheckCircle />
          </div>
          <h2 className="appt-success-title">Appointment Booked!</h2>
          <p className="appt-success-desc">
            Your appointment has been successfully scheduled. We'll send a
            confirmation to <strong>{formData.email}</strong>.
          </p>
          <div className="appt-success-details">
            <div className="appt-success-detail-item">
              <span className="appt-success-detail-label">Speciality</span>
              <span className="appt-success-detail-value">
                {formData.specialityLabel}
              </span>
            </div>
            <div className="appt-success-detail-item">
              <span className="appt-success-detail-label">Date</span>
              <span className="appt-success-detail-value">
                {new Date(formData.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="appt-success-detail-item">
              <span className="appt-success-detail-label">Time</span>
              <span className="appt-success-detail-value">
                {formData.timeSlot}
              </span>
            </div>
          </div>
          <div className="appt-success-actions">
            <button
              className="appt-btn-primary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
            <button
              className="appt-btn-secondary"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormData({
                  name: userInfo?.name || "",
                  email: userInfo?.email || "",
                  phone: userInfo?.phone || "",
                  speciality: "",
                  specialityLabel: "",
                  date: "",
                  timeSlot: "",
                  doctorPreference: "",
                  notes: "",
                });
              }}
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appt-page">
      {/* Header */}
      <div className="appt-header">
        <button className="appt-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="appt-header-content">
          <h1 className="appt-page-title">Book an Appointment</h1>
          <p className="appt-page-subtitle">
            Schedule your visit with our expert specialists
          </p>
        </div>

        {/* Step Indicator */}
        <div className="appt-steps">
          {[
            { num: 1, label: "Speciality" },
            { num: 2, label: "Details" },
            { num: 3, label: "Confirm" },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div
                className={`appt-step ${step === s.num ? "appt-step-active" : ""} ${step > s.num ? "appt-step-done" : ""}`}
              >
                <div className="appt-step-circle">
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className="appt-step-label">{s.label}</span>
              </div>
              {i < 2 && <div className={`appt-step-line ${step > s.num ? "appt-step-line-done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="appt-error">⚠️ {error}</div>
      )}

      {/* ── STEP 1: SPECIALITY ── */}
      {step === 1 && (
        <div className="appt-card appt-fade-in">
          <div className="appt-card-header">
            <FaStethoscope className="appt-card-icon" />
            <div>
              <h2 className="appt-card-title">Choose Speciality</h2>
              <p className="appt-card-subtitle">
                Select the department for your appointment
              </p>
            </div>
          </div>

          <div className="appt-speciality-grid">
            {SPECIALITIES.map((spec) => (
              <button
                key={spec.id}
                type="button"
                className={`appt-speciality-card ${formData.speciality === spec.id ? "appt-speciality-card-active" : ""}`}
                onClick={() => handleSpecialitySelect(spec.id, spec.label)}
              >
                <span className="appt-speciality-icon">{spec.icon}</span>
                <span className="appt-speciality-label">{spec.label}</span>
                {formData.speciality === spec.id && (
                  <span className="appt-speciality-check">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="appt-nav">
            <div />
            <button className="appt-btn-primary" onClick={nextStep}>
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: DETAILS ── */}
      {step === 2 && (
        <div className="appt-card appt-fade-in">
          <div className="appt-card-header">
            <FaCalendarAlt className="appt-card-icon" />
            <div>
              <h2 className="appt-card-title">Your Details</h2>
              <p className="appt-card-subtitle">
                Fill in your information and preferred schedule
              </p>
            </div>
          </div>

          <form className="appt-form">
            <div className="appt-form-grid">
              {/* Name */}
              <div className="appt-field">
                <label className="appt-label">
                  <FaUser size={12} /> Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="appt-input"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="appt-field">
                <label className="appt-label">
                  <FaEnvelope size={12} /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  className="appt-input"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="appt-field">
                <label className="appt-label">
                  <FaPhone size={12} /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="appt-input"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Doctor Preference */}
              <div className="appt-field">
                <label className="appt-label">
                  <FaUserMd size={12} /> Doctor Preference (Optional)
                </label>
                <input
                  type="text"
                  name="doctorPreference"
                  className="appt-input"
                  placeholder="Preferred doctor name (if any)"
                  value={formData.doctorPreference}
                  onChange={handleChange}
                />
              </div>

              {/* Date */}
              <div className="appt-field">
                <label className="appt-label">
                  <FaCalendarAlt size={12} /> Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  className="appt-input"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTomorrow()}
                  max={getMaxDate()}
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="appt-field">
                <label className="appt-label">
                  <FaClock size={12} /> Preferred Time *
                </label>
                <div className="appt-time-slots">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`appt-time-slot ${formData.timeSlot === slot ? "appt-time-slot-active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, timeSlot: slot })
                      }
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="appt-field appt-field-full">
                <label className="appt-label">
                  <FaCommentMedical size={12} /> Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  className="appt-input appt-textarea"
                  placeholder="Any symptoms, concerns or special requests..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="appt-nav">
              <button
                type="button"
                className="appt-btn-secondary"
                onClick={prevStep}
              >
                <FaArrowLeft /> Back
              </button>
              <button
                type="button"
                className="appt-btn-primary"
                onClick={nextStep}
              >
                Review <FaArrowRight />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 3: CONFIRM ── */}
      {step === 3 && (
        <div className="appt-card appt-fade-in">
          <div className="appt-card-header">
            <FaCheckCircle className="appt-card-icon appt-card-icon-green" />
            <div>
              <h2 className="appt-card-title">Confirm Appointment</h2>
              <p className="appt-card-subtitle">
                Please review your details before confirming
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="appt-summary">
            <div className="appt-summary-section">
              <h3 className="appt-summary-section-title">🏥 Appointment Info</h3>
              <div className="appt-summary-grid">
                <div className="appt-summary-item">
                  <span className="appt-summary-key">Speciality</span>
                  <span className="appt-summary-value">
                    {formData.specialityLabel}
                  </span>
                </div>
                <div className="appt-summary-item">
                  <span className="appt-summary-key">Date</span>
                  <span className="appt-summary-value">
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="appt-summary-item">
                  <span className="appt-summary-key">Time</span>
                  <span className="appt-summary-value">{formData.timeSlot}</span>
                </div>
                {formData.doctorPreference && (
                  <div className="appt-summary-item">
                    <span className="appt-summary-key">Doctor</span>
                    <span className="appt-summary-value">
                      {formData.doctorPreference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="appt-summary-section">
              <h3 className="appt-summary-section-title">👤 Patient Info</h3>
              <div className="appt-summary-grid">
                <div className="appt-summary-item">
                  <span className="appt-summary-key">Name</span>
                  <span className="appt-summary-value">{formData.name}</span>
                </div>
                <div className="appt-summary-item">
                  <span className="appt-summary-key">Email</span>
                  <span className="appt-summary-value">{formData.email}</span>
                </div>
                <div className="appt-summary-item">
                  <span className="appt-summary-key">Phone</span>
                  <span className="appt-summary-value">{formData.phone}</span>
                </div>
              </div>
            </div>

            {formData.notes && (
              <div className="appt-summary-section">
                <h3 className="appt-summary-section-title">📝 Notes</h3>
                <p className="appt-summary-notes">{formData.notes}</p>
              </div>
            )}
          </div>

          <div className="appt-confirm-notice">
            <span>ℹ️</span>
            <span>
              Our team will contact you at <strong>{formData.phone}</strong> to
              confirm the appointment within 24 hours.
            </span>
          </div>

          <div className="appt-nav">
            <button
              type="button"
              className="appt-btn-secondary"
              onClick={prevStep}
            >
              <FaArrowLeft /> Edit
            </button>
            <button
              className="appt-btn-primary appt-btn-confirm"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="appt-spinner" />
              ) : (
                <>
                  <FaCheckCircle /> Confirm Appointment
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
