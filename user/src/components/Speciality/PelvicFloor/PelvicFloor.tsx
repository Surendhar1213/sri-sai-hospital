import { useEffect, useRef } from "react";
import "./PelvicFloor.css";
import PageBanner from "../../PageBanner/PageBanner";
import img1 from "../../../assets/speciality/pelvic-floor.png";
const conditions = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse
          cx="24"
          cy="28"
          rx="12"
          ry="14"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M18 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M24 28v-8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M20 34c1.2 1.2 6.8 1.2 8 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="34" cy="12" r="5" fill="#D44E54" opacity="0.15" />
        <path
          d="M31 12c.5-1.5 2-2.5 3-2.5"
          stroke="#D44E54"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Urinary Incontinence",
    items: [
      "Leakage While Coughing",
      "Leakage While Laughing",
      "Leakage During Exercise",
      "Stress Urinary Incontinence",
      "Frequent Urination",
    ],
    note: "Improved bladder control and urinary confidence.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 8c-8 0-14 6-14 14 0 5 2.5 9.5 6.5 12l-1.5 6h18l-1.5-6C35.5 31.5 38 27 38 22c0-8-6-14-14-14z"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M18 26c1.5 2 4 3 6 3s4.5-1 6-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21 40h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <circle cx="28" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "Pelvic Floor Weakness",
    items: [],
    note: "Post-delivery and menopause-related muscle weakness.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse
          cx="24"
          cy="26"
          rx="14"
          ry="12"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M16 18c2-6 14-6 16 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 26c0 2.2 1.8 4 4 4s4-1.8 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 8v4"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M12 14l2.5 2.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M36 14l-2.5 2.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Pelvic Organ Support Issues",
    items: [],
    note: "Strengthening muscles that support pelvic organs.",
  },
];

const benefits = [
  { label: "Non-Invasive Treatment", icon: "🛡️" },
  { label: "No Pain", icon: "✨" },
  { label: "No Downtime", icon: "⚡" },
  { label: "Fully Clothed Procedure", icon: "👗" },
  { label: "Improved Bladder Control", icon: "💧" },
  { label: "Stronger Pelvic Muscles", icon: "💪" },
  { label: "Enhanced Quality of Life", icon: "🌸" },
  { label: "Suitable for Women and Men", icon: "🌸" },
];

export default function PelvicFloor() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const observers = revealRefs.current.map((el) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("pf-revealed");
            obs.unobserve(el);
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      <PageBanner title="Pelvic Floor Rehabilitation" />
      <section className="pf-page">
        {/* ── HERO ── */}

        <div className="pf-hero section-space">
          <div className="pf-hero__bg-circles" aria-hidden="true">
            <span className="pf-circle pf-circle--1" />
            <span className="pf-circle pf-circle--2" />
            <span className="pf-circle pf-circle--3" />
          </div>
          <div className="container ">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-5">
                <img
                  className="pf-hero__img"
                  src={img1}
                  alt="Pelvic Floor"
                  ref={addRef}
                />
              </div>
              <div className="col-md-6">
                <div>
                  <h2 className="pf-hero__title" ref={addRef}>
                    Advanced Pelvic Floor
                    <span className="pf-hero__title--accent">
                      Strengthening Therapy
                    </span>
                  </h2>
                  <p className="pf-hero__tagline" ref={addRef}>
                    Regain Control. Restore Confidence.
                  </p>
                </div>
                <p ref={addRef}>
                  Pregnancy, childbirth, menopause, aging, and hormonal changes
                  can weaken pelvic floor muscles, affecting bladder control and
                  overall pelvic health.
                </p>
                <p className="pf-hero__desc">
                  Our advanced non-invasive pelvic floor rehabilitation technology
                  helps strengthen deep pelvic muscles without surgery or
                  downtime.
                </p>
              </div>
            </div>
          </div>
          <div className="pf-hero__wave" aria-hidden="true">
            <svg
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
                fill="var(--pf-bg)"
              />
            </svg>
          </div>
        </div>

        {/* ── CONDITIONS ── */}
        <div id="conditions" className="section-space">
          <div className="container">
            <div className="pf-section-head section-title" ref={addRef}>
              <h2 className="pf-section-head__title">Conditions Treated</h2>
            </div>
            <div className="row g-4 mt-2">
              {conditions.map((c, i) => (
                <div className="col-12 col-md-4" key={i}>
                  <div
                    className="pf-card pf-reveal"
                    ref={addRef}
                    style={{ "--delay": `${i * 0.12}s` } as React.CSSProperties}
                  >
                    <div className="pf-card__icon">{c.icon}</div>
                    <h3 className="pf-card__title">{c.title}</h3>
                    {c.items.length > 0 && (
                      <ul className="pf-card__list">
                        {c.items.map((item, j) => (
                          <li key={j} className="pf-card__list-item">
                            <span className="pf-card__dot" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="pf-card__note">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BENEFITS ── */}
        <section className="section-space">
          <div className="container">
            <div id="benefits" className="pf-benefits">
              <div className="pf-benefits__bg-strip" aria-hidden="true" />
              <div
                className="pf-section-head pf-section-head--light"
                ref={addRef}
              >
                <h2 className="pf-section-head__title">Benefits</h2>
              </div>
              <div className="pf-benefits__grid mt-4">
                {benefits.map((b, i) => (
                  <div
                    className="pf-benefit-pill pf-reveal"
                    key={i}
                    ref={addRef}
                    style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
                  >
                    <span className="pf-benefit-pill__icon">{b.icon}</span>
                    <span className="pf-benefit-pill__label">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        {/* <div className="pf-cta-banner">
        <div className="container">
          <div className="pf-cta-banner__inner pf-reveal" ref={addRef}>
            <div className="pf-cta-banner__text">
              <h3>Ready to Reclaim Your Confidence?</h3>
              <p>
                Book a consultation with our pelvic health specialists today.
              </p>
            </div>
            <a href="#" className="pf-btn pf-btn--white">
              Book Consultation
            </a>
          </div>
        </div>
      </div> */}
      </section>
    </>
  );
}
