import React from "react";
import bannerImg from "../../assets/speciality/obstetricsandmaternity.png";

interface PageBannerProps {
  title: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ title }) => {
  return (
    <section className="pages-hero">
      <img
        src={bannerImg}
        alt={title}
        className="pages-hero-image"
      />
      <div className="pages-hero-overlay" />

      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="pages-hero-content">
              <h1 className="pages-hero-title">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageBanner;
