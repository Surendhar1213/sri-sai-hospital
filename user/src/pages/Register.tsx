import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Droplet,
  Users
} from "lucide-react";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "Unknown",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [ageError, setAgeError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  // Input change handle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 0 && !/^[6-9]/.test(value)) {
        setPhoneError("Indian phone numbers must start with 6, 7, 8, or 9.");
      } else if (value.length > 0 && value.length < 10) {
        setPhoneError("Phone number must be exactly 10 digits.");
      } else {
        setPhoneError("");
      }
    }

    if (name === "age") {
      value = value.replace(/\D/g, "");
      const ageNum = Number(value);
      if (value.length > 0 && (ageNum < 1 || ageNum > 120)) {
        setAgeError("Age must be between 1 and 120.");
      } else {
        setAgeError("");
      }
    }

    if (name === "name") {
      if (value.length > 0 && !/^[a-zA-Z\s]*$/.test(value)) {
        setNameError("Name must contain letters only.");
      } else if (value.length > 0 && value.trim().length < 3) {
        setNameError("Name must be at least 3 characters.");
      } else {
        setNameError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Full Name check
    if (!formData.name.trim() || formData.name.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(formData.name)) {
      const msg = "Please enter a valid name (at least 3 characters, letters only)";
      setError(msg);
      toast.warning("⚠️ " + msg);
      return;
    }

    // Gmail validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      const msg = "Please enter a valid Gmail address (ending in @gmail.com)";
      setError(msg);
      toast.warning("⚠️ " + msg);
      return;
    }

    // Phone Number check
    if (formData.phone.length !== 10 || !/^[6-9]/.test(formData.phone)) {
      const msg = "Please enter a valid 10-digit Indian phone number starting with 6-9";
      setError(msg);
      toast.warning("⚠️ " + msg);
      return;
    }

    // Age Check
    const ageNum = Number(formData.age);
    if (!formData.age || ageNum < 1 || ageNum > 120) {
      const msg = "Please enter a valid age (between 1 and 120)";
      setError(msg);
      toast.warning("⚠️ " + msg);
      return;
    }

    // Password match check
    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.warning("⚠️ " + msg);
      return;
    }

    // Password length check
    if (formData.password.length < 6) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      toast.warning("⚠️ " + msg);
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          age: Number(formData.age),
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      toast.success("🎉 Account created successfully! Please login to continue.");

      setTimeout(() => navigate("/login", { state: { from } }), 2000);

    } catch (err: any) {
      const errMsg = err.message || "Connection error. Please try again.";
      setError(errMsg);
      toast.error("❌ " + errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <div className="user-auth-wrapper user-auth-wrapper-register">
        {/* Left Side: Brand Promo panel */}
        <div className="user-auth-left">
          <div className="user-auth-brand">
            <div className="user-auth-brand-logo-container">
              <div className="user-auth-logo-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="user-auth-brand-details">
                <span className="user-auth-brand-name">Sri Sai Hospital</span>
                <span className="user-auth-brand-sub">Care • Compassion • Cure</span>
              </div>
            </div>
          </div>
          <h2 className="user-auth-left-title">Join Our Community</h2>
          <div className="user-auth-title-line" />
          <p className="user-auth-left-desc">
            Create your patient profile to get started with advanced healthcare services, easy appointment booking, and instant access to your records.
          </p>

          <div className="user-auth-features">
            <div className="user-auth-feature-item">
              <div className="user-auth-feature-icon-circle">
                <Stethoscope size={18} />
              </div>
              <span>Consult Top Specialists</span>
            </div>
            <div className="user-auth-feature-item">
              <div className="user-auth-feature-icon-circle">
                <Calendar size={18} />
              </div>
              <span>Online Appointment Booking</span>
            </div>
            <div className="user-auth-feature-item">
              <div className="user-auth-feature-icon-circle">
                <ShieldCheck size={18} />
              </div>
              <span>Secure & Confidential Records</span>
            </div>
          </div>

          {/* Hospital Building Vector Outline SVG */}
          <div className="user-auth-hospital-svg-wrap">
            <svg className="user-auth-hospital-svg" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="110" x2="290" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 40 110 L 40 95" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <circle cx="40" cy="85" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <path d="M 40 73 L 40 97" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <path d="M 260 110 L 260 95" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <circle cx="260" cy="85" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <path d="M 25 45 Q 35 35 45 45 Q 55 45 50 55 L 20 55 Q 15 50 25 45 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M 245 35 Q 252 27 260 35 Q 268 35 264 42 L 240 42 Q 236 38 245 35 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <rect x="110" y="40" width="80" height="70" rx="4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <rect x="80" y="60" width="30" height="50" rx="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <rect x="190" y="60" width="30" height="50" rx="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <path d="M 140 110 L 140 95 Q 140 90 145 90 L 155 90 Q 160 90 160 95 L 160 110" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <rect x="122" y="52" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="144" y="52" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="166" y="52" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="122" y="68" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="144" y="68" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="166" y="68" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="122" y="84" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="166" y="84" width="12" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="88" y="70" width="14" height="10" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="88" y="88" width="14" height="10" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="198" y="70" width="14" height="10" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="198" y="88" width="14" height="10" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <rect x="145" y="22" width="10" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
              <path d="M 150 16 L 150 28 M 144 22 L 156 22" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="user-auth-right">
          <div className="user-auth-card user-auth-card-register">
            {/* Header */}
            <div className="user-auth-header-container">
              <div className="user-auth-header-icon-box">
                <User size={26} />
              </div>
              <div className="user-auth-header-text">
                <h2 className="user-auth-header-title">
                  Patient <span>Registration</span>
                </h2>
                <p className="user-auth-header-subtitle">Create your Sri Sai Hospital account</p>
              </div>
            </div>

            {/* Plus divider */}
            <div className="user-auth-center-divider">
              <div className="user-auth-center-line" />
              <div className="user-auth-center-badge">
                <PlusCircle size={20} />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="user-auth-error">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="user-auth-success">
                <span>✅ {success}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleRegister} className="user-auth-form">
              <div className="user-auth-grid">
                {/* Full Name */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Full Name *</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="user-auth-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  {nameError && (
                    <span style={{ color: "#EF4444", fontSize: "11px", display: "block", marginTop: "4px", fontWeight: "600" }}>
                      ⚠️ {nameError}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Email Address *</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="user-auth-input"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={!formData.name}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Phone Number *</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      className="user-auth-input"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={!formData.email}
                      maxLength={10}
                    />
                  </div>
                  {phoneError && (
                    <span style={{ color: "#EF4444", fontSize: "11px", display: "block", marginTop: "4px", fontWeight: "600" }}>
                      ⚠️ {phoneError}
                    </span>
                  )}
                </div>

                {/* Age */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Age *</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="number"
                      name="age"
                      className="user-auth-input"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      required
                      disabled={!formData.phone}
                    />
                  </div>
                  {ageError && (
                    <span style={{ color: "#EF4444", fontSize: "11px", display: "block", marginTop: "4px", fontWeight: "600" }}>
                      ⚠️ {ageError}
                    </span>
                  )}
                </div>

                {/* Gender */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Gender *</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <Users size={18} />
                    </span>
                    <select
                      name="gender"
                      className="user-auth-input user-auth-select"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      disabled={!formData.age}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Blood Group</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <Droplet size={18} />
                    </span>
                    <select
                      name="bloodGroup"
                      className="user-auth-input user-auth-select"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      disabled={!formData.gender}
                    >
                      <option value="Unknown">Select blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Password *</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="user-auth-input user-auth-input-padded"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      disabled={!formData.gender}
                    />
                    <button
                      type="button"
                      className="user-auth-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!formData.gender}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="user-auth-field">
                  <label className="user-auth-label">Confirm Password *</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="user-auth-input user-auth-input-padded"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={!formData.password}
                    />
                    <button
                      type="button"
                      className="user-auth-eye-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={!formData.password}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="user-auth-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="user-auth-spinner" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} /> Create Account
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="user-auth-switch">
              Already registered?{" "}
              <Link to="/login" state={{ from }} className="user-auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
