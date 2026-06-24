import React, { useEffect, useRef } from 'react';
import "./Gallery.css";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Gallery1 from "../../../assets/home/gallery/s-1.png";
import Gallery2 from "../../../assets/home/gallery/s-3.png";
import Gallery3 from "../../../assets/home/gallery/s-2.png";
import Gallery4 from "../../../assets/home/gallery/s-4.png";
import Gallery5 from "../../../assets/home/gallery/s-5.png";
import Gallery6 from "../../../assets/home/gallery/s-6.png";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Only run if the container element exists
    if (containerRef.current) {
      // MatchMedia for responsive animations
      const pw = gsap.matchMedia();

      pw.add("(min-width: 1200px)", () => {
        // Find all .design-choose-item-wrap within this component
        const wraps = containerRef.current.querySelectorAll(".design-choose-item-wrap");
        
        wraps.forEach((wrap) => {
          const items1 = wrap.querySelectorAll(".design-choose-item-1");
          const items2 = wrap.querySelectorAll(".design-choose-item-2");

          items1.forEach((item1, i) => {
            const item2 = items2[i];

            if (item1 && item2) {
              // Set initial positions
              gsap.set(item1, { x: -400, rotate: -40 });
              gsap.set(item2, { x: 400, rotate: 40 });

              // Create timeline with ScrollTrigger
              let tl = gsap.timeline({
                scrollTrigger: {
                  trigger: item1,
                  start: "top 90%",
                  end: "top 20%",
                  scrub: 1,
                }
              });

              tl.to(item1, { x: 0, rotate: 0 })
                .to(item2, { x: 0, rotate: 0 }, 0);
            }
          });
        });
      });

      // Cleanup ScrollTrigger instances on unmount
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        pw.revert();
      };
    }
  }, []);

  return (
    <section 
      className="project-section fix " 
      ref={containerRef}
    >
      <div className="container Gallerys section-space mb-50">
        <div className="section-title text-center mb-2">
          <h2 className=" text-white mb-5">
            Gallery
          </h2>
        </div>

        <div className="row g-4 design-choose-item-wrap">
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="project-thumb-items mt-0 design-choose-item-1">
              <img src={Gallery1} alt="img" />
              {/* <div className="content">
                <h2 className="title">
                  <a href="#">
                    Modular Operation Theatre
                  </a>
                </h2>
                <a href="#" className="icon">
                  <i className="fa-solid fa-arrow-up-right"></i>
                </a>
              </div> */}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="project-thumb-items mt-0 design-choose-item-2">
              <img src={Gallery2} alt="img" />
              {/* <div className="content">
                <h2 className="title">
                  <a href="#">
                    ECG Services
                  </a>
                </h2>
                <a href="#" className="icon">
                  <i className="fa-solid fa-arrow-up-right"></i>
                </a>
              </div> */}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="project-thumb-items mt-0 design-choose-item-1">
              <img src={Gallery3} alt="img" />
              {/* <div className="content">
                <h2 className="title">
                  <a href="#">
                    Clinical Laboratory
                  </a>
                </h2>
                <a href="#" className="icon">
                  <i className="fa-solid fa-arrow-up-right"></i>
                </a>
              </div> */}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="project-thumb-items mt-0 design-choose-item-2">
              <img src={Gallery4} alt="img" />
              {/* <div className="content">
                <h2 className="title">
                  <a href="#">
                    Pharmacy
                  </a>
                </h2>
                <a href="#" className="icon">
                  <i className="fa-solid fa-arrow-up-right"></i>
                </a>
              </div> */}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="project-thumb-items mt-0 design-choose-item-1">
              <img src={Gallery5} alt="img" />
              {/* <div className="content">
                <h2 className="title">
                  <a href="#">
                    ECG Services
                  </a>
                </h2>
                <a href="#" className="icon">
                  <i className="fa-solid fa-arrow-up-right"></i>
                </a>
              </div> */}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="project-thumb-items mt-0 design-choose-item-2">
              <img src={Gallery6} alt="img" />
              {/* <div className="content">
                <h3 className="title">
                  <a href="#">
                    ICU & NICU
                  </a>
                </h3>
                <a href="#" className="icon">
                  <i className="fa-solid fa-arrow-up-right"></i>
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;