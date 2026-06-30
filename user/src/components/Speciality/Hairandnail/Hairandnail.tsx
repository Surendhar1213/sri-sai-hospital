import { useEffect, useRef } from "react";
import "./Hairandnail.css";
import PageBanner from "../../PageBanner/PageBanner";

import img from "../../../assets/speciality/hairandnail.png";

/* Scroll-reveal hook */
function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("hairandnail-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* Icon SVGs */
const IconHair = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1zM10 18h4v1c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-1z" />
  </svg>
);
const IconScalp = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20a4 4 0 0 0 4-4 4 4 0 0 1 4-4 4 4 0 0 0 4-4c0-.95-.32-1.82-.84-2.5A6.95 6.95 0 0 1 17 8z" />
  </svg>
);
const IconNail = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 2.5c0 1.5-1.5 9-1.5 9h-2C10.5 11.5 9 4 9 2.5a2.5 2.5 0 0 1 5 0zM12 13c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2v-5c0-1.1-.9-2-2-2z" />
  </svg>
);
const IconAssess = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
  </svg>
);

const HairandNail = () => {
  // Refs for scroll reveal sections
  const r2 = useScrollReveal<HTMLDivElement>();
  const r3 = useScrollReveal<HTMLDivElement>();
  const r4 = useScrollReveal<HTMLDivElement>();
  const r5 = useScrollReveal<HTMLDivElement>();
  const r6 = useScrollReveal<HTMLDivElement>();
  const r7 = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <PageBanner title="Hair & Nail Clinic" />
      <div className="hairandnail-page">
        {/* ── HERO ── */}
        <section className="hairandnail-hero section-space">
          <div className="hairandnail-hero-overlay" />

          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="hairandnail-hero-content hairandnail-reveal hairandnail-visible">
                  <div className="section-title">
                    <h2 className="hairandnail-hero-title">
                      Specialized Hair &amp; Nail Care Centre
                    </h2>
                    <h4 style={{ marginTop: "10px" }}>
                      Comprehensive Diagnosis & Treatment
                    </h4>
                    <p className="hairandnail-hero-subtitle">
                      Healthy hair and nails are important indicators of overall
                      health. Our specialists provide expert care for various hair
                      and nail conditions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <img src={img} style={{ borderRadius: "10px" }} alt="" />
              </div>
            </div>
          </div>
        </section>

        {/* ── HAIR CLINIC SERVICES ── */}
        <section className="hairandnail-section section-space">
          <div className="container">
            {/* Section Header */}
            <div className="row">
              <div className="col-md-12 hairandnail-reveal" ref={r2}>
                <div className="section-title">
                  <h2 className="hairandnail-section-title">
                    Hair Clinic Services
                  </h2>
                </div>
                {/* <div className="hairandnail-section-divider" /> */}
              </div>
            </div>

            {/* Cards Row */}
            <div className="row g-4">
              {/* Hair Loss Treatment */}
              <div
                className="col-md-6 col-lg-4 hairandnail-reveal hairandnail-reveal-delay-1"
                ref={r3}
              >
                <div className="hairandnail-card">
                  <div className="hairandnail-card-img-wrap">
                    {/* <img src={hairLossImg} alt="Hair Loss Treatment" /> */}
                    <div className="hairandnail-card-icon">
                      <IconHair />
                    </div>
                  </div>
                  <div className="hairandnail-card-body">
                    <div className="hairandnail-card-subtitle">
                      Hair Loss Treatment
                    </div>
                    <h3 className="hairandnail-card-title">Management of:</h3>
                    <ul className="hairandnail-list">
                      {[
                        "Male Pattern Baldness",
                        "Female Pattern Hair Loss",
                        "Postpartum Hair Fall",
                        "Stress-Related Hair Loss",
                      ].map((item) => (
                        <li key={item}>
                          <span className="hairandnail-list-dot" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Scalp Treatments */}
              <div
                className="col-md-6 col-lg-4 hairandnail-reveal hairandnail-reveal-delay-2"
                ref={r4}
              >
                <div className="hairandnail-card">
                  <div className="hairandnail-card-img-wrap">
                    {/* <img src={scalpImg} alt="Scalp Treatments" /> */}
                    <div className="hairandnail-card-icon">
                      <IconScalp />
                    </div>
                  </div>
                  <div className="hairandnail-card-body">
                    <div className="hairandnail-card-subtitle">
                      Scalp Treatments
                    </div>
                    <h3 className="hairandnail-card-title">Treatment for:</h3>
                    <ul className="hairandnail-list">
                      {[
                        "Dandruff",
                        "Scalp Infections",
                        "Scalp Psoriasis",
                        "Itchy Scalp Conditions",
                      ].map((item) => (
                        <li key={item}>
                          <span className="hairandnail-list-dot" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Hair Growth Programs */}
              <div
                className="col-md-12 col-lg-4 hairandnail-reveal hairandnail-reveal-delay-3"
                ref={r5}
              >
                <div className="hairandnail-program-card">
                  <div className="hairandnail-program-label">
                    Hair Growth Programs
                  </div>
                  <h3 className="hairandnail-program-title">
                    Hair Growth Programs
                  </h3>
                  <p className="hairandnail-program-desc">
                    Customized treatment plans designed to improve scalp health
                    and support healthy hair growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="hairandnail-hr" />

        {/* ── NAIL CLINIC SERVICES ── */}
        <section className="hairandnail-section hairandnail-section-alt">
          <div className="container">
            {/* Section Header */}
            <div className="row mb-5">
              <div className="col-lg-5 hairandnail-reveal" ref={r6}>
                <h2 className="hairandnail-section-title">
                  Nail Clinic Services
                </h2>
                <div className="hairandnail-section-divider" />
              </div>
            </div>

            {/* Nail Cards */}
            <div className="row g-4" ref={r7}>
              {/* Nail Disorders */}
              <div className="col-md-6">
                <div className="hairandnail-disorder-card">
                  <div className="hairandnail-disorder-icon">
                    <IconNail />
                  </div>
                  <div className="hairandnail-disorder-sub">Nail Disorders</div>
                  <h3 className="hairandnail-disorder-title">Treatment for:</h3>
                  <ul className="hairandnail-list">
                    {[
                      "Nail Fungus",
                      "Brittle Nails",
                      "Nail Discoloration",
                      "Nail Deformities",
                      "Ingrown Nails",
                    ].map((item) => (
                      <li key={item}>
                        <span className="hairandnail-list-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nail Health Assessment */}
              <div className="col-md-6 hairandnail-reveal hairandnail-reveal-delay-2">
                <div className="hairandnail-assess-card">
                  <div className="hairandnail-disorder-icon">
                    <IconAssess />
                  </div>
                  <div className="hairandnail-disorder-sub">
                    Nail Health Assessment
                  </div>
                  <h3 className="hairandnail-assess-title">
                    Nail Health Assessment
                  </h3>
                  <p className="hairandnail-assess-desc">
                    Evaluation of nutritional, hormonal, and dermatological
                    factors affecting nail health.
                  </p>
                  <div className="hairandnail-assess-factors">
                    <span className="hairandnail-factor-pill">Nutritional</span>
                    <span className="hairandnail-factor-pill">Hormonal</span>
                    <span className="hairandnail-factor-pill">
                      Dermatological
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HairandNail;
