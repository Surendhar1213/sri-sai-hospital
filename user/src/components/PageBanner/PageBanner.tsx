import React from "react";
import { Link } from "react-router-dom";
import bannerImg from "../../assets/speciality/obstetricsandmaternity.png";

interface PageBannerProps {
  title: string;
  bgImage?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, bgImage }) => {
  return (
    <section className="pages-hero">
      <img
        src={bgImage || bannerImg}
        alt={title}
        className="pages-hero-image"
      />
      <div className="pages-hero-overlay" />

      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="pages-hero-content">
              <h1 className="pages-hero-title">{title}</h1>
              <nav className="pages-hero-breadcrumb" aria-label="breadcrumb">
                <ol className="breadcrumb-list">
                  <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-link">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-separator">/</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageBanner;
