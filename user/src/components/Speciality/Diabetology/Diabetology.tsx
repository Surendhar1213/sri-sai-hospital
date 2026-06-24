import React, { useEffect, useRef, useState } from "react";
import "./Diabetology.css";

import img from "../../../assets/speciality/obstetricsandmaternity.png";

const diabetesServices = [
  {
    title: "Type 1 Diabetes",
    description: "Comprehensive diagnosis and treatment.",
  },
  {
    title: "Type 2 Diabetes",
    description: "Long-term diabetes management.",
  },
  {
    title: "Prediabetes",
    description: "Early intervention and prevention.",
  },
  {
    title: "Gestational Diabetes",
    description: "Specialized care during pregnancy.",
  },
];

const monitoringAndPrevention = [
  "Blood Sugar Monitoring",
  "HbA1c Assessment",
  "Diet Counseling",
  "Lifestyle Management",
  "Medication Optimization",
  "Complication Screening",
  "Kidney Health Evaluation",
  "Eye Care Referral",
  "Neuropathy Screening",
  "Cardiovascular Risk Assessment",
];

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

function GlucoseTrendLine() {
  return (
    <svg
      className="diabetology-hero__trend"
      viewBox="0 0 600 160"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="diabetology-hero__trend-path diabetology-hero__trend-path--ghost"
        d="M0,110 C40,60 70,140 110,90 C150,40 180,130 220,80 C260,30 290,100 330,70 C370,40 410,95 450,65 C490,35 520,80 560,60 L600,60"
      />
      <path
        className="diabetology-hero__trend-path diabetology-hero__trend-path--live"
        d="M0,95 C40,85 70,100 110,88 C150,76 180,92 220,82 C260,72 290,84 330,76 C370,68 410,78 450,72 C490,66 520,74 560,70 L600,70"
      />
      <circle className="diabetology-hero__trend-dot" r="5" cx="600" cy="70" />
    </svg>
  );
}

function ServiceCard({ title, description, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <article
        ref={ref}
        className={`diabetology-service-card ${
          inView ? "diabetology-service-card--visible" : ""
        }`}
        style={{ transitionDelay: `${index * 90}ms` }}
      >
        <div className="diabetology-service-card__mark" aria-hidden="true" />
        <h3 className="diabetology-service-card__title">{title}</h3>
        <p className="diabetology-service-card__description">{description}</p>
      </article>
    </div>
  );
}

function ChecklistItem({ label, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <li
      ref={ref}
      className={`diabetology-checklist__item ${
        inView ? "diabetology-checklist__item--visible" : ""
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <span className="diabetology-checklist__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            d="M4 12.5L9.5 18L20 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="diabetology-checklist__label">{label}</span>
    </li>
  );
}

export default function Diabetology() {
  return (
    <div className="diabetology">
      {/* Hero */}
      <section className="diabetology-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-7">
              {/* <p className="diabetology-hero__eyebrow">
                Diabetology Department
              </p> */}
              <div className="section-title">
              <h2 className="">
                Comprehensive Diabetes Care Centre
              </h2>
              </div>
              <p className="diabetology-hero__subtitle">
                Effective Diabetes Management for a Healthier Future
              </p>
              <p className="diabetology-hero__lede">
                Our diabetology department helps patients manage blood sugar
                levels, reduce complications, and improve quality of life
                through individualized treatment plans.
              </p>
            </div>
            <div className="col-12 col-lg-5">
            <img src={img} style={{ borderRadius: "10px" }} alt="" />

            </div>
          </div>
        </div>
      </section>

      {/* Diabetes Services */}
      <section className="diabetology-section diabetology-section--services">
        <div className="container">
          <h2 className="diabetology-section__title">Diabetes Services</h2>
          <div className="row g-4" style={{     "paddingTop": "30px"}}>
            {diabetesServices.map((service, index) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring & Prevention */}
      <section className="diabetology-section diabetology-section--monitoring">
        <div className="container">
          <h2 className="diabetology-section__title">
            Monitoring &amp; Prevention
          </h2>
          <ul className="diabetology-checklist row g-3 list-unstyled">
            {monitoringAndPrevention.map((label, index) => (
              <div className="col-12 col-md-6" key={label}>
                <ChecklistItem label={label} index={index} />
              </div>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}