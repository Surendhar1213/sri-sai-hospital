// HeroSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { FaArrowRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import "./Heroslider.css";

import HeroBg1 from "../../../assets/home/slider/hero_bg_1_1.jpg";
import HeroBg2 from "../../../assets/home/slider/hero_bg_1_2.png";
import HeroBg3 from "../../../assets/home/slider/hero_bg_1_3.png";

import Hero1 from "../../../assets/home/slider/hero_thumb_1_1.png";
import Hero2 from "../../../assets/home/slider/hero_thumb_1_2.png";
import Hero3 from "../../../assets/home/slider/hero_thumb_1_3.png";

import HeroShape1 from "../../../assets/home/slider/shape_1_1.png";
import HeroShape2 from "../../../assets/home/slider/shape_1_2.png";
import HeroShape3 from "../../../assets/home/slider/shape_1_3.png";
import HeroShape4 from "../../../assets/home/slider/shape_1_4.png";

const slides = [
  {
    bg: HeroBg1,
    img: Hero1,
    title: "Complete Women's Healthcare ",
    highlighted: "Under One Roof.",
    subtitle: "Sri Sai Subhramaniya Hospitals",
    text: "Expert Gynecology, Fertility, Pregnancy Care & Pelvic Wellness Services.",
  },
  {
    bg: HeroBg2,
    img: Hero2,
    title: "Hormonal Wellness, Obesity & ",
    highlighted: "Diabetes Care.",
    subtitle: "Obstetrics & Gynecology Services",
    text: "Advanced Endocrinology, Weight Management & Metabolic Health Solutions.",
  },
  {
    bg: HeroBg3,
    img: Hero3,
    title: "Dermatology, Cosmetology & ",
    highlighted: "Laser Treatments.",
    subtitle: "Multi-Speciality Healthcare",
    text: "Acne Care, Laser Hair Removal, Skin Lightening, Tattoo Removal & Hair Restoration Services.",
  },
];

const Heroslider = () => {
  return (
    <div className="th-hero-wrapper hero-section-four hero-1" id="hero">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={true}
        className="hero-slider-1"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="th-hero-slide">
              {/* Background Image */}
              <div
                className="th-hero-bg"
                style={{
                  backgroundImage: `url(${slide.bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  zIndex: -2,
                }}
              />

              {/* Color Overlay */}
              <div
                className="hero-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: -1,
                }}
              />

              {/* Hero Content */}
              <div className="container">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-6">
                    <div className="hero-style1">
                      {/* <span className="hero-subtitle">
                        <span>Sri Sai Subhramaniya Hospitals</span>
                      </span> */}
                      <h1 className="hero-title text-white">
                        {slide.title}
                        <span className="text-theme">{slide.highlighted}</span>
                      </h1>
                      <p className="hero-text">{slide.text}</p>
                      <div className="hero-button">
                        <div className="hero-btn">
                          <a href="/about">
                            Discover More
                            <span className="hero-icon"><FaArrowRight  /></span>
                            
                          </a>
                        </div>

                        {/* <div className="hero-btn2">
                          <a href="/contact">
                            Get In Touch
                            <span className="hero-icon"><FaArrowRight  /></span>
                          </a>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 text-lg-end text-center">
                    <div className="hero-img1">
                      <img src={slide.img} alt="hero" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shapes */}
              <img className="hero-shape shape1" src={HeroShape1} alt="shape" />
              <img className="hero-shape shape2" src={HeroShape2} alt="shape" />
              <div className="hero-shape shape3"></div>
              <img
                className="hero-shape shape4 shape-mockup jump-reverse"
                src={HeroShape3}
                alt="shape"
                style={{ position: "absolute", right: "3%", bottom: "7%" }}
              />
              <img
                className="hero-shape shape5 shape-mockup jump-reverse"
                src={HeroShape4}
                alt="shape"
                style={{ position: "absolute", left: "0", bottom: "0" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Heroslider;
