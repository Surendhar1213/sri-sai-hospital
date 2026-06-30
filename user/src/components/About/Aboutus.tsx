import { FaAward } from "react-icons/fa";

import {
  FaUserMd,
  FaClipboardList,
  FaMicroscope,
  FaHospital,
  FaFemale,
  FaBaby,
  FaHeartbeat,
  FaSpa,
  
  FaHandsHelping,
  FaHandHoldingMedical,
} from "react-icons/fa";

import AboutImage from "../../assets/about/about.png";
import Abb from "../../assets/about/why-choose-us.jpg";

import PageBanner from "../PageBanner/PageBanner";

import "./Aboutus.css";

const Aboutus = () => {
  const faqItems = [
    {
      title: "Experienced Specialists",
      icon: <FaUserMd />,
    },
    {
      title: "Personalized Treatment Plans",
      icon: <FaClipboardList />,
    },
    {
      title: "Advanced Diagnostic Facilities",
      icon: <FaMicroscope />,
    },
    {
      title: "Modern Medical Technology",
      icon: <FaHospital />,
    },
    {
      title: "Women's Health Focused Care",
      icon: <FaFemale />,
    },
    {
      title: "Fertility & Pregnancy Expertise",
      icon: <FaBaby />,
    },
    {
      title: "Hormonal & Metabolic Health Programs",
      icon: <FaHeartbeat />,
    },
    {
      title: "Dermatology & Aesthetic Solutions",
      icon: <FaSpa />,
    },
    {
      title: "Compassionate Patient-Centered Care",
      icon: <FaHandsHelping />,
    },
    {
      title: "Affordable Healthcare Services",
      icon: <FaHandHoldingMedical />,
    },
  ];

  return (
    <>
      <PageBanner title="About Us" />

      {/* About Section */}
      <section className="about-section  section-space" id="about">
        {/* Decorative background pattern */}
        <div className="about-bg-pattern" aria-hidden="true"></div>

        <div className="container">
          <div className="row align-items-center gy-5">
            {/* ===== Left: Image ===== */}
            <div className="col-lg-6">
              <div className="about-image-wrapper">
                <div
                  className="about-blob about-blob-primary"
                  aria-hidden="true"
                ></div>
                <div
                  className="about-blob about-blob-secondary"
                  aria-hidden="true"
                ></div>
                <div className="about-dots" aria-hidden="true"></div>

                <div className="about-image-frame">
                  <img
                    src={AboutImage}
                    alt="Srisai Subhramaniya Hospital"
                    className="about-image"
                  />
                </div>

                {/* Floating experience badge - update value as needed */}
                <div className="about-badge">
                  <span className="about-badge-icon">
                    <FaAward />
                  </span>
                  <div className="about-badge-text">
                    <span className="about-badge-number">10+</span>
                    <span className="about-badge-label">
                      Years of Excellence
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Right: Content ===== */}
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title">
                  {/* <h3 className="wow fadeInUp">
                    Welcome to Srisai Subramaniya Hospital
                  </h3> */}
                  <h2 className="text-anime-style-3">
                    Caring Beyond Treatment
                  </h2>
                </div>

                <p className="about-description">
                  Srisai Subhramaniya Hospitals is a modern multi-speciality
                  healthcare institution dedicated to delivering excellence in
                  medical care through innovation, compassion, and expertise.
                </p>

                <div className="row g-4 about-cards">
                  <div className="col-md-6">
                    <div className="about-card">
                      <h3 className="about-card-title">Our Vision</h3>
                      <p className="about-card-text">
                        To become one of Tamil Nadu's most trusted healthcare
                        destinations for women's health, fertility care,
                        endocrinology, weight management, dermatology, and
                        comprehensive family healthcare.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="about-card"
                      style={{ transitionDelay: "0.12s" }}
                    >
                      <h3 className="about-card-title">Our Mission</h3>
                      <p className="about-card-text">
                        To improve lives through advanced medical care,
                        personalized treatment, preventive healthcare, and
                        patient education.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ Section - Headings Only ===== */}
      <section className="faq-wrapper faq-two fix section-space">
        <div className="container">
          <div className="row">
            {/* Left Content */}
            <div className="col-xl-6 col-lg-12">
              <div className="left-content">
                <div className="section-title">
                  {/* <div className="sub-title">explore Our Service</div> */}
                  <h2 className="split-in-right">Why Choose Us?</h2>
                </div>
                <div className="image-wrap">
                  <div className="image">
                    <img src={Abb} alt="Why Choose Us" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - FAQ Headings Only (No Accordion) */}
            <div className="col-xl-6 col-lg-12">
              <div className="faq-two__faq-content">
                <ul className="accordion-box">
                  {faqItems.map((item, index) => (
                    <li
                      key={index}
                      className={`accordion block ${
                        index === faqItems.length - 1 ? "border-0 pb-0" : ""
                      }`}
                    >
                      <div className="acc-btn">
                        {item.title}
                        <div className="icon">
                          <span className="icon-round">{item.icon}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Aboutus;
