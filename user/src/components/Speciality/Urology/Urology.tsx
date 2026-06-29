import React, { useEffect, useRef } from "react";
import "./Urology.css";
import PageBanner from "../../PageBanner/PageBanner";

// ── Placeholder image imports (replace paths as needed) ──
import urologyHeroImg from "../../../assets/speciality/obstetricsandmaternity.png";

import img from "../../../assets/speciality/urology.png";

// ─── Inline SVG Icons ────────────────────────────────────
const IconUTI = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="12"
      cy="10"
      rx="5"
      ry="7"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M12 17v4"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M9 21h6"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M9.5 8.5c.5-1 3-1 3 .5"
      stroke="#D44E54"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconKidney = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 5c-2.5 1.5-3.5 4.5-2.5 7.5S8.5 18 10 18c1 0 2-1 2-2s-1-2-2-2c-1.5 0-2-1-2-2.5S9 9 10.5 9c1.2 0 2 1 2 2"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 5c2.5 1.5 3.5 4.5 2.5 7.5S15.5 18 14 18c-1 0-2-1-2-2s1-2 2-2c1.5 0 2-1 2-2.5S15 9 13.5 9c-1.2 0-2 1-2 2"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconIncontinence = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3c0 0-5 5-5 9a5 5 0 0010 0c0-4-5-9-5-9z"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 13a3 3 0 006 0"
      stroke="#D44E54"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconProstate = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="5" stroke="#D44E54" strokeWidth="1.7" />
    <path
      d="M12 7V5"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M12 19v-2"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M7 12H5"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M19 12h-2"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="#D44E54" opacity="0.25" />
  </svg>
);

const IconBladder = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4C8 4 5 7.5 5 11.5S7.5 19 12 19s7-3 7-7.5S16 4 12 4z"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 10c.5-1 3-1 3.5.5"
      stroke="#D44E54"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 19v2"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const IconMaleHealth = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="14" r="5" stroke="#D44E54" strokeWidth="1.7" />
    <path
      d="M14.5 9.5L19 5"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M16 5h3v3"
      stroke="#D44E54"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Conditions Data ─────────────────────────────────────
const CONDITIONS = [
  { id: 1, name: "Urinary Tract Infections", icon: <IconUTI /> },
  { id: 2, name: "Kidney Stones", icon: <IconKidney /> },
  { id: 3, name: "Urinary Incontinence", icon: <IconIncontinence /> },
  { id: 4, name: "Prostate Disorders", icon: <IconProstate /> },
  { id: 5, name: "Bladder Conditions", icon: <IconBladder /> },
  { id: 6, name: "Male Reproductive Health Issues", icon: <IconMaleHealth /> },
];

// ─── Hook: Scroll Reveal ─────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".Urology-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("Urology-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Component ───────────────────────────────────────────
export default function Urology() {
  useScrollReveal();

  return (
    <>
      <PageBanner title="Urology" />
    <div className="Urology-page">
      {/* ══ HERO ══ */}
      <section className="Urology-hero" aria-label="Urology Hero">
        <img
          src={urologyHeroImg}
          alt="Urology department"
          className="Urology-hero-image"
        />
        <div className="Urology-hero-overlay" aria-hidden="true" />

        <div className="container">
          <div className="row align-items-center">
            {/* Left: text */}
            <div className="col-lg-12">
              <div className="Urology-hero-content">
                <h1 className="Urology-hero-title Urology-reveal Urology-reveal-delay-1">
                  Urology
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="Urology-divider" />

      <section className="section-space">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <div className="Urology-hero-content">
                <div className="section-title">
                  <h2 className="Urology-reveal Urology-reveal-delay-1">
                    Comprehensive Urology<br /> Services
                  </h2>
                  <p className=" Urology-reveal Urology-reveal-delay-2">
                    Diagnosis and treatment of urinary tract and reproductive
                    health conditions.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <img src={img} style={{borderRadius:"15PX"}} alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONDITIONS TREATED ══ */}
      <section
        className=" section-space"
        aria-labelledby="uro-conditions-heading"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2
                  id="uro-conditions-heading"
                  style={{ textAlign: "center" }}
                  className=" Urology-reveal Urology-reveal-delay-1"
                >
                  Conditions Treated
                </h2>
              </div>
            </div>
          </div>

          <div className="Urology-conditions-grid">
            {CONDITIONS.map((cond, i) => (
              <div
                key={cond.id}
                className={`Urology-condition-card Urology-reveal Urology-reveal-delay-${i + 1}`}
              >
                <div className="Urology-condition-icon">{cond.icon}</div>
                <p className="Urology-condition-name mb-0">{cond.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
