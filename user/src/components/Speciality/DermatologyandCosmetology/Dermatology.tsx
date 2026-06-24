import React from "react";
import {
  Stethoscope,
  Activity,
  Sparkles,
  Zap,
  MapPin,
  User,
  CheckCircle,
} from "lucide-react";
import "./Dermatology.css";

import img from "../../../assets/speciality/cosmetology.png";


const Dermatology = () => {
  return (
    <div className="DermatologyandCosmetology-container min-vh-100">
      {/* HEADER SECTION */}
      <section className="DermatologyandCosmetology-header text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
                <img src={img} style={{ borderRadius: "10px" }} alt="" />
            </div>
            <div className="col-md-6">
              <div className="section-title">
                <h2 className="text-white">
                  Advanced Skin, Laser & Aesthetic Care
                </h2>
              </div>
              <h2 className="DermatologyandCosmetology-tagline fw-light mb-4">
                Healthy Skin. Beautiful Confidence.
              </h2>
              <p className="DermatologyandCosmetology-intro mx-auto fw-medium">
                Our dermatology and cosmetology services combine medical
                expertise with advanced technologies to deliver safe and
                effective solutions for skin concerns and aesthetic enhancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container DermatologyandCosmetology-main">
        {/* DOCTORS SECTION */}
        <section className="DermatologyandCosmetology-doctors-section">
          <div className="text-center DermatologyandCosmetology-badge-wrap">
            <span className="DermatologyandCosmetology-badge d-inline-flex align-items-center gap-2 text-uppercase">
              <Stethoscope size={18} />
              Specialist Doctors
            </span>
          </div>

          <div className="row g-4 justify-content-center DermatologyandCosmetology-doctors-row">
            {/* Doctor 1 */}
            <div className="col-12 col-md-6">
              <div className="DermatologyandCosmetology-doctor-card h-100">
                <div className="DermatologyandCosmetology-doctor-icon">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="DermatologyandCosmetology-doctor-name mb-1">
                    Dr. R. Jayashree
                  </h3>
                  <p className="DermatologyandCosmetology-doctor-role fw-medium mb-0">
                    Consultant Dermatologist & Cosmetologist
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="col-12 col-md-6">
              <div className="DermatologyandCosmetology-doctor-card h-100">
                <div className="DermatologyandCosmetology-doctor-icon">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="DermatologyandCosmetology-doctor-name mb-1">
                    Dr. R. Arunkarthick
                  </h3>
                  <p className="DermatologyandCosmetology-doctor-role fw-medium mb-0">
                    Consultant Dermatologist & Aesthetic Specialist
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center DermatologyandCosmetology-location-wrap">
            <div className="DermatologyandCosmetology-location-badge d-inline-flex align-items-center gap-2">
              <MapPin size={18} />
              Available at Coimbatore Centre
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <div className="row DermatologyandCosmetology-services-row">
          {/* MEDICAL DERMATOLOGY */}
          <div className="col-12 col-lg-4">
            <section className="DermatologyandCosmetology-medical-section DermatologyandCosmetology-service-column h-100">
              <div className="d-flex align-items-center gap-3 DermatologyandCosmetology-section-header">
                <div className="DermatologyandCosmetology-section-icon">
                  <Activity size={24} />
                </div>
                <h2 className="DermatologyandCosmetology-section-title mb-0">
                  Medical Dermatology
                </h2>
              </div>

              <div className="DermatologyandCosmetology-service-card h-100">
                <h3>Acne & Acne Scar Management</h3>
                <p className="DermatologyandCosmetology-service-label">
                  Treatment for:
                </p>
                <ul className="DermatologyandCosmetology-service-list">
                  {[
                    "Active Acne",
                    "Acne Scars",
                    "Pigmentation",
                    "Oily Skin Disorders",
                  ].map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <h3 className="is-divided">Pigmentation Treatment</h3>
                <p className="DermatologyandCosmetology-service-label">
                  Management of:
                </p>
                <ul className="DermatologyandCosmetology-service-list">
                  {[
                    "Melasma",
                    "Dark Spots",
                    "Uneven Skin Tone",
                    "Sun Damage",
                  ].map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <h3 className="is-divided">Skin Lightening Therapy</h3>
                <p className="DermatologyandCosmetology-paragraph">
                  Customized skin rejuvenation programs designed to improve skin
                  clarity, radiance, and tone.
                </p>
              </div>
            </section>
          </div>

          {/* COSMETOLOGY SERVICES */}
          <div className="col-12 col-lg-4">
            <section className="DermatologyandCosmetology-cosmetology-section DermatologyandCosmetology-service-column h-100">
              <div className="d-flex align-items-center gap-3 DermatologyandCosmetology-section-header">
                <div className="DermatologyandCosmetology-section-icon">
                  <Sparkles size={24} />
                </div>
                <h2 className="DermatologyandCosmetology-section-title mb-0">
                  Cosmetology Services
                </h2>
              </div>

              <div className="DermatologyandCosmetology-service-card h-100">
                <h3>Skin Rejuvenation</h3>
                <p className="DermatologyandCosmetology-paragraph has-margin">
                  Advanced treatments for healthier, younger-looking skin.
                </p>

                <h3 className="is-divided">Anti-Aging Treatments</h3>
                <p className="DermatologyandCosmetology-service-label">
                  Management of:
                </p>
                <ul className="DermatologyandCosmetology-service-list no-margin">
                  {["Fine Lines", "Wrinkles", "Skin Laxity", "Aging Skin"].map(
                    (item, idx) => (
                      <li key={idx}>{item}</li>
                    ),
                  )}
                </ul>
              </div>
            </section>
          </div>

          {/* LASER TREATMENTS */}
          <div className="col-12 col-lg-4">
            <section className="DermatologyandCosmetology-laser-section DermatologyandCosmetology-service-column h-100">
              <div className="d-flex align-items-center gap-3 DermatologyandCosmetology-section-header">
                <div className="DermatologyandCosmetology-section-icon">
                  <Zap size={24} />
                </div>
                <h2 className="DermatologyandCosmetology-section-title mb-0">
                  Laser Treatments
                </h2>
              </div>

              <div className="DermatologyandCosmetology-service-card h-100">
                <h3>Laser Hair Removal</h3>
                <p className="DermatologyandCosmetology-paragraph has-margin">
                  Long-term hair reduction using advanced laser technology.
                </p>

                <p className="DermatologyandCosmetology-service-label">
                  Treatment Areas
                </p>
                <div className="d-flex flex-wrap gap-2 DermatologyandCosmetology-area-tags">
                  {[
                    "Face",
                    "Upper Lip",
                    "Chin",
                    "Underarms",
                    "Arms",
                    "Legs",
                    "Bikini Area",
                    "Full Body",
                  ].map((area, idx) => (
                    <span
                      key={idx}
                      className="DermatologyandCosmetology-area-tag"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <h3 className="is-divided">Tattoo Removal</h3>
                <p className="DermatologyandCosmetology-paragraph">
                  Advanced laser technology for safe and effective tattoo
                  reduction.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* BENEFITS SECTION */}
        <section className="DermatologyandCosmetology-benefits-section">
          <div className="text-center DermatologyandCosmetology-benefits-title">
            <h2 className="fw-bold mb-0">Benefits</h2>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            {[
              "✔️ Safe Procedures",
              "✔️ Minimal Downtime",
              "✔️ Advanced Technology",
              "✔️ Expert Dermatologists",
              "✔️ Personalized Treatment Plans",
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="DermatologyandCosmetology-benefit-item d-flex align-items-center fw-medium"
              >
                {benefit}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default function App() {
  return <Dermatology />;
}
