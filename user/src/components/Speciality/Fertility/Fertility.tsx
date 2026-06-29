import React, { useEffect, useRef } from "react";
import "./Fertility.css";
import PageBanner from "../../PageBanner/PageBanner";

import img from "../../../assets/speciality/fertility/main.png";

import img1 from "../../../assets/speciality/fertility/1.png";
import img2 from "../../../assets/speciality/fertility/2.png";
import img3 from "../../../assets/speciality/fertility/3.png";
import img4 from "../../../assets/speciality/fertility/4.png";
import img5 from "../../../assets/speciality/fertility/5.png";

/* ---------- Inline icon set (stroke-based, single weight, no external deps) ---------- */
const Icon = ({ path, viewBox = "0 0 24 24" }) => (
  <svg
    className="fertility-icon"
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {path}
  </svg>
);

const icons = {
  ovulation: (
    <>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.6 6.4l-1.5 1.5M7.9 16.1l-1.5 1.5M17.6 17.6l-1.5-1.5M7.9 7.9 6.4 6.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  hormonal: (
    <path
      d="M2.5 13h3.6l2-5.5 3 11 2.6-9 1.8 3.5h5.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  pcos: (
    <>
      <path
        d="M12 20.5S4 15.2 4 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.4c0 5.8-8 11.1-8 11.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </>
  ),
  uterine: (
    <path
      d="M9 4.5c0 3-1.6 4-3.4 5.6C3.8 11.7 3 13.6 3 15.5 3 18.5 5.5 20.5 8 19c1.4-.8 2.3-2.5 4-2.5s2.6 1.7 4 2.5c2.5 1.5 5-.5 5-3.5 0-1.9-.8-3.8-2.6-5.4C16.6 8.5 15 7.5 15 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  tubal: (
    <path
      d="M4 7c3 0 4 2 4 4.5S6.5 16 5 16M20 7c-3 0-4 2-4 4.5s1.5 4.5 3 4.5M8 7h8M8 16h8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  semen: (
    <path
      d="M12 3 7 11.5a5 5 0 1 0 10 0L12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  testing: (
    <path
      d="M9 3h6M10 3v6.2L4.8 17a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3M8 14h8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  reproductive: (
    <path
      d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  induction: (
    <path
      d="M18.5 5.5 21 8M16 8l5-5M5 19l4-4M3 21l2.5-2.5M9.5 9.5 16 16M7 11l6 6 1.8-1.8a3.3 3.3 0 0 0 0-4.7l-2.3-2.3a3.3 3.3 0 0 0-4.7 0L7 11Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  monitoring: (
    <path
      d="M3 12h3.5l2-6 3 12 2.5-9 1.5 3h5.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  counseling: (
    <path
      d="M12 20.2s-7.2-4.3-7.2-9.7a4.3 4.3 0 0 1 7.2-3.2 4.3 4.3 0 0 1 7.2 3.2c0 5.4-7.2 9.7-7.2 9.7Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  lifestyle: (
    <path
      d="M12 21c5-1.4 8-5.4 8-10.3C20 6.5 16.6 4 12 3 7.4 4 4 6.5 4 10.7 4 15.6 7 19.6 12 21Z M12 21V11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  preconception: (
    <path
      d="M4 6h16M4 6v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6M8 3v4M16 3v4M9 14l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

/* ---------- Data ---------- */
const femaleServices = [
  { key: "ovulation", label: "Ovulation Assessment" },
  { key: "hormonal", label: "Hormonal Evaluation" },
  { key: "pcos", label: "PCOS Management" },
  { key: "uterine", label: "Uterine Assessment" },
  { key: "tubal", label: "Tubal Evaluation" },
];

const maleServices = [
  { key: "semen", label: "Semen Analysis" },
  { key: "testing", label: "Hormonal Testing" },
  { key: "reproductive", label: "Reproductive Health Assessment" },
];

const treatments = [
  {
    key: "induction",
    label: "Ovulation Induction",
    image: img1,
    text: "Medically guided stimulation timed to your natural cycle.",
  },
  {
    key: "monitoring",
    label: "Follicular Monitoring",
    image: img2,
    text: "Close tracking of follicle growth to identify the optimal window.",
  },
  {
    key: "counseling",
    label: "Fertility Counseling",
    image: img3,
    text: "Honest guidance and emotional support at every step.",
  },
  {
    key: "lifestyle",
    label: "Lifestyle Optimization",
    image: img4,
    text: "Practical changes in nutrition, weight, and habits that support conception.",
  },
  {
    key: "preconception",
    label: "Preconception Planning",
    image: img5,
    text: "A complete health check before you start trying.",
  },
];

/* ---------- Component ---------- */
const Fertility = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const elements = rootRef.current.querySelectorAll(".fertility-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(
              () => entry.target.classList.add("fertility-revealed"),
              delay,
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PageBanner title="Infertility & Fertility" />
      <section className="fertility-section" ref={rootRef}>
        <div className="container">
          {/* Hero */}
          <div className="fertility-hero-divider section-space">
            <div className="row justify-content-center align-items-center">
              <div className="col-md-5">
                <img src={img} alt="" style={{ borderRadius: "10px" }} />
              </div>
              <div className="col-md-6">
                <div className="fertility-hero fertility-reveal">
                  <div className="section-title">
                    <h2 className="fertility-hero-title ">
                      Helping You <em>Build</em> Your Family
                    </h2>
                  </div>
                  <p className="fertility-hero-text">
                    Infertility affects many couples and can result from various
                    medical conditions affecting either partner. Our fertility
                    specialists provide personalized evaluation and treatment
                    plans to maximize the chances of conception.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Partner journey: female + male, side by side */}
          <div className="fertility-partner-grid section-space">
            <article
              className="fertility-partner-card fertility-partner-card--female fertility-reveal"
              data-delay="0"
            >
              <span className="fertility-partner-tag">For Her</span>
              <h2 className="fertility-partner-title">
                Female Fertility Services
              </h2>
              <ul className="fertility-service-list">
                {femaleServices.map((item, i) => (
                  <li
                    className="fertility-service-item fertility-reveal"
                    data-delay={120 + i * 70}
                    key={item.key}
                  >
                    <Icon path={icons[item.key]} />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>

            <div
              className="fertility-divider fertility-reveal"
              data-delay="150"
              aria-hidden="true"
            >
              <span className="fertility-divider-line" />
              <span className="fertility-divider-mark">&amp;</span>
              <span className="fertility-divider-line" />
            </div>

            <article
              className="fertility-partner-card fertility-partner-card--male fertility-reveal"
              data-delay="100"
            >
              <span className="fertility-partner-tag">For Him</span>
              <h2 className="fertility-partner-title">
                Male Fertility Evaluation
              </h2>
              <ul className="fertility-service-list">
                {maleServices.map((item, i) => (
                  <li
                    className="fertility-service-item fertility-reveal"
                    data-delay={220 + i * 70}
                    key={item.key}
                  >
                    <Icon path={icons[item.key]} />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Treatments: the converged, shared path forward */}
          <div className="fertility-treatments section-space">
            <div className="section-title  text-center">
              <h2>Fertility Treatments</h2>
            </div>

            <div className="fertility-treatment-grid">
              {treatments.map((item, i) => (
                <div
                  className="fertility-treatment-card fertility-reveal"
                  data-delay={i * 90}
                  key={item.key}
                >
                  <div className="fertility-treatment-image">
                    <img src={item.image} alt="" />
                  </div>
                  <h3 className="fertility-treatment-title">{item.label}</h3>
                  {/* <p className="fertility-treatment-text">{item.text}</p> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Fertility;
