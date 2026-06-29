import React, { useEffect, useRef } from "react";
import "./Endocrinology.css";
import PageBanner from "../../PageBanner/PageBanner";
import img1 from "../../../assets/speciality/endocrinology.webp";

const Endocrinology = () => {
  const sectionRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("endo-visible");
            obs.unobserve(entry.target);
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const conditionGroups = [
    {
      id: "thyroid",
      label: "Thyroid Disorders",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse
            cx="24"
            cy="26"
            rx="14"
            ry="10"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
          />
          <path
            d="M16 20 Q24 10 32 20"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="24" cy="14" r="3" fill="currentColor" opacity="0.35" />
          <line
            x1="24"
            y1="17"
            x2="24"
            y2="20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      items: [
        "Hypothyroidism",
        "Hyperthyroidism",
        "Thyroid Nodules",
        "Thyroid Disorders During Pregnancy",
      ],
    },
    {
      id: "female",
      label: "Female Hormonal Disorders",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="24"
            cy="20"
            r="11"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
          />
          <line
            x1="24"
            y1="31"
            x2="24"
            y2="42"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="37"
            x2="30"
            y2="37"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M18 20 Q24 13 30 20"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      ),
      items: [
        "PCOS / PCOD",
        "Menstrual Irregularities",
        "Fertility-Related Hormonal Imbalances",
        "Menopause Management",
      ],
    },
    {
      id: "metabolic",
      label: "Metabolic Disorders",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 34 Q18 14 24 24 Q30 34 38 14"
            stroke="currentColor"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="24" r="3.5" fill="currentColor" opacity="0.4" />
          <circle cx="10" cy="34" r="2.5" fill="currentColor" opacity="0.6" />
          <circle cx="38" cy="14" r="2.5" fill="currentColor" opacity="0.6" />
        </svg>
      ),
      items: ["Insulin Resistance", "Metabolic Syndrome", "Prediabetes"],
    },
    {
      id: "endocrine",
      label: "Endocrine Disorders",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="24"
            cy="24"
            r="13"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
          />
          <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.3" />
          <line
            x1="24"
            y1="11"
            x2="24"
            y2="7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="41"
            x2="24"
            y2="37"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="11"
            y1="24"
            x2="7"
            y2="24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="41"
            y1="24"
            x2="37"
            y2="24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      items: [
        "Adrenal Disorders",
        "Pituitary Disorders",
        "Hormonal Imbalances",
      ],
    },
  ];

  return (
    <>
      <PageBanner title="Endocrinology" />
    <section className="endo-page">
      {/* ── HERO ── */}
      <div className="endo-hero">
        <div className="endo-hero__ambient" aria-hidden="true">
          <span className="endo-orb endo-orb--1" />
          <span className="endo-orb endo-orb--2" />
          <span className="endo-orb endo-orb--3" />
        </div>

        <div className="container position-relative">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-5">
              <img src={img1} style={{ borderRadius: "10px" }} alt="" />
            </div>

            <div className="col-lg-6">
              <div className="section-title">
                <h2 className="endo-hero__title" ref={addRef}>
                  Restoring Hormonal Balance for Better Health
                </h2>
              </div>
              <p className="endo-hero__lead" ref={addRef}>
                Hormones influence fertility, metabolism, weight, energy levels,
                reproductive health, and overall wellness. Our endocrinology
                specialists provide comprehensive diagnosis and management of
                endocrine disorders.
              </p>
            </div>
          </div>
        </div>

        <div className="endo-hero__wave" aria-hidden="true">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="var(--endo-bg)"
            />
          </svg>
        </div>
      </div>

      {/* ── CONDITIONS ── */}
      <div className="endo-conditions section-space">
        <div className="container">
          <div className="endo-section-header section-title text-center" ref={addRef}>
            <h2 className="endo-section-title">Conditions Treated</h2>
          </div>

          <div className="row g-4 mt-2">
            {conditionGroups.map((group, i) => (
              <div className="col-lg-6" key={group.id}>
                <div
                  className="endo-card endo-reveal"
                  ref={addRef}
                  style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
                >
                  <div className="endo-card__header">
                    <div className="endo-card__icon">{group.icon}</div>
                    <h3 className="endo-card__title">{group.label}</h3>
                  </div>
                  <ul className="endo-card__list">
                    {group.items.map((item) => (
                      <li key={item} className="endo-card__item">
                        <span className="endo-card__dot" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>     
    </>
  );
};

export default Endocrinology;
