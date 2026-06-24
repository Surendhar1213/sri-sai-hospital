import React, { useEffect, useRef } from "react";
import img1 from "../../../assets/home/whychooseus/feat-lg11.png";
import img2 from "../../../assets/home/whychooseus/feat-lg2.jpg";

import {
  FaHospital,
  FaUserMd,
  FaMicroscope,
  FaAward,
  FaRupeeSign,
  FaAmbulance,
  FaHandshake,
} from "react-icons/fa";

const features = [
  { icon: <FaHospital />, label: "Experienced Specialists" },
  { icon: <FaUserMd />, label: "Personalized Treatment Plans" },
  { icon: <FaMicroscope />, label: "Advanced Diagnostic Facilities" },
  { icon: <FaAward />, label: "Modern Medical Technology" },
  { icon: <FaRupeeSign />, label: "Women's Health Focused Care" },
  { icon: <FaAmbulance />, label: "Fertility & Pregnancy Expertise" },
  { icon: <FaHandshake />, label: "Hormonal & Metabolic Health Programs" },
  { icon: <FaHandshake />, label: "Dermatology & Aesthetic Solutions" },
  { icon: <FaHandshake />, label: "Compassionate Patient-Centered Care" },
  { icon: <FaHandshake />, label: "Affordable Healthcare Services" },
];

const Whychooseus = () => {
  const listRef = useRef(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll(".wcu-item");
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.getAttribute("data-idx");
            entry.target.style.animationDelay = `${idx * 0.08}s`;
            entry.target.classList.add("wcu-item--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .wcu-section {
          padding: 80px 0;
          background: #f9fafb;
        }


        /* List */
        .wcu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .wcu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: #fff;
          border-radius: 14px;
          border: 1.5px solid #f0f0f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          cursor: default;
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.45s ease, transform 0.45s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .wcu-item--visible {
          opacity: 1;
          transform: translateX(0);
        }
        .wcu-item:hover {
          box-shadow: 0 6px 24px rgba(212,78,84,0.12);
          border-color: rgba(212,78,84,0.3);
        }

        .wcu-item-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background-color: #eaf5ff;
          font-size: 20px;
          transition: transform 0.3s ease;
        }
        .wcu-item:hover .wcu-item-icon {
          transform: scale(1.12);
        }

        .wcu-item-label {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.4;
          flex: 1;
        }

        .wcu-item-check {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563EB, #6366F1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wcu-item-check svg {
          width: 12px;
          height: 12px;
          fill: none;
          stroke: #fff;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }



        @media (max-width: 575.98px) {
          .wcu-section {
            padding: 56px 0;
          }

          .wcu-item {
            padding: 12px 14px;
            gap: 12px;
          }
          .wcu-item-icon {
            width: 38px;
            height: 38px;
            font-size: 17px;
          }
          .wcu-item-label {
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wcu-item {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <section className="wcu-section overflow-hidden">
        <div className="container">
          <div className="section-title" style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2> Why Choose Us</h2>
            {/* <p>
              Trusted care backed by experience, technology, and a team that
              puts patients first.
            </p> */}
          </div>
          <div className="row align-items-center gy-5">
            {/* Image Column */}
            <div className="col-lg-6 order-1 order-lg-2">
              <div className="feature-media d-sm-flex gap-4 position-relative">
                <img
                  className="img-fluid"
                  src={img1}
                  style={{ borderRadius: "32px" }}
                  alt="Feature"
                />
                <img className="img-fluid" src={img2} alt="Feature" />
                <div className="feat-stat bg-primary moveXS round">
                  <div className="display-2 text-white">
                    <span className="purecounter" data-purecounter-end="25">
                      25
                    </span>
                    <span>+</span>
                    <h6 className="text-white">Years of Experience</h6>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="col-lg-6 order-2 order-lg-1">
              <ul className="wcu-list" ref={listRef}>
                {features.map((f, i) => (
                  <li key={i} className="wcu-item" data-idx={i}>
                    <div className="wcu-item-icon">{f.icon}</div>
                    <span className="wcu-item-label">{f.label}</span>
                    <div className="wcu-item-check">
                      <svg viewBox="0 0 12 12">
                        <polyline points="1.5,6 4.5,9 10.5,3" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Whychooseus;
