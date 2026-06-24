// GeneralMedicine.jsx

import "./GeneralMedicine.css";

import img1 from "../../../assets/speciality/general-medicine.png";


// ── Placeholder image imports (replace src values with your own) ──
const heroImage = img1; 
const featureImage =
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80"; // Medical consultation

// ── Services data ──
const SERVICES = [
  { icon: "🌡️", name: "Fever Management" },
  { icon: "🫀", name: "Hypertension" },
  { icon: "🦋", name: "Thyroid Disorders" },
  { icon: "🫁", name: "Respiratory Conditions" },
  { icon: "🥗", name: "Lifestyle Diseases" },
  { icon: "🩺", name: "Preventive Health Checkups" },
  { icon: "💬", name: "General Health Consultations" },
];

// ── Component ──
export default function GeneralMedicine() {
  return (
    <div className="GeneralMedicine-root">
      {/* =============================================
          HERO SECTION
      ============================================= */}
      <section className="GeneralMedicine-hero section-space">
        <div className="GeneralMedicine-hero-grid" aria-hidden="true" />

        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left — Content */}
            <div className="col-lg-6 GeneralMedicine-hero-content">
              <div className="section-title">
                <h2 className="GeneralMedicine-hero-title GeneralMedicine-reveal GeneralMedicine-reveal-2">
                  Complete Family Healthcare
                </h2>
              </div>

              <p className="GeneralMedicine-hero-subtitle GeneralMedicine-reveal GeneralMedicine-reveal-3">
                Providing preventive, diagnostic, and treatment services for
                patients of all ages.
              </p>
            </div>

            {/* Right — Image */}
            <div className="col-lg-6 GeneralMedicine-reveal GeneralMedicine-reveal-3">
              <div className="GeneralMedicine-hero-image-wrap">
                <img
                  src={heroImage}
                  alt="Complete family healthcare professionals"
                  className="GeneralMedicine-hero-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="GeneralMedicine-stripe" />

      {/* =============================================
          INTRO / OVERVIEW SECTION
      ============================================= */}
      <section
        className="GeneralMedicine-section GeneralMedicine-intro"
        id="about"
        style={{ display: "none" }}
      >
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {/* Left — branded card */}
            <div className="col-lg-5 GeneralMedicine-reveal GeneralMedicine-reveal-1">
              <div className="GeneralMedicine-intro-card h-100">
                <div className="GeneralMedicine-intro-card-title">
                  Complete Family Healthcare
                </div>
                <p className="GeneralMedicine-intro-card-text">
                  Providing preventive, diagnostic, and treatment services for
                  patients of all ages.
                </p>

                <div className="GeneralMedicine-stat-row">
                  <div className="GeneralMedicine-stat">
                    <div className="GeneralMedicine-stat-num">7+</div>
                    <div className="GeneralMedicine-stat-label">
                      Specialisations
                    </div>
                  </div>
                  <div className="GeneralMedicine-stat">
                    <div className="GeneralMedicine-stat-num">All</div>
                    <div className="GeneralMedicine-stat-label">
                      Ages Served
                    </div>
                  </div>
                  <div className="GeneralMedicine-stat">
                    <div className="GeneralMedicine-stat-num">360°</div>
                    <div className="GeneralMedicine-stat-label">
                      Health Coverage
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — feature image with overlay */}
            <div className="col-lg-7 GeneralMedicine-reveal GeneralMedicine-reveal-2">
              <div className="GeneralMedicine-feature-img-wrap h-100">
                <img
                  src={featureImage}
                  alt="Medical consultation with a family"
                  className="GeneralMedicine-feature-img"
                />
                <div className="GeneralMedicine-feature-overlay" />
                <div className="GeneralMedicine-feature-overlay-text">
                  <p>Trusted Healthcare</p>
                  <h4>For Every Stage of Life</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="GeneralMedicine-stripe" />

      {/* =============================================
          SERVICES SECTION
      ============================================= */}
      <section
        className="section-space GeneralMedicine-services"
        id="services"
      >
        <div className="container">
          {/* Heading */}
          <div className="row">
            <div className="col-md-12 GeneralMedicine-reveal GeneralMedicine-reveal-1">
              <div className="section-title">
                <h2 style={{textAlign:"center"}}>Services Include</h2>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="row g-4">
            {SERVICES.map((svc, i) => (
              <div
                key={svc.name}
                className={`col-sm-6 col-lg-4 GeneralMedicine-reveal GeneralMedicine-reveal-${Math.min(i + 1, 7)}`}
              >
                <div className="GeneralMedicine-service-card">
                  <div className="GeneralMedicine-service-icon-wrap">
                    {svc.icon}
                  </div>
                  <div className="GeneralMedicine-service-name">{svc.name}</div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="GeneralMedicine-stripe" />

      {/* =============================================
          CTA BANNER
      ============================================= */}
      {/* <section className="GeneralMedicine-section">
        <div className="container">
          <div className="GeneralMedicine-cta-banner GeneralMedicine-reveal GeneralMedicine-reveal-1">
            <h2 className="GeneralMedicine-cta-title">
              Complete Family Healthcare
            </h2>
            <p className="GeneralMedicine-cta-desc">
              Providing preventive, diagnostic, and treatment services for patients of all ages.
            </p>
            <a href="#services" className="GeneralMedicine-cta-btn-primary">
              Book a Consultation
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M4.75 8a.75.75 0 0 1 .75-.75h4.19L8.22 5.78a.75.75 0 1 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.47-1.47H5.5A.75.75 0 0 1 4.75 8z" />
              </svg>
            </a>
          </div>
        </div>
      </section> */}
    </div>
  );
}
