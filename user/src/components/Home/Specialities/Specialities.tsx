import { useEffect, useRef } from "react";
import "./Specialities.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import speciality4 from "../../../assets/home/specialities/service-4.png";
import speciality8 from "../../../assets/home/specialities/service-8.png";
import speciality9 from "../../../assets/home/specialities/service-9.png";
import speciality10 from "../../../assets/home/specialities/service-10.png";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Specialities = () => {
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (window.innerWidth >= 992) {
        imgRefs.current.forEach((item) => {
          if (item) {
            // Set initial width before animation
            gsap.set(item, { width: 300 });

            gsap.to(item, {
              width: "100%",
              duration: 2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "bottom 0%",
                scrub: 1,
              },
            });
          }
        });
      }
    }, 100);

    // Cleanup ScrollTrigger instances on component unmount
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const serviceItems = [
    {
      title: "Pelvic Floor Rehabilitation",
      description: "Advanced non-invasive therapy for pelvic health.",
      image: speciality4,
    },
    {
      title: "Dermatology & Cosmetology",
      description: "Advanced skin, laser, and aesthetic treatments.",
      image: speciality8,
    },
    {
      title: "Hair & Nail Clinic",
      description: "Specialized care for hair loss and nail disorders.",
      image: speciality9,
    },
    {
      title: "Urology & General Medicine",
      description: "Comprehensive healthcare for men and women.",
      image: speciality10,
    },
  ];

  // Arrow SVG component to avoid repetition
  const ArrowSVG = () => (
    <svg
      width="30"
      height="29"
      viewBox="0 0 30 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="6.25366"
        y="20.2163"
        width="21.557"
        height="2.73739"
        transform="rotate(-40.2798 6.25366 20.2163)"
        fill="#191B21"
      />
      <rect
        x="9.29785"
        y="6.87231"
        width="2.73739"
        height="2.73739"
        transform="rotate(-40.2798 9.29785 6.87231)"
        fill="#191B21"
      />
      <rect
        x="13.1558"
        y="7.19043"
        width="2.73739"
        height="2.73739"
        transform="rotate(-40.2798 13.1558 7.19043)"
        fill="#191B21"
      />
      <rect
        x="17.0139"
        y="7.50903"
        width="2.73739"
        height="2.73739"
        transform="rotate(-40.2798 17.0139 7.50903)"
        fill="#191B21"
      />
      <rect
        x="20.5535"
        y="11.6853"
        width="2.73739"
        height="2.73739"
        transform="rotate(-40.2798 20.5535 11.6853)"
        fill="#191B21"
      />
      <rect
        x="20.2356"
        y="15.5442"
        width="2.73739"
        height="2.73739"
        transform="rotate(-40.2798 20.2356 15.5442)"
        fill="#191B21"
      />
      <rect
        x="19.9165"
        y="19.4021"
        width="2.73739"
        height="2.73739"
        transform="rotate(-40.2798 19.9165 19.4021)"
        fill="#191B21"
      />
    </svg>
  );

  return (
    <section className="service section-space ">
      <div className="container-fluid p-0">
        <div className="mlr-70">
          <div className="xb-service-top sec-title-wrap text-center mb-55">
            <div className="section-title text-center align-items-center">
              <h2 className=" xb-text-reveal">Our Other Specialities </h2>
            </div>
          </div>
          <div className="xb-service-wrapper">
            {serviceItems.map((item, index) => (
              <div className="xb-service-item" key={index}>
                <div className="row mt-none-30">
                  <div className="col-lg-6 mt-30">
                    <div className="xb-service-inner arrow_hover_effect">
                      <h2 className="xb-item--title">
                        <a href="#">{item.title}</a>
                      </h2>
                      <ul className="xb-item--list list-unstyled">
                        <li>
                          <a href="#!">{item.description}</a>
                        </li>
                      </ul>
                      <a className="xb-item--icon" href="#">
                        <div className="xb-arrow">
                          <ArrowSVG />
                          <ArrowSVG />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-30">
                    <div
                      className="xb-service-img"
                      ref={(el) => {
                        if (el && !imgRefs.current[index]) {
                          imgRefs.current[index] = el;
                        }
                      }}
                    >
                      <a href="#" className="xb-img">
                        <img src={item.image} alt={item.title} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialities;
