import React from "react";
import {
  FaHeartbeat,
  FaBaby,
  FaUserNurse,
  FaHospital,
  FaStethoscope,
  FaShieldAlt,
} from "react-icons/fa";

import img from "../../../assets/speciality/obstetricsandmaternity.png";

import "./ObstetricsAndMaternity.css";

const ObstetricsAndMaternity = () => {
  return (
    <section className="obstetrics-maternity-section py-5">
      <div className="container">
        {/* Header */}
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="section-title">
              {/* <span className="section-badge">
              Obstetrics & Maternity Care
            </span> */}
              <h2 className="section-title mt-3"> Expert Pregnancy Care </h2>
              <p className="section-description">
                Providing comprehensive care throughout pregnancy, childbirth,
                and motherhood with compassion, expertise, and personalized
                support.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <img src={img} style={{ borderRadius: "10px" }} alt="" />
          </div>
        </div>

        {/* Services */}
        <div className="row g-4 mt-4">
          {/* Antenatal Care */}
          <div className="col-lg-6">
            <div className="service-card h-100">
              <div className="icon-box">
                <FaHeartbeat />
              </div>

              <h4>Antenatal Care</h4>
              <p>
                Regular maternal and fetal monitoring to ensure a healthy
                pregnancy journey.
              </p>
            </div>
          </div>

          {/* High Risk Pregnancy */}
          <div className="col-lg-6">
            <div className="service-card h-100">
              <div className="icon-box">
                <FaShieldAlt />
              </div>

              <h4>High-Risk Pregnancy Care</h4>
              <p className="mb-3">
                Specialized management for complex pregnancy conditions:
              </p>

              <ul className="service-list">
                <li>Gestational Diabetes</li>
                <li>Thyroid Disorders</li>
                <li>Hypertension</li>
                <li>Multiple Pregnancies</li>
              </ul>
            </div>
          </div>

          {/* Delivery Services */}
          <div className="col-lg-8">
            <div className="service-card h-100">
              <div className="icon-box">
                <FaHospital />
              </div>

              <h4>Delivery Services</h4>

              <div className="row mt-3 g-3">
                <div className="col-md-4">
                  <div className="delivery-box">
                    <FaBaby />
                    <span>Normal Delivery</span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="delivery-box">
                    <FaUserNurse />
                    <span>Assisted Delivery</span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="delivery-box">
                    <FaStethoscope />
                    <span>Cesarean Section</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Postnatal Care */}
          <div className="col-lg-4">
            <div className="service-card h-100">
              <div className="icon-box">
                <FaBaby />
              </div>

              <h4>Postnatal Care</h4>

              <p>
                Dedicated support and guidance for both mother and newborn after
                delivery, ensuring a smooth recovery and healthy start.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObstetricsAndMaternity;
