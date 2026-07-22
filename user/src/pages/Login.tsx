import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  Shield,
  LogIn
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  // Standard password login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Gmail validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid Gmail address (ending in @gmail.com)");
      toast.warning("Please enter a valid Gmail address.");
      return;
    }

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

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      toast.success("🎉 Welcome back! Login successful.");
      navigate(from);
      window.dispatchEvent(new Event("storage"));

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
      <div className="user-auth-wrapper">
        {/* Left Side: Brand Promo Panel */}
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
          <h2 className="user-auth-left-title">Welcome Back!</h2>
          <div className="user-auth-title-line" />
          <p className="user-auth-left-desc">
            Sign in to your patient account to book appointments, consult with our top medical professionals, and view your prescription details.
          </p>

          <div className="user-auth-features">
            <div className="user-auth-feature-item">
              <div className="user-auth-feature-icon-circle">
                <Calendar size={18} />
              </div>
              <div className="user-auth-feature-content">
                <span className="user-auth-feature-title">Manage Appointments Easily</span>
                <span className="user-auth-feature-sub">Book, reschedule & view appointments</span>
              </div>
            </div>
            <div className="user-auth-feature-item">
              <div className="user-auth-feature-icon-circle">
                <FileText size={18} />
              </div>
              <div className="user-auth-feature-content">
                <span className="user-auth-feature-title">Track Your Medical Records</span>
                <span className="user-auth-feature-sub">Access your history & reports anytime</span>
              </div>
            </div>
            <div className="user-auth-feature-item">
              <div className="user-auth-feature-icon-circle">
                <Shield size={18} />
              </div>
              <div className="user-auth-feature-content">
                <span className="user-auth-feature-title">Secure & Confidential</span>
                <span className="user-auth-feature-sub">Your data is safe with us</span>
              </div>
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
          <div className="user-auth-card">
            {/* Header */}
            <div className="user-auth-header-container">
              <div className="user-auth-header-icon-box">
                <User size={26} />
              </div>
              <div className="user-auth-header-text">
                <h2 className="user-auth-header-title">
                  Patient <span>Portal</span>
                </h2>
                <p className="user-auth-header-subtitle">Sign in to access your dashboard</p>
              </div>
            </div>

            {/* Shield divider */}
            <div className="user-auth-center-divider">
              <div className="user-auth-center-line" />
              <div className="user-auth-center-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V16M8 12H16" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
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
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="user-auth-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="user-auth-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label className="user-auth-label" style={{ marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" className="user-auth-link" style={{ fontSize: "0.82rem" }}>
                    Forgot Password?
                  </Link>
                </div>
                <div className="user-auth-input-wrap">
                  <span className="user-auth-input-icon">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="user-auth-input user-auth-input-padded"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={!email}
                  />
                  <button
                    type="button"
                    className="user-auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!email}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  <>
                    <LogIn size={18} /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Register Switch Link */}
            <p className="user-auth-switch" style={{ marginTop: "2rem" }}>
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