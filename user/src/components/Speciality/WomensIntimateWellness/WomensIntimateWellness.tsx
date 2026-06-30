import { useEffect, useRef } from "react";
import "./WomensIntimateWellness.css";
import PageBanner from "../../PageBanner/PageBanner";
import img1 from "../../../assets/speciality/womensIntimatewellness-1.png";
import img2 from "../../../assets/speciality/womensIntimatewellness-2.png";

const conditions = [
  {
    label: "Vaginal Laxity",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse
          cx="20"
          cy="24"
          rx="10"
          ry="6"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M12 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M20 7v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16 9l1.5 3M24 9l-1.5 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Vaginal Dryness",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 6c0 0-9 8.5-9 15.5a9 9 0 0018 0C29 14.5 20 6 20 6z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M16.5 25c1 2 2.5 3 3.5 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M27 12l3-3M29 18h3M27 24l3 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="1.5 2"
        />
      </svg>
    ),
  },
  {
    label: "Mild Stress Urinary Incontinence",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="11"
          y="9"
          width="18"
          height="20"
          rx="9"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle cx="20" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 22v6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M16 33l-2 4M24 33l2 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="1.5 2"
        />
      </svg>
    ),
  },
  {
    label: "Menopause-Related Changes",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M20 7v4M20 29v4M7 20h4M29 20h4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M11.5 11.5l2.8 2.8M25.7 25.7l2.8 2.8M28.5 11.5l-2.8 2.8M14.3 25.7l-2.8 2.8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Pelvic Muscle Weakness",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 28c3-8 7-13 11-13s8 5 11 13"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M15 19c1.5-2.5 3-4 5-4s3.5 1.5 5 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse
          cx="20"
          cy="29"
          rx="9"
          ry="3.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
];

const benefits = [
  "Non-Surgical Procedures",
  "Quick Sessions",
  "Minimal Discomfort",
  "No Hospitalization",
  "Improved Comfort & Confidence",
];

export default function WomensIntimateWellness() {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("wi-show");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const ref = (el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };

  return (
    <>
      <PageBanner title="Women's Intimate Wellness" />
      <section className="woman-intimate">
        {/* HERO */}
        <div className="woman-intimate__hero">
          <div className="woman-intimate__hero-circle wi-c1" aria-hidden="true" />
          <div className="woman-intimate__hero-circle wi-c2" aria-hidden="true" />
          <div className="container position-relative">
            <div className="row justify-content-center align-items-center">
              <div className="col-xl-5 col-md-5">
                <img className="pf-hero__img" src={img1} alt="Pelvic Floor" />
              </div>
              <div className="col-xl-6 col-md-6">
                {/* <span className="woman-intimate__tag">
                Women's Intimate Wellness
              </span> */}
                <div className="section-title">
                  <h2 className="woman-intimate__h1">
                    Advanced Vaginal
                    <em>Wellness Solutions</em>
                  </h2>
                </div>
                <p className="woman-intimate__lead" style={{ marginBottom: "10px" }}>
                  Women's intimate health may be affected by childbirth, hormonal fluctuations, menopause, and aging.
                </p>
                <p className="woman-intimate__lead">Our advanced wellness treatments help support vaginal health, pelvic strength, and overall feminine wellness.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONDITIONS */}
        <div className="woman-intimate__ben-section ">
          <div className="woman-intimate__ben-blob" aria-hidden="true" />

          <div className="container-fluid">
            <div
              className="woman-intimate-bg section-space"
              style={{
                borderRadius: "15px",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              <div className="row justify-content-center mb-4">
                <div className="col-auto text-center" ref={ref}>
                  <h2 className="woman-intimate__sec-title">
                    Conditions Addressed
                  </h2>
                  <div className="woman-intimate__rule" />
                </div>
              </div>
              <div className="row g-3 justify-content-center">
                {conditions.map((c, i) => (
                  <div
                    key={i}
                    className="col-6 col-sm-4 col-md wi-fade"
                    ref={ref}
                    style={{ transitionDelay: `${i * 75}ms` }}
                  >
                    <div className="woman-intimate__cond-card">
                      <div className="woman-intimate__cond-icon">{c.icon}</div>
                      <p className="woman-intimate__cond-label">{c.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="section-space">
          <div className="container position-relative">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <img className="pf-hero__img" src={img2} alt="Pelvic Floor" />
              </div>
              <div className="col-lg-6 col-md-9">
                <div className="section-title text-center">
                  <h2>Benefits</h2>
                </div>
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="woman-intimate__ben-row wi-fade"
                    ref={ref}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <span
                      className="woman-intimate__ben-check"
                      aria-hidden="true"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path
                          d="M2 6.5l3.5 3.5 5.5-6.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="woman-intimate__ben-text">{b}</span>
                    <span
                      className="woman-intimate__ben-bar"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
