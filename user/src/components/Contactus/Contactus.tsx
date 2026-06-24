import React, { useEffect, useRef, useState } from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiUser,
  FiMessageSquare,
  FiChevronRight,
  FiNavigation,
  FiMap,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi";
import {
  MdLocalHospital,
  MdVerified,
  MdScience,
  MdFavorite,
  MdAccessTime,
  MdHealthAndSafety,
  MdGroups,
  MdMedicalServices,
  MdPersonSearch,
  MdStar,
} from "react-icons/md";
import "./Contactus.css";

/* ── Scroll Reveal Hook ─────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef(null);
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
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

const CONTACT_CARDS = [
  {
    icon: <FiPhone />,
    iconClass: "contact-icon-brand",
    label: "Phone",
    title: "Call Us",
    value: "+91 XXXXX XXXXX",
    secondary: "Mon – Sat, 8 AM – 8 PM",
  },
  {
    icon: <FiAlertCircle />,
    iconClass: "contact-icon-green",
    label: "Emergency",
    title: "24/7 Emergency",
    value: "+91 XXXXX XXXXX",
    secondary: "Always available for urgent care",
  },
  {
    icon: <FiMail />,
    iconClass: "contact-icon-accent",
    label: "Email",
    title: "General Enquiry",
    value: "info@srisaisubramaniyahospital.com",
    secondary: "We reply within 24 hours",
  },
  {
    icon: <FiCalendar />,
    iconClass: "contact-icon-blue",
    label: "Appointments",
    title: "Book via Email",
    value: "appointments@srisaisubramaniyahospital.com",
    secondary: "Preferred for scheduled visits",
  },
  {
    icon: <FiClock />,
    iconClass: "contact-icon-brand",
    label: "Working Hours",
    title: "OPD Timings",
    value: "Monday – Saturday: 8:00 AM – 8:00 PM",
    secondary: "Sunday: Emergency Services Only",
  },
];

const WHY_FEATURES = [
  {
    icon: <MdPersonSearch />,
    title: "Experienced Specialists",
    desc: "Senior consultants with decades of clinical expertise.",
  },
  {
    icon: <MdScience />,
    title: "Advanced Diagnostics",
    desc: "State-of-the-art lab and imaging infrastructure.",
  },
  {
    icon: <MdHealthAndSafety />,
    title: "Personalized Treatment",
    desc: "Care plans tailored to every patient's unique needs.",
  },
  {
    icon: <MdLocalHospital />,
    title: "Modern Infrastructure",
    desc: "Contemporary OT, ICU, and recovery facilities.",
  },
  {
    icon: <MdStar />,
    title: "Affordable Healthcare",
    desc: "Premium care at transparent, fair pricing.",
  },
  {
    icon: <MdFavorite />,
    title: "Compassionate Care",
    desc: "A warm, supportive environment for every visit.",
  },
  {
    icon: <MdMedicalServices />,
    title: "Multi-Speciality Services",
    desc: "All major specialties under one roof.",
  },
  {
    icon: <MdGroups />,
    title: "Patient-Centred Approach",
    desc: "Your comfort and recovery are our top priority.",
  },
];

/* ── Component ──────────────────────────────────────────── */
export default function Contactus() {
  const sectionRef1 = useScrollReveal();
  const sectionRef2 = useScrollReveal();
  const sectionRef3 = useScrollReveal();
  const sectionRef4 = useScrollReveal();
  const sectionRef5 = useScrollReveal();

  return (
    <div className="contact-page">
      {/* ── SECTION 1 · Hero ──────────────────────────────── */}
      <section className="contact-emergency" ref={sectionRef5}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="section-title">
                <div className="contact-hero-eyebrow contact-anim-1">
                  <span /> Srisai Subramaniya Hospital
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
                <a href="tel:+91XXXXXXXXXX" className="contact-btn-emergency">
                  <FiAlertCircle /> Call Emergency
                </a>
                <a href="#contact-appointment" className="contact-btn-consult">
                  <FiCalendar /> Book Consultation
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
              <div className="contact-form-wrap contact-reveal">
                <div className="contact-form-header">
                  <div className="section-title">
                    <h2 className="contact-form-title">
                      Request an Appointment
                    </h2>
                  </div>
                  <div className="contact-form-divider" />
                </div>

                <form>
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
                            id="cf-fullName"
                            name="fullName"
                            placeholder="Subject"
                          />
                          <label htmlFor="cf-fullName">
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
                    <button type="submit" className="contact-btn-submit">
                      <FiCalendar /> Submit Appointment Request
                    </button>
                    <button type="button" className="contact-btn-reset">
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
                  <h6>Address</h6>
                  <p>
                    # 35,36, Masilamaneeswarar Nagar, Thirumullaivoyal,
                    Chennai-600062
                  </p>
                </div>
                <div className="contact-form-tips contact-reveal contact-reveal-delay-3">
                  <h6>Email</h6>
                  <p>srisaisubhramaniyahospitals@gmail.com</p>
                </div>

                <div className="contact-form-tips contact-reveal contact-reveal-delay-3">
                  <h6>Phone</h6>
                  <p>
                    (+91)-44-26378138 , (+91)-44-26367405, (+91)-9840030402 ,
                    (+91)-9444479090
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
              title="Srisai Subramaniya Hospital Location"
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
