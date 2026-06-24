// Special.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  HeartPulse,
  Flower2,
  Baby,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import "./Special.css";

import main from "../../../assets/home/new/main.png";

import img1 from "../../../assets/home/new/img1.png";
import img2 from "../../../assets/home/new/img2.png";
import img3 from "../../../assets/home/new/img3.png";
import img4 from "../../../assets/home/new/img4.jpg";
import img5 from "../../../assets/home/new/5.png";
import img6 from "../../../assets/home/new/img6.jpg";

const SPECIALTIES = [
  {
    icon: HeartPulse,
    title: "Gynecology & Women's Health",
    blurb:
      "From your first cycle to menopause — complete diagnostic and treatment care for every stage.",
    points: [
      "Menstrual disorder management",
      "PCOS & PCOD management",
      "Fibroids, cysts & endometriosis care",
      "Menopause & adolescent gynecology",
    ],
    image: img1,
    alt: "Gynecology consultation at Sri Sai Subhramaniya Hospitals",
  },
  {
    icon: Flower2,
    title: "Infertility & Fertility",
    blurb:
      "Personalised evaluation and treatment plans to help you build your family.",
    points: [
      "Ovulation & hormonal assessment",
      "Male fertility evaluation",
      "Ovulation induction & monitoring",
      "Fertility counselling & preconception planning",
    ],
    image: img2,
    alt: "Fertility consultation and counseling",
  },
  {
    icon: Baby,
    title: "Obstetrics & Maternity",
    blurb:
      "Expert support through pregnancy, delivery, and the early days of motherhood.",
    points: [
      "Antenatal & high-risk pregnancy care",
      "Normal, assisted & cesarean delivery",
      "Gestational diabetes & hypertension management",
      "Postnatal care for mother & newborn",
    ],
    image: img3,
    alt: "Maternity and pregnancy care",
  },
  {
    icon: Baby,
    title: "Endocrinology",
    blurb:
      "Comprehensive diagnosis and treatment of hormonal disorders affecting metabolism, fertility, thyroid health, and overall wellness.",
    points: [
      "Thyroid disorder management",
      "PCOS & hormonal imbalance treatment",
      "Menopause & fertility-related hormone care",
      "Metabolic syndrome & endocrine disorder management",
    ],
    image: img4,
    alt: "Endocrinology and hormonal wellness consultation",
  },
  {
    icon: Baby,
    title: "Obesity & Weight Loss Management",
    blurb:
      "Personalized medical weight loss programs designed to improve health, confidence, and long-term wellness.",
    points: [
      "BMI & body composition assessment",
      "Personalized diet and lifestyle planning",
      "PCOS, postpartum & menopause weight management",
      "Cryolipolysis (fat freezing) body contouring",
    ],
    image: img5,
    alt: "Medical weight loss and obesity management consultation",
  },
  {
    icon: Activity,
    title: "Diabetology",
    blurb:
      "Individualised plans to manage blood sugar and prevent long-term complications.",
    points: [
      "Type 1, Type 2 & gestational diabetes care",
      "Blood sugar & HbA1c monitoring",
      "Diet & lifestyle counselling",
      "Kidney, eye & cardiovascular screening",
    ],
    image: img6,
    alt: "Diabetology consultation and monitoring",
  },
];

function useReveal(threshold = 0.3) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function SpecialtyCard({ data, index, onReveal }) {
  const [ref, visible] = useReveal(0.35);
  const Icon = data.icon;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (visible) onReveal(index);
  }, [visible, index, onReveal]);

  return (
    <div
      ref={ref}
      className={`spec-card ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 110}ms` }}
    >
      <div className="spec-card-dot" aria-hidden="true" />
      <div className="spec-card-inner">
        <div className="spec-card-image-wrapper">
          <div
            className={`spec-card-image ${imageLoaded ? "image-loaded" : ""}`}
          >
            <img
              src={data.image}
              alt={data.alt}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className="spec-icon-wrap">
            <Icon size={22} strokeWidth={1.75} />
          </div>
        </div>
        <div className="spec-content">
          <h3>{data.title}</h3>
          <p className="spec-blurb">{data.blurb}</p>
          <ul>
            {data.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Special() {
  const [revealedCount, setRevealedCount] = useState(0);
  const [imgRef, imgVisible] = useReveal(0.2);

  const handleReveal = useCallback((index) => {
    setRevealedCount((prev) => Math.max(prev, index + 1));
  }, []);

  const fillPercent = (revealedCount / SPECIALTIES.length) * 100;

  return (
    <section className="specialties-section section-space">
      <div className="container">
        <div className="spec-head">
          {/* <span className="spec-eyebrow">Our Specialties</span> */}
          <h2>
            Comprehensive <em>Healthcare</em> Under One Roof
          </h2>
          {/* <p>
            From adolescence through pregnancy, motherhood, and the years
            beyond, our specialists bring focused expertise to the moments that
            matter most.
          </p>
          <a href="#contact" className="spec-cta">
            Book a Consultation
            <ArrowUpRight size={16} strokeWidth={2} />
          </a> */}
        </div>

        <div className="spec-grid">
          <div className="spec-image-col">
            <div className="spec-image-shell">
              <div className="spec-frame-accent" aria-hidden="true" />
              <div
                ref={imgRef}
                className={`spec-image-frame ${imgVisible ? "is-visible" : ""}`}
              >
                <img src={main} alt="Sri Sai Subhramaniya Hospitals" />
              </div>
            </div>
          </div>

          <div className="spec-list-col">
            <div className="spec-connector">
              <div
                className="spec-connector-fill"
                style={{ height: `${fillPercent}%` }}
              />
            </div>
            {SPECIALTIES.map((item, i) => (
              <SpecialtyCard
                key={item.title}
                data={item}
                index={i}
                onReveal={handleReveal}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
