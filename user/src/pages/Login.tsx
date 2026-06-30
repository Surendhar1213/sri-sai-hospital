
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Token + user info localStorage-ல save பண்ணு
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      // Redirect to original page
      navigate(from);

      // Trigger standard storage event to let Navbar update immediately
      window.dispatchEvent(new Event("storage"));

    } catch (err: any) {
      setError(err.message || "Connection error. Please try again.");
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
          <h2 className="user-auth-left-title">Welcome Back!</h2>
          <p className="user-auth-left-desc">
            Sign in to your patient account to book appointments, consult with our top medical professionals, and view your prescription details.
          </p>

          <div className="user-auth-features">
            <div className="user-auth-feature-item">
              <span className="user-auth-feature-icon">📅</span>
              <span>Manage Appointments Easily</span>
            </div>
            <div className="user-auth-feature-item">
              <span className="user-auth-feature-icon">🩺</span>
              <span>Track Your Medical Records</span>
            </div>
            <div className="user-auth-feature-item">
              <span className="user-auth-feature-icon">🔒</span>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="user-auth-right">
          <div className="user-auth-card">
            {/* Header */}
            <div className="user-auth-card-header">
              <h2 className="user-auth-card-title">Patient Portal</h2>
              <p className="user-auth-card-subtitle">Sign in to access your dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="user-auth-error">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="user-auth-form">
              {/* Email Address */}
              <div className="user-auth-field">
                <label className="user-auth-label">Email Address</label>
                <div className="user-auth-input-wrap">
                  <span className="user-auth-input-icon">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email"
                    className="user-auth-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="user-auth-field">
                <label className="user-auth-label">Password</label>
                <div className="user-auth-input-wrap">
                  <span className="user-auth-input-icon">
                    <FaLock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="user-auth-input user-auth-input-padded"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="user-auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="user-auth-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="user-auth-spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>🔐 Sign In</>
                )}
              </button>
            </form>

            {/* Register Switch Link */}
            <p className="user-auth-switch">
              New patient?{" "}
              <Link to="/register" state={{ from }} className="user-auth-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;