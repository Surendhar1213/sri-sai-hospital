import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./Appointment.css"; // We'll create this CSS file for styles

import image1 from "../../../assets/home/appointment/proj-1.jpg";
import image2 from "../../../assets/home/appointment/proj-2.jpg";
import image3 from "../../../assets/home/appointment/proj-3.jpg";
import image4 from "../../../assets/home/appointment/proj-4.jpg";

// Speciality to Doctor Mapping
const SPECIALITY_DOCTORS: Record<string, string[]> = {
  "Gynecology & Women's Health": ["Dr. R. Anuradha"],
  "Infertility & Fertility": ["Dr. R. Anuradha"],
  "Obstetrics & Maternity": ["Dr. R. Anuradha"],
  "Pelvic Floor Rehabilitation": ["Dr. R. Anuradha"],
  "Women's Intimate Wellness": ["Dr. R. Anuradha"],
  "Dermatology & Cosmetology": ["Dr. R. Jayashree", "Dr. R. Arunkarthick"],
  "Hair & Nail Clinic": ["Dr. R. Jayashree", "Dr. R. Arunkarthick"],
  "Endocrinology": ["Dr. R. Anuradha"], 
  "Obesity & Weight Loss": ["Dr. R. Anuradha"],
  "Diabetology": ["Dr. R. Anuradha"],
  "Urology": ["Dr. R. Anuradha"],
  "General Medicine": ["Dr. R. Anuradha"]
};

const Appointment = () => {
  const [formData, setFormData] = useState({
    pasentname: "",
    pasentmail: "",
    pasentnumber: "",
    subject: "",
    appointmenttime: "",
    speciality: "",
    doctor: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState<string[]>([]);

  // When speciality changes, update the available doctors dropdown list
  useEffect(() => {
    if (formData.speciality && SPECIALITY_DOCTORS[formData.speciality]) {
      setAvailableDoctors(SPECIALITY_DOCTORS[formData.speciality]);
      setFormData((prev) => ({
        ...prev,
        doctor: SPECIALITY_DOCTORS[formData.speciality][0] || "",
      }));
    } else {
      setAvailableDoctors([]);
      setFormData((prev) => ({
        ...prev,
        doctor: "",
      }));
    }
  }, [formData.speciality]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted data:", formData);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        pasentname: "",
        pasentmail: "",
        pasentnumber: "",
        subject: "",
        appointmenttime: "",
        speciality: "",
        doctor: "",
      });
    }, 1500);
  };

  return (
    <div className="my-bd" id="appointment-section">
      <div className="adjust_section">
        {/* about start */}
        <div className="container appointments section-space pt-80">
          <div className="cg-about-wrap">
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="0ms" data-wow-duration="500ms">
                <img src={image1} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="100ms" data-wow-duration="500ms">
                <img src={image2} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="200ms" data-wow-duration="500ms">
                <img src={image3} alt="image" />
              </div>
            </div>
            <div className="cg-about-img">
              <div className="wow fadeInRight" data-wow-delay="300ms" data-wow-duration="500ms">
                <img src={image4} alt="image" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="cg-about-top">
                <div className="section-title mb-130">
                  <h2 className="title">Request an Appointment</h2>
                  <div className="cg-funfact-wrap" style={{ justifyContent: "center", display: "flex", textAlign: "center" }}>
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
                  <form className="appointment-form" noValidate onSubmit={handleSubmit}>
                    <div className="form-row">
                      {/* Name */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            id="pasentname"
                            name="pasentname"
                            className="form-control"
                            placeholder="Your Name*"
                            value={formData.pasentname}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="email"
                            name="pasentmail"
                            className="form-control"
                            placeholder="Your Mail*"
                            value={formData.pasentmail}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="pasentnumber"
                            className="form-control"
                            placeholder="Your Number*"
                            value={formData.pasentnumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="subject"
                            className="form-control"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Time */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <input
                            type="datetime-local"
                            name="appointmenttime"
                            className="form-control date-picker"
                            value={formData.appointmenttime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Speciality Dropdown */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <select
                            name="speciality"
                            className="form-control"
                            value={formData.speciality}
                            onChange={handleChange}
                          >
                            <option value="">Choose Speciality...</option>
                            {Object.keys(SPECIALITY_DOCTORS).map((spec) => (
                              <option key={spec} value={spec}>
                                {spec}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Doctor Dropdown (Dynamic) */}
                      <div className="form-group col-md-6 col-lg-6">
                        <div className="input-wrapper">
                          <select
                            name="doctor"
                            className="form-control"
                            value={formData.doctor}
                            onChange={handleChange}
                            disabled={!formData.speciality}
                          >
                            <option value="">Choose Doctor...</option>
                            {availableDoctors.map((doc, idx) => (
                              <option key={idx} value={doc}>
                                {doc}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Submit Button */}
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
