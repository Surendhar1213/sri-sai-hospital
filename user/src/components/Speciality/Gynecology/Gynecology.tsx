import React, { useEffect, useRef } from "react";
import "./Gynecology.css";
import PageBanner from "../../PageBanner/PageBanner";

import img from "../../../assets/speciality/gynecology.png";

/* ---------- content (kept verbatim to the brief) ---------- */

const LIFE_STAGES = [
  "Adolescence",
  "Reproductive Years",
  "Pregnancy",
  "Menopause",
  "Beyond",
];

const SERVICES = [
  {
    id: "menstrual",
    title: "Menstrual Disorder Management",
    lead: "Treatment for:",
    items: [
      "Irregular Menstrual Cycles",
      "Heavy Menstrual Bleeding",
      "Painful Periods",
      "Hormonal Imbalances",
      "Delayed Menstruation",
    ],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 4.5c3.6 4.3 6 7.6 6 10.8a6 6 0 1 1-12 0c0-3.2 2.4-6.5 6-10.8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M11 18.2a3.2 3.2 0 0 1-1.6-2.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "pcos",
    title: "PCOS & PCOD Management",
    lead: "Comprehensive treatment for:",
    items: [
      "Irregular Periods",
      "Weight Gain",
      "Acne",
      "Excess Hair Growth",
      "Ovulation Disorders",
      "Fertility Challenges",
    ],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="14"
          cy="14"
          r="3.2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="7" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9.5 10.4 12 12.6M18.5 10.4 16 12.6M9.5 17.6 12 15.4M18.5 17.6 16 15.4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    id: "fibroids",
    title: "Fibroids & Ovarian Cysts",
    lead: "Advanced diagnosis and treatment for:",
    items: [
      "Uterine Fibroids",
      "Ovarian Cysts",
      "Endometriosis",
      "Adenomyosis",
      "Pelvic Pain Conditions",
    ],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle
          cx="20"
          cy="9"
          r="3.2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="var(--gyno-card-bg)"
        />
      </svg>
    ),
  },
  {
    id: "menopause",
    title: "Menopause Care",
    lead: "Specialized support for:",
    items: [
      "Hot Flashes",
      "Mood Changes",
      "Sleep Disturbances",
      "Vaginal Dryness",
      "Bone Health",
    ],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.5 5.2A8.5 8.5 0 1 0 22.8 18a7 7 0 0 1-5.3-12.8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M22 4.5v3M20.5 6h3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "adolescent",
    title: "Adolescent Gynecology",
    lead: "Specialized care for teenage girls including:",
    items: [
      "Puberty Concerns",
      "Menstrual Disorders",
      "Hormonal Issues",
      "PCOS Evaluation",
    ],
    icon: (
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 23v-9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 13.5C14 9 10.5 6.5 6.5 6.5 6.5 11 9.5 13.5 14 13.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M14 17C14 12.5 17.5 10.5 21 10.5 21 14.5 18.2 17 14 17Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/* ---------- scroll-reveal hook (matches existing project pattern) ---------- */

function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ---------- component ---------- */

export default function Gynecology() {
  const heroRef = useReveal();
  const ribbonRef = useReveal();
  const headingRef = useReveal();
  const cardRefs = useRef(SERVICES.map(() => React.createRef()));

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref.current) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            ref.current.style.transitionDelay = `${i * 90}ms`;
            ref.current.classList.add("is-visible");
            observer.unobserve(ref.current);
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
      );
      observer.observe(ref.current);
      return observer;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <>
      <PageBanner title="Gynecology & Women's Health" />
      <section className="gyno" aria-labelledby="gyno-hero-title">
        {/* ---------- Hero ---------- */}
        <div className="section-space">
          <div className="container">
            <div
              className="row"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <div className="col-md-5">
                <img src={img} style={{ borderRadius: "10px" }} alt="" />
              </div>
              <div className="col-md-5">
                <div className="gyno-hero-inner section-title" ref={heroRef}>
                  <h2 id="gyno-hero-title" className="gyno-hero-title">
                    Comprehensive Women&rsquo;s Healthcare
                  </h2>
                  <p>
                    Women&rsquo;s healthcare needs evolve through adolescence,
                    reproductive years, pregnancy, menopause, and beyond. Our
                    gynecology department provides complete diagnostic,
                    preventive, and treatment solutions tailored to every stage of
                    life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Services ---------- */}
        <div className="gyno-services section-space">
          <div className="gyno-services-heading section-title" ref={headingRef}>
            <h2>Our Gynecology Services</h2>
          </div>

          <div className="gyno-grid">
            {SERVICES.map((service, i) => (
              <article
                className={`gyno-card gyno-card--${service.id} `}
                key={service.id}
                ref={cardRefs.current[i]}
              >
                <div className="gyno-card-icon">{service.icon}</div>
                <h3 className="gyno-card-title">{service.title}</h3>
                <p className="gyno-card-lead">{service.lead}</p>
                <ul className="gyno-card-list">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
