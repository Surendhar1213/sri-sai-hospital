import React from "react";
import PageBanner from "../components/PageBanner/PageBanner";
import privacyBanner from "../assets/privacy-banner.webp";
import "./Legal.css";
import {
  FileText,
  AlertOctagon,
  Stethoscope,
  CalendarCheck,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  Scale,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

const TermsConditions: React.FC = () => {
  return (
    <>
      <PageBanner title="Terms & Conditions" bgImage={privacyBanner} />

      <div className="legal-page-wrapper">
        <div className="container">
          {/* Header Card */}
          <div className="legal-header-card">
            <div className="legal-header-badge">
              <Scale size={16} /> Hospital Service Terms & Rules
            </div>
            <h1 className="legal-header-title">Terms & Conditions of Service</h1>
            <p className="legal-header-subtitle">
              Please read these terms carefully before using the website or booking appointments with Sri Sai Subhramaniya Hospitals.
            </p>
            <div className="legal-meta-strip">
              <div className="legal-meta-item">
                <Clock size={16} /> Last Updated: October 06, 2026
              </div>
              <div className="legal-meta-item">
                <FileText size={16} /> Version: 2.1
              </div>
              <div className="legal-meta-item">
                <Building2 size={16} /> Sri Sai Subhramaniya Hospitals, Chennai
              </div>
            </div>
          </div>

          {/* Emergency Alert Callout */}
          <div className="legal-emergency-alert">
            <div className="legal-emergency-title">
              <AlertOctagon size={22} /> CRITICAL MEDICAL EMERGENCY NOTICE
            </div>
            <p className="legal-emergency-text">
              <strong>THIS WEBSITE & ONLINE BOOKING SYSTEM IS NOT FOR EMERGENCY MEDICAL CARE.</strong> If you or a loved one are experiencing acute chest pain, severe trauma, shortness of breath, loss of consciousness, or any life-threatening condition, <strong>CALL 108 OR PROCEED IMMEDIATELY TO OUR EMERGENCY DEPARTMENT AT THIRUMULLAIVOYAL, CHENNAI (+91 94444 79090).</strong>
            </p>
          </div>

          <div className="row g-4">
            {/* Table of Contents Sidebar */}
            <div className="col-lg-4">
              <div className="legal-toc-card">
                <div className="legal-toc-title">
                  <FileText size={18} /> Section Navigation
                </div>
                <ul className="legal-toc-list">
                  <li className="legal-toc-item">
                    <a href="#acceptance" className="legal-toc-link">
                      1. Acceptance of Terms
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#emergency-notice" className="legal-toc-link">
                      2. Emergency Disclaimer
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#medical-advice" className="legal-toc-link">
                      3. No Direct Medical Advice
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#appointments" className="legal-toc-link">
                      4. Appointment Booking Rules
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#cancellation" className="legal-toc-link">
                      5. Rescheduling & Refunds
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#patient-conduct" className="legal-toc-link">
                      6. Patient Responsibilities
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#intellectual-property" className="legal-toc-link">
                      7. Copyright & IP Rights
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#liability" className="legal-toc-link">
                      8. Limitation of Liability
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#governing-law" className="legal-toc-link">
                      9. Jurisdiction & Applicable Law
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content Sections */}
            <div className="col-lg-8">
              {/* Section 1 */}
              <div id="acceptance" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <CheckCircle2 />
                  </div>
                  <h2 className="legal-section-title">1. Acceptance of Terms</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    By accessing, browsing, or utilizing the website and online appointment booking portal of <strong>Sri Sai Subhramaniya Hospitals</strong> (&quot;Hospital&quot;), you acknowledge that you have read, understood, and agree to be legally bound by these Terms & Conditions.
                  </p>
                  <p>
                    If you do not agree with any portion of these terms, you should refrain from using our website and online consultation services.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="emergency-notice" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box" style={{ background: "#ffe4e6", color: "#e11d48" }}>
                    <AlertOctagon />
                  </div>
                  <h2 className="legal-section-title">2. Emergency Disclaimer</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    The website, online appointment forms, contact numbers, and email addresses provided here are intended strictly for routine clinical consultations, elective appointments, diagnostic bookings, and hospital general inquiries.
                  </p>
                  <div className="legal-highlight-box" style={{ borderLeftColor: "#e11d48", backgroundColor: "#fff1f2" }}>
                    ⚠️ <strong>Casualty & Emergency:</strong> Online bookings do not guarantee immediate physician response during medical crises. For urgent medical emergencies, please call <strong>+91 94444 79090 / 108</strong> or visit our Casualty Unit at Thirumullaivoyal, Chennai.
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div id="medical-advice" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <Stethoscope />
                  </div>
                  <h2 className="legal-section-title">3. Informational Content & Medical Advice</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    All health articles, diagnostic department descriptions, specialty details, and medical awareness content published on this website are provided strictly for general educational purposes.
                  </p>
                  <ul className="legal-list">
                    <li className="legal-list-item">Website content is NOT a substitute for formal in-person clinical examination or medical diagnosis.</li>
                    <li className="legal-list-item">Always consult a qualified medical practitioner before starting any treatment, medication, or therapy.</li>
                    <li className="legal-list-item">Never disregard professional medical advice or delay seeking care because of information read on this website.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div id="appointments" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <CalendarCheck />
                  </div>
                  <h2 className="legal-section-title">4. Appointment Booking & Consultation Terms</h2>
                </div>
                <div className="legal-section-body">
                  <p>When booking appointments through our portal:</p>
                  <div className="legal-grid-cards">
                    <div className="legal-subcard">
                      <h3 className="legal-subcard-title">Consultation Fee</h3>
                      <p className="legal-subcard-text">
                        Appointments can be booked online by paying a standard consultation fee of ₹1000 for the selected specialty.
                      </p>
                    </div>
                    <div className="legal-subcard">
                      <h3 className="legal-subcard-title">In-Hospital Checkups</h3>
                      <p className="legal-subcard-text">
                        For in-person visits, patients are required to report to the hospital reception desk at least 15 minutes prior to their confirmed slot.
                      </p>
                    </div>
                    <div className="legal-subcard">
                      <h3 className="legal-subcard-title">Online Video/Audio Link</h3>
                      <p className="legal-subcard-text">
                        For online consultations, the digital video/audio consultation room link opens <strong>3 minutes before</strong> your scheduled slot time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div id="cancellation" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <RotateCcw />
                  </div>
                  <h2 className="legal-section-title">5. Cancellation, Rescheduling & Refund Policy</h2>
                </div>
                <div className="legal-section-body">
                  <p>We understand plans change. Our appointment cancellation guidelines are as follows:</p>
                  <ul className="legal-list">
                    <li className="legal-list-item">
                      <strong>Full Refund Cancellation:</strong> Cancellations made at least <strong>24 hours prior</strong> to the scheduled slot are eligible for a 100% full refund.
                    </li>
                    <li className="legal-list-item">
                      <strong>Rescheduling:</strong> You can reschedule your appointment at least 2 hours prior to your slot by calling our helpline at +91 44 42061148 / +91 94444 79090.
                    </li>
                    <li className="legal-list-item">
                      <strong>Hospital Cancellations:</strong> If an appointment is cancelled by the hospital due to emergency surgeon availability, a full refund or immediate priority reschedule will be offered.
                    </li>
                    <li className="legal-list-item">
                      <strong>Refund Processing:</strong> Valid refund requests are processed back to the original payment method within 5–7 business days.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div id="patient-conduct" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <UserCheck />
                  </div>
                  <h2 className="legal-section-title">6. Patient Responsibilities & Information Accuracy</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    Patients agree to provide accurate, truthful, and updated personal details, phone numbers, and relevant medical history during registration. The hospital is not liable for clinical errors resulting from false, misleading, or omitted information provided by the patient.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="intellectual-property" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <ShieldAlert />
                  </div>
                  <h2 className="legal-section-title">7. Intellectual Property & Copyright</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    All logos, graphics, hospital branding, text copy, images, and website code are the exclusive property of <strong>Sri Sai Subhramaniya Hospitals</strong>. Reproduction, distribution, or unauthorized copying without written consent is strictly prohibited.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div id="liability" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <FileText />
                  </div>
                  <h2 className="legal-section-title">8. Limitation of Liability</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    Sri Sai Subhramaniya Hospitals shall not be held liable for any indirect, incidental, or technical disruptions (such as server downtime, network failure, or internet connectivity issues) encountered while accessing the online booking portal.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div id="governing-law" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <Scale />
                  </div>
                  <h2 className="legal-section-title">9. Governing Law & Jurisdiction</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with website usage or hospital services shall be subject to the exclusive jurisdiction of the competent courts in <strong>Chennai, Tamil Nadu, India</strong>.
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="legal-contact-card">
                <h3 className="legal-contact-title">Have Questions About Our Service Terms?</h3>
                <p className="legal-contact-text">
                  Our hospital administration team is available to assist you with any questions regarding service terms or appointment rules:
                </p>
                <div className="legal-contact-grid">
                  <div className="legal-contact-item">
                    <div className="legal-contact-label"><Mail size={14} style={{ display: "inline", marginRight: "4px" }} /> Email</div>
                    <p className="legal-contact-val">
                      <a href="mailto:srisaisubhramaniyahospitals@gmail.com">srisaisubhramaniyahospitals@gmail.com</a>
                    </p>
                  </div>
                  <div className="legal-contact-item">
                    <div className="legal-contact-label"><Phone size={14} style={{ display: "inline", marginRight: "4px" }} /> Landline / Mobile</div>
                    <p className="legal-contact-val">+91 44 42061148 / +91 94444 79090</p>
                  </div>
                  <div className="legal-contact-item">
                    <div className="legal-contact-label"><MapPin size={14} style={{ display: "inline", marginRight: "4px" }} /> Location</div>
                    <p className="legal-contact-val">Thirumullaivoyal, Chennai-600062</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
