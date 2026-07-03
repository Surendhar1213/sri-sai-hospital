import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
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
  FaSignOutAlt,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";

import { IoMdMail } from "react-icons/io";

import Logo from "../../assets/logo.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  // Check login state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      const userInfo = localStorage.getItem("userInfo");
      if (token) {
        setIsLoggedIn(true);
        if (userInfo) {
          const user = JSON.parse(userInfo);
          setUserName(user.name?.split(" ")[0] || "User");
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

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

  // Book Appointment click handler
  const handleBookAppointment = () => {
    if (isLoggedIn) {
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenSubMenus({}); // Reset all submenus when closing mobile menu
  };

  const toggleSubMenu = (menuKey: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const SubMenuToggle = ({ onClick }: { onClick: () => void }) => (
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
              <img src={Logo} style={{ width: "200px" }} alt="Logo" />
            </a>
          </div>
          <div className="th-mobile-menu">
            <ul>
              <li>
                <Link to="/" onClick={toggleMobileMenu}>Home</Link>
              </li>
              <li>
                <Link to="/about" onClick={toggleMobileMenu}>About us</Link>
              </li>
              <li>
                <Link to="/facilities" onClick={toggleMobileMenu}>Our facilities</Link>
              </li>
              <li className="menu-item-has-children">
                <a href="#" onClick={(e) => { e.preventDefault(); toggleSubMenu("specialities"); }}>Our speciality</a>
                <SubMenuToggle onClick={() => toggleSubMenu("specialities")} />
                <ul
                  className={`sub-menu th-submenu ${openSubMenus.specialities ? "th-open" : ""}`}
                  style={{ display: openSubMenus.specialities ? "block" : "none" }}
                >
                  <li><Link to="/gynecology" onClick={toggleMobileMenu}>Gynecology</Link></li>
                  <li><Link to="/fertility" onClick={toggleMobileMenu}>Fertility</Link></li>
                  <li><Link to="/obstetricsandmaternity" onClick={toggleMobileMenu}>Obstetrics & Maternity</Link></li>
                  <li><Link to="/PelvicFloor" onClick={toggleMobileMenu}>Pelvic Floor Clinic</Link></li>
                  <li><Link to="/WomensIntimateWellness" onClick={toggleMobileMenu}>Women's Intimate Wellness</Link></li>
                  <li><Link to="/endocrinology" onClick={toggleMobileMenu}>Endocrinology</Link></li>
                  <li><Link to="/obesityandweightloss" onClick={toggleMobileMenu}>Obesity & Weight Loss</Link></li>
                  <li><Link to="/diabetology" onClick={toggleMobileMenu}>Diabetology</Link></li>
                  <li><Link to="/dermatology" onClick={toggleMobileMenu}>Dermatology & Cosmetology</Link></li>
                  <li><Link to="/hairandnail" onClick={toggleMobileMenu}>Hair & Nail Clinic</Link></li>
                  <li><Link to="/urology" onClick={toggleMobileMenu}>Urology</Link></li>
                  <li><Link to="/generalmedicine" onClick={toggleMobileMenu}>General Medicine</Link></li>
                </ul>
              </li>
              <li>
                <Link to="/doctors" onClick={toggleMobileMenu}>Doctors</Link>
              </li>
              <li>
                <Link to="/gallery" onClick={toggleMobileMenu}>Gallery</Link>
              </li>
              <li>
                <Link to="/contactus" onClick={toggleMobileMenu}>Contact us</Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
                    <Link to="/profile" onClick={toggleMobileMenu} style={{ color: "#3F59FF", fontWeight: "700" }}>
                      My Dashboard ({userName.charAt(0).toUpperCase()})
                    </Link>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleMobileMenu(); handleLogout(); }} style={{ color: "#EF4444" }}>
                      Log Out
                    </a>
                  </li>
                </>
              ) : (
                <li style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
                  <Link to="/login" onClick={toggleMobileMenu} style={{ color: "#3F59FF", fontWeight: "700" }}>
                    Log In / Register
                  </Link>
                </li>
              )}
              <li style={{ marginTop: "15px", listStyleType: "none" }}>
                <button
                  onClick={() => { toggleMobileMenu(); handleBookAppointment(); }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "linear-gradient(90deg, #3F58FF 0%, #31B0FF 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Book Appointment
                </button>
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
                      <a href="tel:+914426378138">+91 94444 79090</a>
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
              <div className="row align-items-center justify-content-between flex-nowrap">
                <div className="col-auto">
                  <div className="header-logo">
                    <a href="#">
                      <img src={Logo} className="header-logo-img" alt="Logo" />
                    </a>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="row align-items-center flex-nowrap">
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
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* Book Appointment (Mobile/Tablet View) */}
                        <button
                          onClick={handleBookAppointment}
                          className="d-inline-flex d-xl-none mobile-book-btn"
                          style={{
                            padding: "8px 16px",
                            background: "linear-gradient(90deg, #3F58FF 0%, #31B0FF 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          Book Appointment
                        </button>

                        {/* User Profile Avatar (Mobile/Tablet View) */}
                        {isLoggedIn && (
                          <div className="d-block d-xl-none" style={{ padding: 0, margin: 0, display: "inline-flex" }}>
                            <Link
                              to="/profile"
                              title="Go to Patient Dashboard"
                              style={{ textDecoration: "none", display: "inline-flex" }}
                            >
                              <button
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  minWidth: "38px",
                                  minHeight: "38px",
                                  borderRadius: "50%",
                                  background: "linear-gradient(135deg, #3F59FF 0%, #31B0FF 100%)",
                                  color: "#FFFFFF",
                                  border: "1.5px solid #FFFFFF",
                                  fontSize: "13px",
                                  fontWeight: "800",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 0 0 1.5px rgba(63, 89, 255, 0.15), 0 6px 12px rgba(63, 89, 255, 0.15)",
                                  position: "relative",
                                  padding: 0,
                                  margin: 0
                                }}
                              >
                                {userName.charAt(0).toUpperCase()}
                              </button>
                            </Link>
                          </div>
                        )}

                        {/* Mobile Hamburger Toggle */}
                        <button
                          type="button"
                          className="th-menu-toggle d-block d-lg-none"
                          onClick={toggleMobileMenu}
                          style={{ margin: 0 }}
                        >
                          <FaBars />
                        </button>
                      </div>
                    </div>
                    <div className="col-auto d-none d-xl-block">
                      <div className="header-button hero-section-four">
                        <div className="hero-button hero-btn" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={handleBookAppointment}
                            style={{
                              padding: "8px 12px 10px 25px",
                              marginBottom: "0px",
                              background: "linear-gradient(90deg, #3F58FF 0%, #31B0FF 100%)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50px",
                              fontSize: "15px",
                              fontWeight: "600",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              fontFamily: "inherit",
                              transition: "opacity 0.2s, transform 0.2s",
                            }}
                          >
                            Book Appointment
                            <span className="hero-icon">
                              <FaArrowRight />
                            </span>
                          </button>
                          {/* Premium User Avatar - Direct Link to /profile */}
                          {isLoggedIn && (
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: 0, margin: 0 }}>
                              <Link
                                to="/profile"
                                title="Go to Patient Dashboard"
                                style={{
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  padding: 0,
                                  margin: 0,
                                  border: "none",
                                  background: "none"
                                }}
                              >
                                <button
                                  style={{
                                    width: "44px",
                                    height: "44px",
                                    minWidth: "44px",
                                    minHeight: "44px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #3F59FF 0%, #31B0FF 100%)",
                                    color: "#FFFFFF",
                                    border: "2px solid #FFFFFF",
                                    fontSize: "16px",
                                    fontWeight: "800",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 0 0 2px rgba(63, 89, 255, 0.15), 0 8px 16px rgba(63, 89, 255, 0.15)",
                                    transition: "all 0.3s ease",
                                    position: "relative",
                                    padding: "0 !important",
                                    margin: "0 !important",
                                    boxSizing: "border-box"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(63, 89, 255, 0.25), 0 12px 20px rgba(63, 89, 255, 0.25)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 0 0 2px rgba(63, 89, 255, 0.15), 0 8px 16px rgba(63, 89, 255, 0.15)";
                                  }}
                                >
                                  {userName.charAt(0).toUpperCase()}
                                  <span style={{
                                    position: "absolute",
                                    bottom: "2px",
                                    right: "2px",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: "#10B981",
                                    border: "1.5px solid #FFFFFF",
                                    boxShadow: "0 0 8px #10B981"
                                  }} />
                                </button>
                              </Link>
                            </div>
                          )}
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
