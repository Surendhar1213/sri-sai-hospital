import React, { useEffect, useRef } from "react";
import { FaStar, FaPlus } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

import About1 from "../../../assets/home/about/about-us-image-1.jpg";
import About2 from "../../../assets/home/about/about-us-image-2.jpg";
import Aboutauthor1 from "../../../assets/home/about/author-1.jpg";
import Aboutauthor2 from "../../../assets/home/about/author-2.jpg";
import Aboutauthor3 from "../../../assets/home/about/author-3.jpg";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const imageBoxRef = useRef(null);
  // const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const reviewBoxRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const bodyRef = useRef(null);
  const buttonRef = useRef(null);
  const clientImagesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - set elements to hidden
      // gsap.set([image1Ref.current, image2Ref.current, reviewBoxRef.current], {
      //   opacity: 0,
      //   scale: 0.8,
      //   y: 50,
      // });

      // gsap.set(
      //   [subtitleRef.current, headingRef.current, descriptionRef.current],
      //   {
      //     opacity: 0,
      //     y: 60,
      //   },
      // );

      gsap.set(bodyRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
      });

      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.set(clientImagesRef.current, {
        opacity: 0,
        x: -30,
      });

      // Main timeline for images with stagger
      const imageTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: imageBoxRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      imageTimeline
        .to(reviewBoxRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        // .to(
        //   image1Ref.current,
        //   {
        //     opacity: 1,
        //     scale: 1,
        //     y: 0,
        //     duration: 0.8,
        //     ease: "power3.out",
        //   },
        //   "-=0.4"
        // )
        .to(
          image2Ref.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        );

      // Client images stagger animation
      const clientImages = clientImagesRef.current?.querySelectorAll(
        ".satisfy-client-image",
      );
      if (clientImages) {
        gsap.fromTo(
          clientImages,
          {
            opacity: 0,
            scale: 0.5,
            rotation: -10,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: reviewBoxRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Content animation timeline
      const contentTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 75%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      contentTimeline
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .to(
          bodyRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2",
        );

      // Add hover animations for images
      // if (image1Ref.current) {
      //   image1Ref.current.addEventListener("mouseenter", () => {
      //     gsap.to(image1Ref.current, {
      //       scale: 1.05,
      //       duration: 0.4,
      //       ease: "power2.out",
      //     });
      //   });
      //   image1Ref.current.addEventListener("mouseleave", () => {
      //     gsap.to(image1Ref.current, {
      //       scale: 1,
      //       duration: 0.4,
      //       ease: "power2.out",
      //     });
      //   });
      // }

      if (image2Ref.current) {
        image2Ref.current.addEventListener("mouseenter", () => {
          gsap.to(image2Ref.current, {
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
          });
        });
        image2Ref.current.addEventListener("mouseleave", () => {
          gsap.to(image2Ref.current, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      }

      // Button pulse animation
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Floating animation for review box
      if (reviewBoxRef.current) {
        gsap.to(reviewBoxRef.current, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Parallax effect for images on scroll
      // if (image1Ref.current) {
      //   gsap.to(image1Ref.current, {
      //     y: 30,
      //     scrollTrigger: {
      //       trigger: sectionRef.current,
      //       start: "top bottom",
      //       end: "bottom top",
      //       scrub: 1,
      //     },
      //   });
      // }

      if (image2Ref.current) {
        gsap.to(image2Ref.current, {
          y: -30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Star rating animation
      const stars = document.querySelectorAll(".hero-info-rating-star svg");
      stars.forEach((star, index) => {
        gsap.fromTo(
          star,
          {
            scale: 0,
            rotate: -180,
          },
          {
            scale: 1,
            rotate: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: reviewBoxRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div className="about-us section-space" ref={sectionRef}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6">
            {/* About Us Image Box Start */}
            <div className="about-us-image-box wow fadeInUp" ref={imageBoxRef}>
              {/* About Us Image Box 1 Start */}
              <div className="about-us-image-box-1">
                {/* Happy Customer Review Box Start */}
                <div className="happy-customer-review-box">
                  <div className="happy-customer-review-item">
                    {/* Hero Info Rating Star Start */}
                    <div className="hero-info-rating-star">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    {/* Hero Info Rating Star End */}

                    {/* Happy Customer Review Content Start */}
                    <div className="happy-customer-review-content">
                      <p>Happy Customer Reviews 5000+</p>
                    </div>
                    {/* Happy Customer Review Content End */}

                    {/* Satisfy Client Images Start */}
                    <div className="satisfy-client-images">
                      <div className="satisfy-client-image">
                        <figure className="image-anime">
                          <img src={Aboutauthor1} alt="Client 1" />
                        </figure>
                      </div>

                      <div className="satisfy-client-image">
                        <figure className="image-anime">
                          <img src={Aboutauthor2} alt="Client 2" />
                        </figure>
                      </div>

                      <div className="satisfy-client-image">
                        <figure className="image-anime">
                          <img src={Aboutauthor3} alt="Client 3" />
                        </figure>
                      </div>

                      <div className="satisfy-client-image add-more">
                        <FaPlus />
                      </div>
                    </div>
                    {/* Satisfy Client Images End */}
                  </div>
                </div>
                {/* Happy Customer Review Box End */}

                {/* About Us Image Start */}
                <div className="about-us-image">
                  <figure className="image-anime">
                    <img src={About1} alt="Hospital interior" />
                  </figure>
                </div>
                {/* About Us Image End */}
              </div>
              {/* About Us Image Box 1 End */}

              {/* About Us Image Box 2 Start */}
              <div className="about-us-image-box-2">
                <div className="about-us-image">
                  <figure className="image-anime">
                    <img src={About2} alt="Hospital facility" />
                  </figure>
                </div>
              </div>
              {/* About Us Image Box 2 End */}
            </div>
            {/* About Us Image Box End */}
          </div>

          <div className="col-xl-6">
            {/* About Us Content Start */}
            <div className="about-us-content" ref={contentRef}>
              {/* Section Title Start */}
              <div className="section-title">
                <div className="section-title">
                  <h3 className="wow fadeInUp">Welcome to Srisai Subramaniya Hospital</h3>
                  <h2
                    className="text-anime-style-3"
                    data-cursor="-opaque"
                    ref={headingRef}
                  >
                    Excellence in Women's Health & Multi-Speciality Care
                  </h2>
                </div>

                <p
                  className="wow fadeInUp"
                  data-wow-delay="0.2s"
                  ref={descriptionRef}
                >
                  Srisai Subramaniya Hospital is a trusted healthcare
                  destination in Chennai, dedicated to providing comprehensive
                  medical care with a strong focus on women's health. Our
                  experienced specialists offer advanced treatment solutions for
                  gynecological conditions, infertility, hormonal disorders,
                  obesity, diabetes, skin concerns, and general healthcare
                  needs.
                </p>
              </div>
              {/* Section Title End */}

              {/* About Us Body Start */}
              <div
                className="about-us-body wow fadeInUp"
                data-wow-delay="0.6s"
                ref={bodyRef}
              >
                <div className="about-us-body-item">
                  <h3>
                    We combine compassionate care, modern technology, and
                    evidence-based treatment to help our patients achieve better
                    health outcomes.
                  </h3>
                </div>
              </div>
              {/* About Us Body End */}

              {/* About Us Button Start */}
              <div className="about-us-btn wow fadeInUp" data-wow-delay="0.8s">
                <a className="thm-btn consulting-btn" href="#">
                  <span className="btn_label" data-text="More About Us">
                    More About Us
                  </span>
                  <span className="xb-arrow">
                    <svg
                      width="29"
                      height="29"
                      viewBox="0 0 29 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="5.30933"
                        y="20.2019"
                        width="21.557"
                        height="2.73739"
                        transform="rotate(-40.2798 5.30933 20.2019)"
                        fill="black"
                      />
                      <rect
                        x="8.35352"
                        y="6.85798"
                        width="2.73739"
                        height="2.73739"
                        transform="rotate(-40.2798 8.35352 6.85798)"
                        fill="black"
                      />
                      <rect
                        x="12.2114"
                        y="7.17609"
                        width="2.73739"
                        height="2.73739"
                        transform="rotate(-40.2798 12.2114 7.17609)"
                        fill="black"
                      />
                      <rect
                        x="16.0696"
                        y="7.49451"
                        width="2.73739"
                        height="2.73739"
                        transform="rotate(-40.2798 16.0696 7.49451)"
                        fill="black"
                      />
                      <rect
                        x="19.6093"
                        y="11.671"
                        width="2.73739"
                        height="2.73739"
                        transform="rotate(-40.2798 19.6093 11.671)"
                        fill="black"
                      />
                      <rect
                        x="19.2911"
                        y="15.5297"
                        width="2.73739"
                        height="2.73739"
                        transform="rotate(-40.2798 19.2911 15.5297)"
                        fill="black"
                      />
                      <rect
                        x="18.9723"
                        y="19.3876"
                        width="2.73739"
                        height="2.73739"
                        transform="rotate(-40.2798 18.9723 19.3876)"
                        fill="black"
                      />
                    </svg>
                  </span>
                </a>
              </div>
              {/* About Us Button End */}
            </div>
            {/* About Us Content End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
