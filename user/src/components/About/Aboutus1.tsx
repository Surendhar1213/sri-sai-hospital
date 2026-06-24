import React from "react";
import "./AboutUs.css";

import About1 from "../../assets/about/about.png"
const AboutUs = () => {
  return (
    <section className="about-us-section" style={{ backgroundImage: `url(${About1})`, backgroundSize: "cover", backgroundPosition: "center", }}>
      <div className="container">
        <div className="about-wrapper">

          {/* Left Content */}
          <div className="about-content">
            <span className="about-tag">ABOUT US</span>

            <h2 className="about-title">
              Caring for <br />
              <span>Women, Families & Communities</span>
            </h2>

            <p>
              Srisai Subramaniya Hospital was established with the vision of
              delivering accessible, ethical, and advanced healthcare services.
            </p>

            <p>
              Our hospital combines modern medical technology with
              compassionate patient-centered care to provide comprehensive
              healthcare solutions.
            </p>

            <div className="mission-vision">
              <div className="info-card">
                <div className="icon-circle">
                  <i className="fas fa-bullseye"></i>
                </div>

                <h3>Our Mission</h3>

                <p>
                  To improve the health and quality of life of every patient
                  through excellence in medical care, innovation, and
                  compassion.
                </p>
              </div>

              <div className="info-card">
                <div className="icon-circle purple">
                  <i className="fas fa-eye"></i>
                </div>

                <h3>Our Vision</h3>

                <p>
                  To become one of Chennai's most trusted centers for women's
                  health, infertility treatment, pregnancy care, and
                  multi-speciality healthcare.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="about-image">
            {/* <img
              src={About1}
              alt="Hospital Care"
            /> */}
          </div>
        </div>


      </div>
    </section>
  );
};

export default AboutUs;