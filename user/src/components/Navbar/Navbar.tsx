import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaAngleDown,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaClock,
  FaPhoneAlt,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { IoMdMail } from "react-icons/io";

import Logo from "../../assets/logo.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenSubMenus({}); // Reset all submenus when closing mobile menu
  };

  const toggleSubMenu = (menuKey) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const SubMenuToggle = ({ onClick }) => (
    <span className="th-mean-expand" onClick={onClick}>
      <FaAngleDown />
    </span>
  );

  return (
    <>
      {/* Mobile Menu Wrapper */}
      <div
        className={`th-menu-wrapper ${isMobileMenuOpen ? "th-body-visible" : ""}`}
      >
        <div className="th-menu-area text-center">
          <button className="th-menu-toggle" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
          <div className="mobile-logo">
            <a href="#">
              <img src={Logo} style={{ Width: "200px" }} alt="Logo" />
            </a>
          </div>
          <div className="th-mobile-menu">
            <ul>
              <li className="menu-item-has-children">
                <a href="#">Home</a>
              </li>
              <li className="menu-item-has-children">
                <Link to="/about">About us</Link>
              </li>
              <li className="menu-item-has-children">
                <a href="#"> Services </a>
                <SubMenuToggle onClick={() => toggleSubMenu("teachers")} />
                <ul
                  className={`sub-menu th-submenu ${openSubMenus.teachers ? "th-open" : ""}`}
                  style={{ display: openSubMenus.teachers ? "block" : "none" }}
                >
                  <li>
                    <a href="#">Instructors</a>
                  </li>
                  <li>
                    <a href="#">Instructors Details</a>
                  </li>
                </ul>
              </li>
              <li className="menu-item-has-children">
                <a href="#">Gallery</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="th-header header-layout1">
        <div className="header-top">
          <div className="container">
            <div className="row justify-content-center justify-content-lg-between align-items-center gy-2">
              <div className="col-auto d-none d-lg-block">
                <div className="header-links">
                  <ul>
                    <li>
                      <FaPhoneAlt />
                      <a href="tel:+914426378138">+91 44-26378138</a>
                    </li>
                    <li className="d-none d-xl-inline-block">
                      <IoMdMail />
                      <a href="mailto:srisaisubhramaniyahospitals@gmail.com">
                        srisaisubhramaniyahospitals@gmail.com
                      </a>
                    </li>
                    <li>
                      <FaClock />
                      Mon - Sat: 8:00 - 15:00
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-auto">
                <div className="header-links header-right">
                  <ul>
                    <li>
                      <div className="header-social">
                        <span className="social-title">Follow Us:</span>
                        <a href="#">
                          <FaFacebookF />
                        </a>
                        <a href="#">
                          <FaTwitter />
                        </a>
                        <a href="#">
                          <FaLinkedinIn />
                        </a>
                        <a href="#">
                          <FaInstagram />
                        </a>
                        <a href="#">
                          <FaYoutube />
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`sticky-wrapper ${isSticky ? "sticky" : ""}`}>
          <div className="menu-area">
            <div className="container">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                  <div className="header-logo">
                    <a href="#">
                      <img src={Logo} style={{ Width: "200px" }} alt="Logo" />
                    </a>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="row">
                    <div className="col-auto">
                      <nav className="main-menu d-none d-lg-inline-block">
                        <ul>
                          <li>
                            <Link to="/">Home</Link>
                          </li>
                          <li>
                            <Link to="/about">About us</Link>
                          </li>
                          <li>
                            <Link to="/facilities">Our facilities</Link>
                          </li>
                          {/* <li className="menu-item-has-children">
                            <a href="#">Pages <FaAngleDown /></a>
                            <ul className="sub-menu">
                              <li><a href="about.html">About Us</a></li>
                              <li className="menu-item-has-children">
                                <a href="#">Shop</a>
                                <ul className="sub-menu">
                                  <li><a href="#">Shop</a></li>
                                </ul>
                              </li>
                              <li><a href="#">Events</a></li>
                              <li><a href="#">Event Details</a></li>
                              <li><a href="#">Gallery</a></li>
                              <li><a href="#">Error Page</a></li>
                            </ul>
                          </li> */}
                          <li className="menu-item-has-children">
                            <a href="#">
                              Our speciality
                              <FaAngleDown className="dropdown-icon" />
                            </a>

                            <ul className="sub-menu">
                              <li>
                                <Link to="/gynecology">
                                  Gynecology & Women's Health
                                </Link>
                              </li>
                              <li>
                                <Link to="/fertility">
                                  Infertility & Fertility
                                </Link>
                              </li>
                              <li>
                                <Link to="/obstetricsandmaternity">
                                  Obstetrics & Maternity
                                </Link>
                              </li>
                              <li>
                                <Link to="/PelvicFloor">
                                  Pelvic Floor Rehabilitation
                                </Link>
                              </li>
                              <li>
                                <Link to="/WomensIntimateWellness">
                                  Women's Intimate Wellness
                                </Link>
                              </li>
                              <li>
                                <Link to="/endocrinology">Endocrinology</Link>
                              </li>
                              <li>
                                <Link to="/obesityandweightloss">
                                  Obesity & Weight Loss
                                </Link>
                              </li>
                              <li>
                                <Link to="/diabetology">Diabetology</Link>
                              </li>
                              <li>
                                <Link to="/dermatology">
                                  Dermatology & Cosmetology
                                </Link>
                              </li>
                              <li>
                                <Link to="/hairandnail">
                                  Hair & Nail Clinic
                                </Link>
                              </li>
                              <li>
                                <Link to="/urology">Urology</Link>
                              </li>
                              <li>
                                <Link to="/generalmedicine">
                                  General Medicine
                                </Link>
                              </li>
                            </ul>
                          </li>

                          <li>
                            <Link to="/doctors">Doctors</Link>
                          </li>
                          <li>
                            <Link to="/gallery">Gallery</Link>
                          </li>
                          <li>
                            <Link to="/contactus">Contact us</Link>
                          </li>
                        </ul>
                      </nav>
                      <button
                        type="button"
                        className="th-menu-toggle d-block d-lg-none"
                        onClick={toggleMobileMenu}
                      >
                        <FaBars />
                      </button>
                    </div>
                    <div className="col-auto d-none d-xl-block">
                      <div className="header-button hero-section-four ">
                        <div className="  hero-button hero-btn">
                          <a
                            href="/about"
                            style={{
                              padding: "8px 12px 10px 25px",
                              marginBottom: "0px",
                            }}
                          >
                            Book Appointment
                            <span className="hero-icon">
                              <FaArrowRight />
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
