import { useState, useEffect } from "react";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaCalendarCheck,
} from "react-icons/fa";
import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "Unknown",
  });

  // Reset on tab switch
  useEffect(() => {
    setError("");
    setSuccess("");
    setLoginData({ email: "", password: "" });
    setRegisterData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      age: "",
      gender: "",
      bloodGroup: "Unknown",
    });
  }, [activeTab]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── LOGIN ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid email or password");

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        onClose();
        onAuthSuccess();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── REGISTER ── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone,
          age: Number(registerData.age),
          gender: registerData.gender,
          bloodGroup: registerData.bloodGroup,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Account created! Please sign in.");
      setTimeout(() => {
        setSuccess("");
        setActiveTab("login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel */}
        <div className="auth-modal-left">
          <div className="auth-modal-left-content">
            <div className="auth-modal-brand">
              <div className="auth-modal-brand-icon">
                <FaCalendarCheck size={22} />
              </div>
              <span className="auth-modal-brand-name">Sri Sai Hospital</span>
            </div>
            <h2 className="auth-modal-left-title">
              {activeTab === "login"
                ? "Welcome Back!"
                : "Join Our Patient Community"}
            </h2>
            <p className="auth-modal-left-desc">
              {activeTab === "login"
                ? "Sign in to book appointments, track your health records, and connect with our specialists."
                : "Create your account to get personalized healthcare, appointment reminders, and more."}
            </p>
            <div className="auth-modal-features">
              <div className="auth-modal-feature">
                <span className="auth-modal-feature-icon">📅</span>
                <span>Book Appointments Online</span>
              </div>
              <div className="auth-modal-feature">
                <span className="auth-modal-feature-icon">🩺</span>
                <span>Access Your Health Records</span>
              </div>
              <div className="auth-modal-feature">
                <span className="auth-modal-feature-icon">🔔</span>
                <span>Get Appointment Reminders</span>
              </div>
              <div className="auth-modal-feature">
                <span className="auth-modal-feature-icon">💊</span>
                <span>Prescription Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-modal-right">
          {/* Close Button */}
          <button className="auth-modal-close" onClick={onClose}>
            <FaTimes />
          </button>

          {/* Tabs */}
          <div className="auth-modal-tabs">
            <button
              className={`auth-modal-tab ${activeTab === "login" ? "auth-modal-tab-active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Sign In
            </button>
            <button
              className={`auth-modal-tab ${activeTab === "register" ? "auth-modal-tab-active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
            <div
              className={`auth-modal-tab-indicator ${activeTab === "register" ? "auth-modal-tab-indicator-right" : ""}`}
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="auth-modal-error">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="auth-modal-success">
              <span>✅</span> {success}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {activeTab === "login" && (
            <form className="auth-modal-form" onSubmit={handleLogin}>
              <div className="auth-modal-field">
                <label className="auth-modal-label">Email Address</label>
                <div className="auth-modal-input-wrap">
                  <span className="auth-modal-input-icon">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email"
                    className="auth-modal-input"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-modal-field">
                <label className="auth-modal-label">Password</label>
                <div className="auth-modal-input-wrap">
                  <span className="auth-modal-input-icon">
                    <FaLock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-modal-input auth-modal-input-padded"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-modal-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-modal-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-modal-spinner" />
                ) : (
                  <>🔐 Sign In to Continue</>
                )}
              </button>

              <p className="auth-modal-switch">
                New patient?{" "}
                <button
                  type="button"
                  className="auth-modal-switch-btn"
                  onClick={() => setActiveTab("register")}
                >
                  Create Account
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {activeTab === "register" && (
            <form className="auth-modal-form" onSubmit={handleRegister}>
              <div className="auth-modal-grid">
                {/* Full Name */}
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Full Name *</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">
                      <FaUser size={13} />
                    </span>
                    <input
                      type="text"
                      className="auth-modal-input"
                      placeholder="Your full name"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Email *</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">
                      <FaEnvelope size={13} />
                    </span>
                    <input
                      type="email"
                      className="auth-modal-input"
                      placeholder="Your email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Phone *</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">
                      <FaPhone size={13} />
                    </span>
                    <input
                      type="tel"
                      className="auth-modal-input"
                      placeholder="Phone number"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Age *</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">🎂</span>
                    <input
                      type="number"
                      className="auth-modal-input"
                      placeholder="Age"
                      value={registerData.age}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, age: e.target.value })
                      }
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Gender *</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">👤</span>
                    <select
                      className="auth-modal-input auth-modal-select"
                      value={registerData.gender}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          gender: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Blood Group</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">🩸</span>
                    <select
                      className="auth-modal-input auth-modal-select"
                      value={registerData.bloodGroup}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          bloodGroup: e.target.value,
                        })
                      }
                    >
                      <option value="Unknown">Unknown</option>
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
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Password *</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">
                      <FaLock size={13} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-modal-input auth-modal-input-padded"
                      placeholder="Min 6 characters"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="auth-modal-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="auth-modal-field">
                  <label className="auth-modal-label">Confirm Password *</label>
                  <div className="auth-modal-input-wrap">
                    <span className="auth-modal-input-icon">
                      <FaLock size={13} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-modal-input auth-modal-input-padded"
                      placeholder="Re-enter password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="auth-modal-eye-btn"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={14} />
                      ) : (
                        <FaEye size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="auth-modal-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-modal-spinner" />
                ) : (
                  <>✅ Create Account</>
                )}
              </button>

              <p className="auth-modal-switch">
                Already registered?{" "}
                <button
                  type="button"
                  className="auth-modal-switch-btn"
                  onClick={() => setActiveTab("login")}
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
