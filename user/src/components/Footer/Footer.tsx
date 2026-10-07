import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

import {
  FaXTwitter,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

import logo from "../../assets/logo.svg";
import footerShape from "../../assets/home/footer-one-shape.png";

const Footer = () => {
  const navigate = useNavigate();

  const handleBookAppointment = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (token) {
      navigate("/#appointment-section");
      const element = document.getElementById("appointment-form-wrapper") || document.getElementById("appointment-section");
      if (element) {
        const headerHeight = 90; // Offset for sticky navbar
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerHeight - 20,
          behavior: "smooth",
        });
        const nameInput = document.getElementById("pasentname");
        if (nameInput) {
          (nameInput as HTMLInputElement).focus();
        }
      }
    } else {
      navigate("/login", { state: { from: "/#appointment-section" } });
    }
  };

  const handleSpecialitiesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      const element = document.getElementById("specialities");
      if (element) {
        const headerHeight = 90;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerHeight - 20,
          behavior: "smooth",
        });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById("specialities");
        if (element) {
          const headerHeight = 90;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerHeight - 20,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  return (
    <footer className="main-footer footer-style-one">
      <div className="outer-box">
        {/* Footer Left */}
        <div className="footer-left">
          <div className="logo">
            <a href="/">
              <img src={logo} alt="Logo" style={{ width: "160px" }} />
            </a>
          </div>

          <button className="back-top-btn mobile-nav-toggler">
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              <circle cx="1.5" cy="9.5" r="1.5" fill="white" />
              <circle cx="1.5" cy="17.5" r="1.5" fill="white" />
              <circle cx="9.5" cy="1.5" r="1.5" fill="white" />
              <circle cx="9.5" cy="9.5" r="1.5" fill="white" />
              <circle cx="9.5" cy="17.5" r="1.5" fill="white" />
              <circle cx="17.5" cy="1.5" r="1.5" fill="white" />
              <circle cx="17.5" cy="9.5" r="1.5" fill="white" />
              <circle cx="17.5" cy="17.5" r="1.5" fill="white" />
            </svg>
          </button>
        </div>

        <div className="row g-0 w-100">
          {/* Left Column */}
          <div className="col-xl-8 left-column order-2 order-xl-1">
            <div className="footer-top">
              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="info-item">
                    <ul>
                      <li>
                        <span className="fticon">
                          <FaPhone style={{ rotate: "90deg" }} />
                        </span>
                      </li>
                      <li>
                        <span>Call Us:</span>
                        <h5 className="title"> +91 44 42061148,</h5>
                        <h5 className="title"> +91 44 35512486,</h5>
                        <h5 className="title"> +91 94444 79090,</h5>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="info-item">
                    <ul>
                      <li>
                        <span className="fticon">
                          <FaEnvelope />
                        </span>
                      </li>
                      <li>
                        <span>Email Us:</span>
                        <h5 className="title">
                          <a href="mailto:srisaisubhramaniyahospitals@gmail.com">
                            srisaisubhramaniyahospitals@gmail.com
                          </a>
                        </h5>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Widgets */}
            <div className="widgets-section">
              <div className="row g-4">
                {/* Quick Links (First Column) */}
                <div className="col-lg-4 col-md-6 footer-column">
                  <div className="footer-widget links-widget">
                    <h4 className="widget-title">Quick Links</h4>

                    <div className="widget-content">
                      <ul className="user-links">
                        <li>
                          <Link to="/">Home</Link>
                        </li>
                        <li>
                          <Link to="/about">About Us</Link>
                        </li>
                        <li>
                          <Link to="/facilities">Our Facilities</Link>
                        </li>
                        <li>
                          <a href="/#specialities" onClick={handleSpecialitiesClick}>
                            Our Specialities
                          </a>
                        </li>
                        <li>
                          <Link to="/contactus">Contact Us</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Address (Second Column) */}
                <div className="col-lg-4 col-md-6 footer-column">
                  <div className="footer-widget links-widget">
                    <h4 className="widget-title">Address</h4>

                    <div className="content">
                      <p className="footer-address-text">
                        # 35,36, Masilamaneeswarar Nagar, Thirumullaivoyal,
                        Chennai-600062
                      </p>
                    </div>

                    <ul className="footer-nav">
                      <li>
                        <a href="/" aria-label="Facebook">
                          <FaFacebookF />
                        </a>
                      </li>

                      <li>
                        <a href="/" aria-label="Twitter">
                          <FaXTwitter />
                        </a>
                      </li>

                      <li>
                        <a href="/" aria-label="Whatsapp">
                          <FaWhatsapp />
                        </a>
                      </li>

                      <li>
                        <a href="/" aria-label="Instagram">
                          <FaInstagram />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Legal & Policies (Third Column) */}
                <div className="col-lg-4 col-md-6 footer-column">
                  <div className="footer-widget links-widget">
                    <h4 className="widget-title">Legal & Policies</h4>

                    <div className="widget-content">
                      <ul className="user-links">
                        <li>
                          <Link to="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link to="/terms-and-conditions">Terms & Conditions</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
              <p className="copyright-text">
                Copyright © 2026 Sri Sai Subhramaniya Hospitals | All Rights
                Reserved | Designed by{" "}
                <a href="https://wisewebtek.com/" target="_blank" rel="noopener noreferrer">
                  WiseWebTek
                </a>
                .
              </p>
              {/* <div className="footer-bottom-legal">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <span className="legal-dot">•</span>
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </div> */}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-xl-4 right-column order-1 order-xl-2">
            <div className="inner-column">
              <h3 className="title">
                Expert Care for
                <br />
                Health & Wellness
              </h3>

              <a className="circle-btn" href="/#appointment-section" onClick={handleBookAppointment}>
                Book Appointment
                <FaArrowUpRightFromSquare />
              </a>

              <div className="mt-10">
                <h5 className="time">Consultation Hours</h5>
                <h5 className="date">09:00 Am – 10:30 Pm</h5>
              </div>
            </div>

            <div className="shape">
              <img src={footerShape} alt="Footer Shape" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
