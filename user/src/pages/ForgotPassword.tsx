import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaArrowLeft,
  FaCheckCircle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  // Dynamic Password Validation Conditions
  const checkMinLength = newPassword.length >= 8;
  const checkUppercase = /[A-Z]/.test(newPassword);
  const checkLowercase = /[a-z]/.test(newPassword);
  const checkNumber = /[0-9]/.test(newPassword);
  const checkSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const checkMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Strength score out of 5
  const strengthScore = [
    checkMinLength,
    checkUppercase,
    checkLowercase,
    checkNumber,
    checkSpecial
  ].filter(Boolean).length;

  const getStrengthTextAndColor = () => {
    if (newPassword.length === 0) return { text: "No Password", color: "#e2e8f0", width: "0%" };
    if (strengthScore <= 2) return { text: "Weak", color: "#dc2626", width: "35%" };
    if (strengthScore <= 4) return { text: "Medium", color: "#f97316", width: "70%" };
    return { text: "Strong", color: "#16a34a", width: "100%" };
  };

  const strengthInfo = getStrengthTextAndColor();

  // Timer countdown handler for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Gmail validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid Gmail address (ending in @gmail.com)");
      toast.error("Please enter a valid Gmail address");
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setSuccess("Verification OTP sent successfully to your Gmail.");
      toast.success("Verification OTP sent to your Gmail!");
      setStep(2);
      setCountdown(60); // 1-minute countdown to resend OTP
    } catch (err: any) {
      setError(err.message || "Connection error. Please try again.");
      toast.error(err.message || "Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not resend code.");
      }

      setSuccess("A new verification code was sent to your Gmail.");
      toast.success("New verification code sent!");
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "Connection error.");
      toast.error(err.message || "Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and transition to Password Reset
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (otp.length !== 6 || isNaN(Number(otp))) {
      setError("Please enter a valid 6-digit OTP code");
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP code. Please try again.");
      }

      toast.success("OTP verified successfully! Please set your new password.");
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Connection error. Please try again.");
      toast.error(err.message || "Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!checkMinLength || !checkUppercase || !checkLowercase || !checkNumber || !checkSpecial) {
      setError("Please satisfy all password strength requirements");
      toast.warning("Please satisfy all password strength requirements");
      return;
    }

    if (!checkMatch) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess("Password reset successful! Redirecting you to login...");
      toast.success("Password reset successful!");
      
      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err: any) {
      setError(err.message || "Connection error.");
      toast.error(err.message || "Connection error.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="user-auth-page">
      {/* Decorative Background Blobs */}
      <div className="user-auth-blob user-auth-blob-1"></div>
      <div className="user-auth-blob user-auth-blob-2"></div>

      <div className="user-auth-wrapper">
        {/* Left Side: Brand Promo Panel */}
        <div className="user-auth-left">
          <div className="user-auth-brand">
            <div className="user-auth-brand-icon">
              <span style={{ fontSize: "20px" }}>🏥</span>
            </div>
            <span className="user-auth-brand-name">Sri Sai Hospital</span>
          </div>
          <h2 className="user-auth-left-title">Secure Recovery</h2>
          <p className="user-auth-left-desc">
            Recover access to your account quickly and securely. Follow the step-by-step instructions to verify your identity and update your password.
          </p>

          <div className="user-auth-features">
            <div className="user-auth-feature-item">
              <span className="user-auth-feature-icon">🔒</span>
              <span>Secure 6-digit OTP Verification</span>
            </div>
            <div className="user-auth-feature-item">
              <span className="user-auth-feature-icon">✉️</span>
              <span>Gmail Delivery Protection</span>
            </div>
            <div className="user-auth-feature-item">
              <span className="user-auth-feature-icon">🛡️</span>
              <span>Encrypted Password Updates</span>
            </div>
          </div>
          
          {/* Custom Recovery Step Indicators */}
          <div className="register-step-indicator" style={{ marginTop: "2.5rem" }}>
            <div className={`register-step ${step >= 1 ? "register-step-active" : ""}`}>
              <div className="register-step-circle">1</div>
              <span>Email</span>
            </div>
            <div className="register-step-line"></div>
            <div className={`register-step ${step >= 2 ? "register-step-active" : ""}`}>
              <div className="register-step-circle">2</div>
              <span>Verify</span>
            </div>
            <div className="register-step-line"></div>
            <div className={`register-step ${step >= 3 ? "register-step-active" : ""}`}>
              <div className="register-step-circle">3</div>
              <span>Reset</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="user-auth-right">
          <div className="user-auth-card">
            {/* Back to Login Link */}
            <div style={{ marginBottom: "1rem" }}>
              <Link to="/login" className="user-auth-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                <FaArrowLeft size={12} /> Back to Sign In
              </Link>
            </div>

            {/* Header */}
            <div className="user-auth-card-header">
              <h2 className="user-auth-card-title">Reset Password</h2>
              <p className="user-auth-card-subtitle">
                {step === 1 && "Enter email to receive security OTP code"}
                {step === 2 && "Enter verification code sent to Gmail"}
                {step === 3 && "Create a secure new password"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="user-auth-error">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="user-auth-success" style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                color: "#16a34a",
                fontSize: "0.875rem",
                marginBottom: "1.25rem",
              }}>
                <FaCheckCircle size={14} />
                <span>{success}</span>
              </div>
            )}

            {/* STEP 1: Email Form */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="user-auth-form">
                <div className="user-auth-field">
                  <label className="user-auth-label">Gmail Address</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <FaEnvelope size={14} />
                    </span>
                    <input
                      type="email"
                      className="user-auth-input"
                      placeholder="e.g. name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="user-auth-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="user-auth-spinner" />
                      <span>Sending OTP Code...</span>
                    </>
                  ) : (
                    <>✉️ Send OTP Code</>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: OTP Verification Form */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="user-auth-form">
                <div className="user-auth-field">
                  <label className="user-auth-label">Enter 6-Digit OTP</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <FaKey size={14} />
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      className="user-auth-input"
                      placeholder="Enter 6-digit OTP code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      required
                      autoComplete="one-time-code"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="user-auth-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="user-auth-spinner" />
                      <span>Verifying OTP Code...</span>
                    </>
                  ) : (
                    <>Verify & Continue ➡️</>
                  )}
                </button>

                <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.85rem" }}>
                  {countdown > 0 ? (
                    <span style={{ color: "#6b7280" }}>
                      Resend code in <strong style={{ color: "#3F58FF" }}>{countdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="user-auth-link"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      disabled={isLoading}
                    >
                      Resend OTP Code
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* STEP 3: Reset Password Form */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="user-auth-form">
                {/* New Password */}
                <div className="user-auth-field">
                  <label className="user-auth-label">New Password</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <FaLock size={14} />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="user-auth-input user-auth-input-padded"
                      placeholder="Enter new secure password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="user-auth-eye-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="password-strength-container">
                    <div className="password-strength-label-wrap">
                      <span className="password-strength-label">Password Strength:</span>
                      <span className="password-strength-value" style={{ color: strengthInfo.color }}>
                        {strengthInfo.text}
                      </span>
                    </div>
                    <div className="password-strength-bar-bg">
                      <div
                        className="password-strength-bar"
                        style={{
                          width: strengthInfo.width,
                          backgroundColor: strengthInfo.color,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                {/* Confirm Password */}
                <div className="user-auth-field" style={{ marginTop: "1rem" }}>
                  <label className="user-auth-label">Confirm Password</label>
                  <div className="user-auth-input-wrap">
                    <span className="user-auth-input-icon">
                      <FaLock size={14} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="user-auth-input user-auth-input-padded"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="user-auth-eye-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div style={{
                      marginTop: "0.4rem",
                      fontSize: "0.8rem",
                      color: checkMatch ? "#16a34a" : "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      {checkMatch ? (
                        <><FaCheck size={10} /> Passwords match</>
                      ) : (
                        <><FaTimes size={10} /> Passwords do not match</>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className="user-auth-btn" disabled={isLoading} style={{ marginTop: "1.25rem" }}>
                  {isLoading ? (
                    <>
                      <span className="user-auth-spinner" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>🔒 Reset Password</>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
