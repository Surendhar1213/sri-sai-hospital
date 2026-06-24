import React, { useEffect, useRef, useState } from "react";
import "./Facilities.css";
import { FaPlus, FaArrowRight } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Facilities1 from "../../../assets/home/facilities/1.jpg";
import Facilities2 from "../../../assets/home/facilities/2.jpg";
import Facilities3 from "../../../assets/home/facilities/3.jpg";
import Facilities4 from "../../../assets/home/facilities/4.jpg";
import Facilities5 from "../../../assets/home/facilities/5.jpg";
import Facilities6 from "../../../assets/home/facilities/6.jpg";
import Facilities7 from "../../../assets/home/facilities/7.jpg";
import Facilities8 from "../../../assets/home/facilities/8.jpg";
import Facilities9 from "../../../assets/home/facilities/9.jpg";


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const facilities = [
  {
    title: "Clinical Laboratory",
    image: Facilities1,
  },
  {
    title: "Pharmacy",
    image: Facilities2,
  },
  {
    title: "Digital X-Ray",
    image: Facilities3,
  },
  {
    title: "Ultrasound Scan",
    image: Facilities4,
  },
  {
    title: "ICU & NICU",
    image: Facilities5,
  },
  {
    title: "Modular Operation Theatre",
    image: Facilities6,
  },
  {
    title: "ECG Services",
    image: Facilities7,
  },
  {
    title: "Labour Room",
    image: Facilities8,
  },
  {
    title: "Ventilator Support",
    image: Facilities9,
  },
];

const Facilities = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);
  const facilitiesRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0); // First item active by default
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Animation for section title
    gsap.fromTo(
      titleRef.current,
      { 
        y: 50, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animation for paragraph
    gsap.fromTo(
      paragraphRef.current,
      { 
        y: 40, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animation for button
    gsap.fromTo(
      buttonRef.current,
      { 
        x: 30, 
        opacity: 0 
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: buttonRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Staggered animation for facility items
    facilitiesRef.current.forEach((item, index) => {
      gsap.fromTo(
        item,
        { 
          scale: 0.8, 
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Cleanup ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle hover events
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    // Optionally reset to first item or keep the last hovered
    // setActiveIndex(0); // Uncomment if you want to reset to first
  };

  return (
    <section 
      ref={sectionRef}
      className="services-two team-section-eleven section-space pb-100 section"
    >
      <div className="container">
        <div className="facilities-header">
          <div className="facilities-content section-title">
            <h2 ref={titleRef}>Our facilities</h2>
            <p ref={paragraphRef} className="section-description">
              Sri Sai Subhramaniya Hospitals is a 25-bedded Multi Speciality Hospital
              offering advanced diagnostics, modern operation theatres, emergency care,
              inpatient services, and specialist consultations under one roof.
            </p>
          </div>

          <div className="facilities-btn" ref={buttonRef}>
            <a href="/about" className="btn-primary">
              Discover More
            </a>
          </div>
        </div>

        <div className="services-two__inner">
          <ul className="services-two__services-list list-unstyled">
            {facilities.map((facility, index) => (
              <li 
                ref={el => facilitiesRef.current[index] = el}
                className={`hover-item ${activeIndex === index ? 'active' : ''}`}
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="services-two__single">
                  <div className="services-two__single-inner">
                    <div className="services-two__content-box">
                      <h3>
                        <a href="#">{facility.title}</a>
                      </h3>
                    </div>

                    <div className="services-two__count"></div>
                  </div>

                  <div className="services-two__read-more">
                    <a href="#">
                      <FaPlus />
                    </a>
                  </div>
                </div>

                {/* Hover image box - show when active or hovered */}
                <div className={`hover-item__box ${activeIndex === index ? 'visible' : ''}`}>
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="hover-item__box-img"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Facilities;