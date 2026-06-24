import React, { useState } from "react";
import "./Appointment.css"; // We'll create this CSS file for styles

import image1 from "../../../assets/home/appointment/proj-1.jpg";
import image2 from "../../../assets/home/appointment/proj-2.jpg";
import image3 from "../../../assets/home/appointment/proj-3.jpg";
import image4 from "../../../assets/home/appointment/proj-4.jpg";

const Appointment = () => {
  const [formData, setFormData] = useState({
    pasentname: "",
    appointmenttime: "",
    docotrlist: "Choose Doctor...",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const doctors = [
    "Choose Doctor...",
    "Dr. Daisy Bins",
    "Dr. Richard Kyle",
    "Dr. Sophia Ava",
    "Dr. James charlie",
    "Dr. Jerome Bell",
    "Dr. Guy Hawkins",
    "Dr. Aunt Arlene",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        pasentname: "",
        appointmenttime: "",
        docotrlist: "Choose Doctor...",
      });
    }, 1500);
  };

  return (
    <div className="my-bd  ">
      <div className="adjust_section">
        {/* about start */}
        <div className="container appointments section-space pt-80">
          <div className="cg-about-wrap">
            <div className="cg-about-img">
              <div
                className="wow fadeInRight"
                data-wow-delay="0ms"
                data-wow-duration="500ms"
              >
                <img src={image1} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div
                className="wow fadeInRight"
                data-wow-delay="100ms"
                data-wow-duration="500ms"
              >
                <img src={image2} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div
                className="wow fadeInRight"
                data-wow-delay="200ms"
                data-wow-duration="500ms"
              >
                <img src={image3} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div
                className="wow fadeInRight"
                data-wow-delay="300ms"
                data-wow-duration="500ms"
              >
                <img src={image4} alt="image" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="cg-about-top">
                <div className="section-title mb-130">
                  {/* <span className="sub_title">What we do</span> */}
                  <h2 className="title">Request an Appointment</h2>

                  <div
                    className="cg-funfact-wrap"
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      textAlign: "center",
                    }}
                  >
                    <h5 className="cg-funfact-title xb-text-reveal">
                      Need expert medical consultation? Schedule your
                      appointment online and connect with our specialists for
                      timely diagnosis and treatment.
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="appointment-form-wrapper">
            <div className="appointment-form-container">
              <div className="appointment-form-inner">
                <div className="appointment-form-content">
                  <form className="appointment-form" noValidate>
                    <div className="form-row">
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="pasentname"
                            className="form-control"
                            placeholder="Your Name*"
                          />
                        </div>
                      </div>

                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="email"
                            name="pasentmail"
                            className="form-control"
                            placeholder="Your Mail*"
                          />
                        </div>
                      </div>

                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="pasentnumber"
                            className="form-control"
                            placeholder="Your Number*"
                          />
                        </div>
                      </div>

                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="pasentnumber"
                            className="form-control"
                            placeholder="Subject"
                          />
                        </div>
                      </div>

                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="datetime-local"
                            name="appointmenttime"
                            className="form-control date-picker"
                            placeholder="Choose Date"
                          />
                        </div>
                      </div>

                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <select
                            name="docotrlist"
                            className="form-control"
                            value={formData.docotrlist}
                            onChange={handleChange}
                          >
                            {doctors.map((doctor, index) => (
                              <option key={index} value={doctor}>
                                {doctor}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group col-md-6 col-lg-3">
                        <button
                          type="submit"
                          className="btn submit-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner"></span>
                              Submitting...
                            </>
                          ) : (
                            "Make Appointment"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="adjust_shape">
          <img src="assets/img/bg/bg_shapes.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
