import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  HeartPulse,
  Flower2,
  Baby,
  Activity,
} from "lucide-react";
import "./Special.css";

import main from "../../../assets/home/new/main.png";

import img1 from "../../../assets/home/new/img1.png";
import img2 from "../../../assets/home/new/img2.png";
import img3 from "../../../assets/home/new/img3.png";
import img4 from "../../../assets/home/new/img4.jpg";
import img5 from "../../../assets/home/new/5.png";
import img6 from "../../../assets/home/new/img6.jpg";

interface SpecialtyItem {
  icon: React.ElementType;
  title: string;
  blurb: string;
  points: string[];
  image: string;
  alt: string;
}

const SPECIALTIES: SpecialtyItem[] = [
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
    alt: "Fertility treatment and planning at Sri Sai Subhramaniya Hospitals",
  },
  {
    icon: Baby,
    title: "Obstetrics & Maternity",
    blurb:
      "Expert prenatal, labor, and postnatal care to support you and your baby's journey.",
    points: [
      "High-risk pregnancy management",
      "Painless labor options",
      "Comprehensive postnatal support",
      "State-of-the-art labor rooms",
    ],
    image: img3,
    alt: "Newborn baby care at Sri Sai Subhramaniya Hospitals",
  },
  {
    icon: Activity,
    title: "Hormonal & Metabolic Health",
    blurb:
      "Comprehensive care for endocrine disorders, thyroid conditions, and weight management.",
    points: [
      "Thyroid disorder management",
      "Comprehensive diabetes care Centre",
      "PCOS hormonal therapies",
      "Metabolic health screenings",
    ],
    image: img4,
    alt: "Hormonal and metabolic health screening at Sri Sai Subhramaniya Hospitals",
  },
  {
    icon: Activity,
    title: "Dermatology & Aesthetic Solutions",
    blurb:
      "Advanced skin, hair, and nail treatments to address clinical and cosmetic concerns.",
    points: [
      "Clinical dermatology & skin care",
      "Specialised hair & nail clinic",
      "Cosmetology & aesthetic therapies",
      "Laser skin treatments",
    ],
    image: img5,
    alt: "Dermatology treatment room at Sri Sai Subhramaniya Hospitals",
  },
  {
    icon: Activity,
    title: "Compassionate Multi-Specialty Care",
    blurb:
      "Expert consultations across general medicine, surgery, and key specialties.",
    points: [
      "General medicine & wellness OPD",
      "Urology & key surgical specialties",
      "Preventive health check-ups",
      "24/7 emergency medical services",
    ],
    image: img6,
    alt: "Specialist consultation room at Sri Sai Subhramaniya Hospitals",
  },
];

function useReveal<T extends HTMLElement>(threshold = 0.3): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
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

interface SpecialtyCardProps {
  data: SpecialtyItem;
  index: number;
  onReveal: (index: number) => void;
}

function SpecialtyCard({ data, index, onReveal }: SpecialtyCardProps) {
  const [ref, visible] = useReveal<HTMLDivElement>(0.35);
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
            {data.points.map((point: string) => (
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
  const [imgRef, imgVisible] = useReveal<HTMLDivElement>(0.2);

  const handleReveal = useCallback((index: number) => {
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
