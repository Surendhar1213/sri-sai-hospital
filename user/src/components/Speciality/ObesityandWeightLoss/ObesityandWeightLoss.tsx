import { useEffect, useRef } from "react";
import "./ObesityandWeightLoss.css";
import PageBanner from "../../PageBanner/PageBanner";

import img from "../../../assets/speciality/weightloss.png";

const ObesityandWeightLoss = () => {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("owlm-visible");
          }
        });
      },
      { threshold: 0.12 },
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const assessmentItems = [
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="8"
            y="4"
            width="24"
            height="32"
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M14 14h12M14 20h12M14 26h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="28"
            cy="28"
            r="6"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M26 28l1.5 1.5L30 26"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "BMI Evaluation",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="20"
            cy="20"
            r="13"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 7v4M20 29v4M7 20h4M29 20h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="20"
            cy="20"
            r="5"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
      label: "Body Fat Analysis",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 32 L14 20 L20 26 L26 12 L32 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="6"
            y="6"
            width="28"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      label: "Metabolic Assessment",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse
            cx="20"
            cy="16"
            rx="8"
            ry="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 30c0-4.418 3.582-8 8-8s8 3.582 8 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 13c1-2 5-2 6 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: "Hormonal Screening",
    },
  ];

  const medicalPrograms = [
    { label: "Personalized Diet Planning", delay: 0 },
    { label: "Lifestyle Counseling", delay: 80 },
    { label: "Exercise Guidance", delay: 160 },
    { label: "Hormonal Correction", delay: 240 },
    { label: "Obesity Management", delay: 320 },
  ];

  const womenPrograms = [
    { label: "PCOS-Related Weight Gain", icon: "◎" },
    { label: "Postpartum Weight Gain", icon: "◎" },
    { label: "Menopause-Related Weight Changes", icon: "◎" },
    { label: "Fertility-Related Weight Issues", icon: "◎" },
  ];

  const treatmentAreas = [
    "Abdomen",
    "Love Handles",
    "Thighs",
    "Arms",
    "Back Fat",
    "Double Chin",
  ];

  const benefits = [
    "Non-Surgical",
    "No Downtime",
    "No Scars",
    "Comfortable Procedure",
    "Visible Fat Reduction",
    "Improved Body Contours",
  ];

  return (
    <>
      <PageBanner title="Obesity & Weight Loss" />
      <section className="owlm-section">
        {/* ── HERO ── */}
        <div className="owlm-hero">
          <div className="owlm-hero-bg-ring owlm-ring-1" />
          <div className="owlm-hero-bg-ring owlm-ring-2" />
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <img src={img} style={{ borderRadius: "10px" }} alt="" />
              </div>
              <div className="col-md-6">
                <div className="owlm-hero-inner">
                  <div className="section-title">
                    <span className="owlm-eyebrow">
                      Medical Weight Loss &amp; Body Contouring Centre
                    </span>
                    <h2 className="owlm-hero-title">
                      Transform Your Health Through
                      Sustainable Weight Management
                    </h2>
                    <p className="owlm-hero-desc">
                      Excess weight affects hormonal health, fertility, diabetes
                      risk, cardiovascular wellness, and self-confidence. Our
                      medically supervised weight management programs focus on
                      long-term success through personalized treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SERVICES HEADING ── */}
        <div className="container">
          <div className="owlm-section-head section-title" ref={addRef}>
            <h2 className="owlm-section-title">Our Weight Management Services</h2>
          </div>

          {/* ── ASSESSMENT ── */}
          <div className="owlm-reveal" ref={addRef}>
            <div className="owlm-block-label">
              Comprehensive Weight Assessment
            </div>
            <div className="row g-3 owlm-assess-row">
              {assessmentItems.map((item, i) => (
                <div className="col-6 col-md-3" key={i}>
                  <div className="owlm-assess-card">
                    <div className="owlm-assess-icon">{item.icon}</div>
                    <span className="owlm-assess-label">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── MEDICAL PROGRAMS ── */}
          <div className="owlm-reveal owlm-reveal-delay" ref={addRef}>
            <div className="row g-0 align-items-stretch owlm-medical-row">
              <div className="col-lg-4 owlm-medical-left">
                <div className="owlm-medical-label-wrap">
                  <div className="owlm-block-label owlm-block-label--light" style={{ color: "#fff" }}>
                    Medical Weight Loss Programs
                  </div>
                </div>
              </div>
              <div className="col-lg-8 owlm-medical-right">
                <div className="owlm-medical-list">
                  {medicalPrograms.map((p, i) => (
                    <div
                      className="owlm-medical-item"
                      key={i}
                      style={{ "--delay": `${p.delay}ms` }}
                    >
                      <span className="owlm-medical-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="owlm-medical-text">{p.label}</span>
                      <svg
                        className="owlm-medical-arrow"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M4 10h12M11 5l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── WOMEN'S PROGRAMS ── */}
          <div className="owlm-reveal" ref={addRef}>
            <div className="owlm-block-label">
              Women's Weight Management Programs
            </div>
            <div className="owlm-women-grid">
              <div className="owlm-women-intro">
                <p>
                  Specialized care:
                </p>
              </div>
              <div className="row g-3">
                {womenPrograms.map((w, i) => (
                  <div className="col-sm-6" key={i}>
                    <div className="owlm-women-card">
                      <div className="owlm-women-dot" />
                      <span>{w.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CRYOLIPOLYSIS ── */}
        <div className="owlm-cryo-section section-space">
          <div className="owlm-cryo-bg-accent" />
          <div className="container">
            <div className="owlm-reveal" ref={addRef}>
              <div className="owlm-cryo-eyebrow">
                Advanced Non-Surgical Fat Reduction
              </div>
              <h2 className="owlm-cryo-title">
                Cryolipolysis <span>(Fat Freezing)</span>
              </h2>
              <p className="owlm-cryo-desc">
                Cryolipolysis is an innovative body contouring procedure that uses
                controlled cooling technology to target and reduce stubborn fat
                deposits.
              </p>

              <div className="row g-4 owlm-cryo-cards-row">
                {/* Treatment Areas */}
                <div className="col-lg-6">
                  <div className="owlm-cryo-card">
                    <div className="owlm-cryo-card-head">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Treatment Areas
                    </div>
                    <div className="owlm-cryo-areas">
                      {treatmentAreas.map((area, i) => (
                        <div className="owlm-cryo-area-chip" key={i}>
                          {area}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="col-lg-6">
                  <div className="owlm-cryo-card owlm-cryo-card--benefits">
                    <div className="owlm-cryo-card-head">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 12l2 2 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      Benefits
                    </div>
                    <ul className="owlm-benefits-list">
                      {benefits.map((b, i) => (
                        <li key={i} className="owlm-benefit-item">
                          <svg
                            className="owlm-check"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <circle
                              cx="8"
                              cy="8"
                              r="7"
                              fill="currentColor"
                              fillOpacity="0.15"
                            />
                            <path
                              d="M5 8l2 2 4-4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ObesityandWeightLoss;
