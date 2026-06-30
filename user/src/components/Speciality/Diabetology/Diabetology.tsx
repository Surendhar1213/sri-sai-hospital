import { useEffect, useRef, useState } from "react";
import "./Diabetology.css";
import PageBanner from "../../PageBanner/PageBanner";
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

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
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

interface ServiceCardProps {
  title: string;
  description: string;
  index: number;
}

function ServiceCard({ title, description, index }: ServiceCardProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <article
        ref={ref}
        className={`diabetology-service-card ${inView ? "diabetology-service-card--visible" : ""
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

interface ChecklistItemProps {
  label: string;
  index: number;
}

function ChecklistItem({ label, index }: ChecklistItemProps) {
  const [ref, inView] = useInView<HTMLLIElement>({ threshold: 0.2 });

  return (
    <li
      ref={ref}
      className={`diabetology-checklist__item ${inView ? "diabetology-checklist__item--visible" : ""
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
    <>
      <PageBanner title="Diabetology" />
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
            <div className="row g-4" style={{ "paddingTop": "30px" }}>
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
    </>
  );
}