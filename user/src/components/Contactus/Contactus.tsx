import { useEffect, useRef, useState } from "react";
import {
  FiPhone,
  FiMail,
  FiCalendar,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "./Contactus.css";
import PageBanner from "../PageBanner/PageBanner";

/* ── Scroll Reveal Hook ─────────────────────────────────── */
function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".contact-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("contact-visible");
          }
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((t: Element) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Component ──────────────────────────────────────────── */
export default function Contactus() {
  const sectionRef1 = useScrollReveal<HTMLElement>();
  const sectionRef5 = useScrollReveal<HTMLElement>();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.warning("Please enter your Full Name.");
      return;
    }
    if (!formData.mobile.trim()) {
      toast.warning("Please enter your Mobile Number.");
      return;
    }
    if (!formData.email.trim()) {
      toast.warning("Please enter your Email Address.");
      return;
    }
    if (!formData.message.trim()) {
      toast.warning("Please enter your Message or Health Concern.");
      return;
    }

    setLoading(true);
    try {
      const rawBackendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const backendUrl = rawBackendUrl.replace(/\/+$/, "");
      const res = await fetch(`${backendUrl}/api/user/contact-enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error(
          "Backend API server endpoint not ready (404). Please restart Node.js app in cPanel.",
        );
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to send enquiry");
      }

      toast.success("Thank you! Your enquiry has been sent successfully.");
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      toast.error(
        err.message || "Error sending enquiry. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      <PageBanner title="Contact Us" />
      {/* ── SECTION 1 · Hero ──────────────────────────────── */}
      <section className="contact-emergency" ref={sectionRef5}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="section-title">
                <div className="contact-hero-eyebrow contact-anim-1">
                  <span /> Srisai Subhramaniya Hospitals
                </div>
                <h2 className="contact-hero-title contact-anim-2">
                  Book Your Appointment
                </h2>
                <p className="contact-hero-subtitle contact-anim-3">
                  Your health journey starts here
                </p>
              </div>
              <div className="contact-hero-divider contact-anim-3" />
              <p className="contact-hero-specialties contact-anim-4">
                Women's
                Health&nbsp;•&nbsp;Fertility&nbsp;•&nbsp;Endocrinology&nbsp;•&nbsp;Obesity
                Management&nbsp;•&nbsp;Diabetes Care
                <br />
                Dermatology&nbsp;•&nbsp;Cosmetology&nbsp;•&nbsp;Hair &amp; Nail
                Clinic
              </p>

              <p className="contact-emergency-desc contact-reveal contact-reveal-delay-2">
                Our specialists are committed to helping you achieve better
                health, confidence, and wellness through advanced medical care
                and personalized treatment solutions. Call today to schedule
                your consultation and take the first step toward better health.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="contact-emergency-actions contact-reveal contact-reveal-delay-3">
                {/* <a href="tel:+91XXXXXXXXXX" className="contact-btn-emergency">
                  <FiAlertCircle /> Call Emergency
                </a> */}
                <a href="#contact-appointment" className="contact-btn-consult">
                  <FiCalendar /> Book Appoitment
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 · Appointment Form ──────────────────── */}
      <section
        id="contact-appointment"
        className="contact-section contact-section-white section-space"
        ref={sectionRef1}
      >
        <div className="container">
          <div className="row g-5 align-items-start">
            {/* Form */}
            <div className="col-lg-8">
              <div className="contact-form-wrap contact-reveal" style={{ position: "relative" }}>
                <style>{`
                  @keyframes contactSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>

                {/* 🔄 Spinning Loader Screen Overlay when submitting */}
                {loading && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(6px)",
                      zIndex: 20,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "24px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        border: "5px solid #EEF2FF",
                        borderTop: "5px solid #4A65FF",
                        borderRadius: "50%",
                        animation: "contactSpin 0.8s linear infinite",
                        marginBottom: "16px",
                      }}
                    />
                    <h5
                      style={{
                        fontSize: "18px",
                        fontWeight: "750",
                        color: "#060F2D",
                        margin: 0,
                      }}
                    >
                      Sending Your Enquiry...
                    </h5>
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "#64748B",
                        marginTop: "6px",
                        fontWeight: "500",
                      }}
                    >
                      Please wait a moment while we process your request.
                    </p>
                  </div>
                )}

                <div className="contact-form-header">
                  <div className="section-title">
                    <h2 className="contact-form-title">
                      {/* Request an Appointment */}
                      Contact & Medical Enquiry
                    </h2>
                  </div>
                  <div className="contact-form-divider" />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="contact-float-group">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="cf-fullName"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="cf-fullName">
                            <FiUser style={{ marginRight: 6 }} />
                            Full Name
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="contact-float-group">
                        <div className="form-floating">
                          <input
                            type="tel"
                            className="form-control"
                            id="cf-mobile"
                            name="mobile"
                            placeholder="Mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="cf-mobile">
                            <FiPhone style={{ marginRight: 6 }} />
                            Mobile Number
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="contact-float-group">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control"
                            id="cf-email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="cf-email">
                            <FiMail style={{ marginRight: 6 }} />
                            Email Address
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="contact-float-group">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="cf-subject"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                          />
                          <label htmlFor="cf-subject">
                            <FiUser style={{ marginRight: 6 }} />
                            Subject
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="contact-float-group">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            id="cf-message"
                            name="message"
                            placeholder="Message"
                            style={{ height: "110px" }}
                            value={formData.message}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="cf-message">
                            <FiMessageSquare style={{ marginRight: 6 }} />
                            Message / Health Concern
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="contact-form-actions">
                    <button
                      type="submit"
                      className="contact-btn-submit"
                      disabled={loading}
                    >
                      <FiCalendar /> Submit Enquiry
                    </button>
                    <button
                      type="button"
                      className="contact-btn-reset"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="contact-form-sidebar">
                <div className="contact-form-tips contact-reveal contact-reveal-delay-3">
                  <h6>Chennai </h6>
                  <p>
                    # 35,36, Masilamaneeswarar Nagar, Thirumullaivoyal,
                    Chennai-600062
                  </p>
                </div>
                <div className="contact-form-tips contact-reveal contact-reveal-delay-3">
                  <h6>Coimbatore </h6>
                  <p>
                    Srisai Subhramaniya Hospitals,
                    <br />
                    43, P & T Colony, Ganapathy, Coimbatore - 641006
                  </p>
                </div>
                <div className="contact-form-tips contact-reveal contact-reveal-delay-3">
                  <h6>Email</h6>
                  <p>srisaisubhramaniyahospitals@gmail.com</p>
                </div>

                <div className="contact-form-tips contact-reveal contact-reveal-delay-3">
                  <h6>Phone</h6>
                  <p>
                    <strong>Chennai:</strong>
                    <br />
                    (+91)-44-26378138, (+91)-44-26367405, (+91)-9840030402,
                    (+91)-9444479090
                    <br />
                    <strong style={{ display: "inline-block", marginTop: "8px" }}>
                      Coimbatore:
                    </strong>
                    <br />
                    (+91)-9952424135
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 · Map ───────────────────────────────── */}
      <section className="contact-map-section section-space">
        <div className="container">
          <div className="contact-map-wrap">
            <iframe
              title="Srisai Subhramaniya Hospital Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.376948740821!2d80.1308094101588!3d13.138606611142404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5262e7cab5395f%3A0x9a5529709b71de32!2sSriSai%20Subhramaniya%20Hospital!5e0!3m2!1sen!2sin!4v1782211297729!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}
