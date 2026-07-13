import "./Facilities.css"; // optional, for custom styles
import PageBanner from "../PageBanner/PageBanner";

import fecility1 from "../../assets/home/facilities/1.jpg";
import fecility2 from "../../assets/home/facilities/2.jpg";
import fecility3 from "../../assets/home/facilities/3.jpg";
import fecility4 from "../../assets/home/facilities/4.jpg";
import fecility5 from "../../assets/home/facilities/5.jpg";
import fecility6 from "../../assets/home/facilities/6.jpg";
import fecility7 from "../../assets/home/facilities/7.jpg";
import fecility8 from "../../assets/home/facilities/8.jpg";
import fecility9 from "../../assets/home/facilities/9.jpg";

import { FaLink } from "react-icons/fa";

const Facilities = () => {
  const portfolioItems = [
    {
      id: 1,
      img: fecility1,
      title: "Clinical Laboratory",
    },
    {
      id: 2,
      img: fecility2,
      title: "Pharmacy",
    },
    {
      id: 3,
      img: fecility3,
      title: "Digital X-Ray",
    },
    {
      id: 4,
      img: fecility4,
      title: "Ultrasound Scan",
    },
    {
      id: 5,
      img: fecility5,
      title: "ICU & NICU",
    },
    {
      id: 6,
      img: fecility6,
      title: "Modular Operation Theatre",
    },
        {
      id: 7,
      img: fecility7,
      title: "ECG Services",
    },
        {
      id: 8,
      img: fecility8,
      title: "Labour Room",
    },
        {
      id: 9,
      img: fecility9,
      title: "Ventilator Support",
    },
  ];


  return (
    <>
      <PageBanner title="Our Facilities" />
    <section className="   section-space">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="section-title">
              <h2 className="text-center">Our facilities</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container ">
        <div className="row">
          {portfolioItems.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <div className="prt-featured-postbox style2">
                <div className="prt-featured-post-item">
                  <div className="prt-featured-thumbnail">
                    <img
                      className="img-fluid border-rad_10"
                      src={item.img}
                      alt={item.title}
                    />
                  </div>
                  <div className="btn-overly">
                    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FaLink style={{ fontSize: "18px", color: "#0F2239" }} />
                    </a>
                  </div>
                  <div className="prt-featured-overly">
                    <div className="prt-featured-content-box">
                      {/* <div className="prt-featured-category">
                        <p>{item.category}</p>
                      </div> */}
                      <div className="prt-featured-title">
                        <a href="#">
                          <h3>{item.title}</h3>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default Facilities;
