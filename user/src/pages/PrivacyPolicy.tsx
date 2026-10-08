import React from "react";
import PageBanner from "../components/PageBanner/PageBanner";
import privacyBanner from "../assets/privacy-banner.webp";
import "./Legal.css";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Cookie,
  Server,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <PageBanner title="Privacy Policy" bgImage={privacyBanner} />

      <div className="legal-page-wrapper">
        <div className="container">
          {/* Header Card */}
          <div className="legal-header-card">
            <div className="legal-header-badge">
              <ShieldCheck size={16} /> Patient Data Protection Policy
            </div>
            <h1 className="legal-header-title">Privacy & Personal Data Protection</h1>
            <p className="legal-header-subtitle">
              At Sri Sai Subhramaniya Hospitals, we prioritize the confidentiality, security, and integrity of your medical and personal information.
            </p>
            <div className="legal-meta-strip">
              <div className="legal-meta-item">
                <Clock size={16} /> Last Updated: October 07, 2026
              </div>
              <div className="legal-meta-item">
                <FileText size={16} /> Effective Date: Immediate
              </div>
              <div className="legal-meta-item">
                <UserCheck size={16} /> Applies to: Patients, Visitors & Web Users
              </div>
            </div>
          </div>

          {/* Emergency Alert Callout */}
          <div className="legal-emergency-alert">
            <div className="legal-emergency-title">
              <AlertTriangle size={22} /> Medical Emergency Disclaimer
            </div>
            <p className="legal-emergency-text">
              This website and online appointment portal are designed for routine consultations and hospital information. <strong>Do NOT use online forms or emails for medical emergencies.</strong> If you require emergency medical assistance, please call our 24/7 Emergency Line at <strong>+91 94444 79090</strong> or visit our Casualty Department immediately.
            </p>
          </div>

          <div className="row g-4">
            {/* Table of Contents Sidebar */}
            <div className="col-lg-4">
              <div className="legal-toc-card">
                <div className="legal-toc-title">
                  <FileText size={18} /> Quick Navigation
                </div>
                <ul className="legal-toc-list">
                  <li className="legal-toc-item">
                    <a href="#overview" className="legal-toc-link">
                      1. Overview & Commitment
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#info-collected" className="legal-toc-link">
                      2. Information We Collect
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#how-we-use" className="legal-toc-link">
                      3. How Information is Used
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#data-security" className="legal-toc-link">
                      4. Data Protection & Security
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#third-parties" className="legal-toc-link">
                      5. Sharing & Third Parties
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#patient-rights" className="legal-toc-link">
                      6. Patient Rights
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#cookies" className="legal-toc-link">
                      7. Cookies & Analytics
                    </a>
                  </li>
                  <li className="legal-toc-item">
                    <a href="#contact" className="legal-toc-link">
                      8. Privacy Officer Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content Sections */}
            <div className="col-lg-8">
              {/* Section 1 */}
              <div id="overview" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <ShieldCheck />
                  </div>
                  <h2 className="legal-section-title">1. Overview & Our Commitment</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    Sri Sai Subhramaniya Hospitals (&quot;Hospital,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) values your trust when sharing your personal and health information with us. This Privacy Policy details our practices concerning the collection, storage, utilization, and safeguarding of patient information across our physical hospital premises, website, and mobile/online consultation portals.
                  </p>
                  <p>
                    We strictly adhere to applicable Indian healthcare laws, medical confidentiality codes, the Information Technology Act, 2000, and the Digital Personal Data Protection Act (DPDP Act) guidelines to ensure full compliance and patient safety.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="info-collected" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <Eye />
                  </div>
                  <h2 className="legal-section-title">2. Information We Collect</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    To provide accurate diagnosis, quality clinical care, and efficient online appointment booking, we may collect the following types of information:
                  </p>
                  <div className="legal-grid-cards">
                    <div className="legal-subcard">
                      <h3 className="legal-subcard-title">
                        <ChevronRight size={16} /> Personal Identification
                      </h3>
                      <p className="legal-subcard-text">
                        Full name, age, gender, date of birth, contact number, email address, residential address, and emergency contact details.
                      </p>
                    </div>
                    <div className="legal-subcard">
                      <h3 className="legal-subcard-title">
                        <ChevronRight size={16} /> Clinical & Medical Data
                      </h3>
                      <p className="legal-subcard-text">
                        Medical history, chief health complaints, appointment preferences, attending physician notes, prescriptions, and lab test reports.
                      </p>
                    </div>
                    <div className="legal-subcard">
                      <h3 className="legal-subcard-title">
                        <ChevronRight size={16} /> Transactional Info
                      </h3>
                      <p className="legal-subcard-text">
                        Online consultation fees, registration payments, transaction IDs, and invoice details (handled via encrypted payment providers).
                      </p>
                    </div>
                    <div className="legal-subcard">
                      <h3 className="legal-subcard-title">
                        <ChevronRight size={16} /> Technical Logs
                      </h3>
                      <p className="legal-subcard-text">
                        IP address, browser type, visit timestamp, and page interaction data for server security and fraud prevention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div id="how-we-use" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <FileText />
                  </div>
                  <h2 className="legal-section-title">3. How Information is Used</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    <strong>Sri Sai Hospital values your privacy.</strong> The patient details (Name, Contact, and Email) provided during booking will only be used for appointment coordination, health record maintenance, and notifications.
                  </p>
                  <ul className="legal-list">
                    <li className="legal-list-item">
                      Scheduling, managing, and confirming doctor consultations and diagnostic lab appointments.
                    </li>
                    <li className="legal-list-item">
                      Sending essential SMS, WhatsApp, and Email notifications for appointment reminders, diagnostic report readiness, and prescription alerts.
                    </li>
                    <li className="legal-list-item">
                      Maintaining medical records in compliance with Indian Medical Council guidelines.
                    </li>
                    <li className="legal-list-item">
                      Improving our clinical workflows, website responsiveness, and patient support response times.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div id="data-security" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <Lock />
                  </div>
                  <h2 className="legal-section-title">4. Data Protection & Storage Security</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    We deploy robust enterprise-grade security protocols to protect your sensitive personal and medical records from unauthorized access, accidental loss, alteration, or disclosure.
                  </p>
                  <div className="legal-highlight-box">
                    🔒 <strong>Strict Encryption:</strong> All online communications and appointment details transmitted through our website are secured with standard SSL/TLS encryption. Access to patient records is strictly restricted to authorized doctors and medical staff on a need-to-know basis.
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div id="third-parties" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <Server />
                  </div>
                  <h2 className="legal-section-title">5. Data Sharing & Third-Party Vendors</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    <strong>We DO NOT sell, trade, or rent your personal health data to any commercial third parties or advertisers under any circumstances.</strong>
                  </p>
                  <p>Data is shared only in the following limited situations:</p>
                  <ul className="legal-list">
                    <li className="legal-list-item">
                      <strong>Medical Professionals:</strong> Attending doctors, surgeons, nurses, and lab technicians involved in your medical treatment plan.
                    </li>
                    <li className="legal-list-item">
                      <strong>Payment Gateways:</strong> PCI-DSS compliant secure payment gateway providers for online consultation charges.
                    </li>
                    <li className="legal-list-item">
                      <strong>Legal & Statutory Mandates:</strong> Government health departments or law enforcement agencies when strictly required by applicable law or court orders.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div id="patient-rights" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <UserCheck />
                  </div>
                  <h2 className="legal-section-title">6. Patient Rights</h2>
                </div>
                <div className="legal-section-body">
                  <p>As a patient of Sri Sai Subhramaniya Hospitals, you hold the following rights regarding your personal data:</p>
                  <ul className="legal-list">
                    <li className="legal-list-item">Right to inspect and obtain a copy of your personal profile and appointment history.</li>
                    <li className="legal-list-item">Right to request corrections or updates to inaccurate contact information.</li>
                    <li className="legal-list-item">Right to opt-out of promotional communications (essential appointment SMS alerts will continue).</li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div id="cookies" className="legal-section-card">
                <div className="legal-section-header">
                  <div className="legal-section-icon-box">
                    <Cookie />
                  </div>
                  <h2 className="legal-section-title">7. Cookies & Website Analytics</h2>
                </div>
                <div className="legal-section-body">
                  <p>
                    Our website uses essential HTTP cookies to maintain active user login sessions, remember appointment form selections, and ensure seamless navigation. You can adjust your browser settings to decline cookies, but certain features (such as patient login) may experience reduced functionality.
                  </p>
                </div>
              </div>

              {/* Section 8 / Contact */}
              <div id="contact" className="legal-contact-card">
                <h3 className="legal-contact-title">8. Contact Our Privacy Team</h3>
                <p className="legal-contact-text">
                  If you have questions, concerns, or requests regarding your data privacy or this policy, please reach out to us:
                </p>
                <div className="legal-contact-grid">
                  <div className="legal-contact-item">
                    <div className="legal-contact-label"><Mail size={14} style={{ display: "inline", marginRight: "4px" }} /> Email</div>
                    <p className="legal-contact-val">
                      <a href="mailto:srisaisubhramaniyahospitals@gmail.com">srisaisubhramaniyahospitals@gmail.com</a>
                    </p>
                  </div>
                  <div className="legal-contact-item">
                    <div className="legal-contact-label"><Phone size={14} style={{ display: "inline", marginRight: "4px" }} /> Helpline</div>
                    <p className="legal-contact-val">+91 44 42061148 / +91 94444 79090</p>
                  </div>
                  <div className="legal-contact-item">
                    <div className="legal-contact-label"><MapPin size={14} style={{ display: "inline", marginRight: "4px" }} /> Address</div>
                    <p className="legal-contact-val">#35,36, Masilamaneeswarar Nagar, Thirumullaivoyal, Chennai-600062</p>
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

export default PrivacyPolicy;
