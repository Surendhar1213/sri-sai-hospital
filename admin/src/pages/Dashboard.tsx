import React, { useState, useEffect } from "react";
import { LayoutDashboard, Stethoscope, Users, Calendar, Settings, LogOut, Bell } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  createdAt: string;
}

interface DoctorInput {
  name: string;
  speciality: string;
  email: string;
  phone: string;
  experience: string;
  timing: string;
}

const SPECIALITIES = [
  "Gynecology & Women's Health",
  "Infertility & Fertility",
  "Obstetrics & Maternity",
  "Endocrinology",
  "Obesity & Weight Loss",
  "Diabetology",
  "Dermatology & Cosmetology",
  "Hair & Nail Clinic",
  "Urology",
  "General Medicine",
];

const TIMINGS = [
  "09:00 AM - 01:00 PM",
  "01:00 PM - 05:00 PM",
  "05:00 PM - 09:00 PM",
  "09:00 AM - 05:00 PM",
  "10:00 AM - 02:00 PM",
  "02:00 PM - 06:00 PM",
  "06:00 PM - 10:00 PM",
];


const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Doctor Form Input State
  const [doctorForm, setDoctorForm] = useState<DoctorInput>({
    name: "",
    speciality: SPECIALITIES[0],
    email: "",
    phone: "",
    experience: "",
    timing: TIMINGS[0], // Set default value
  });


  // Settings Configuration State
  const [settingsForm, setSettingsForm] = useState({
    hospitalName: "Sri Sai Hospital",
    consultationFee: "500",
    contactEmail: "info@srisaihospital.org",
    contactPhone: "+91 44 2468 1357",
    address: "Chennai, Tamil Nadu",
    googleIntegration: false,
    razorpayKey: "",
    razorpaySecret: "",
  });

  // Alert/Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Hospital Overview";
      case "doctors":
        return "Doctors Directory";
      case "patients":
        return "Patients Registry";
      case "appointments":
        return "Appointments & Bookings";
      case "settings":
        return "Admin Settings";
      default:
        return "Hospital Overview";
    }
  };

    // 2. Fetch registered doctors from database endpoint
  const fetchDoctors = async () => {
    setIsLoadingDoctors(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/doctor/all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch doctors");
      }
      
      // State value update panrom
      setDoctors(data.doctors || []);
    } catch (err: any) {
      triggerToast(`❌ Error fetching doctors: ${err.message}`);
    } finally {
      setIsLoadingDoctors(false);
    }
  };


  // Fetch registered patients from MongoDB (real action)
  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    setPatientsError("");
    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch patients");
      }
      setPatients(data.users || []);
    } catch (err: any) {
      setPatientsError(
        err.message || "Could not connect to server database."
      );
    } finally {
      setIsLoadingPatients(false);
    }
  };

    useEffect(() => {
    if (activeTab === "patients") {
      fetchPatients();
    } else if (activeTab === "doctors") {
      fetchDoctors(); // Run dynamic call
    }
  }, [activeTab]);


    const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. LocalStorage la save aagi irukura adminToken value-ah edukurom
      const token = localStorage.getItem("adminToken");
      if (!token) {
        triggerToast("❌ Session expired! Please login again.");
        return;
      }

      // 2. Localhost or Vercel server dynamic base URL selection
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // 3. API request call using POST method
      const response = await fetch(`${backendUrl}/api/doctor/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Admin Security verification token
        },
        body: JSON.stringify({
          name: doctorForm.name,
          speciality: doctorForm.speciality,
          email: doctorForm.email,
          experience: Number(doctorForm.experience), // Number format update
          timing: doctorForm.timing,
        }),
      });

            const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add doctor");
      }

      // 4. Success Toast display setup
      triggerToast(`✅ ${data.message || "Doctor registered successfully!"}`);

      // ADD IT HERE ⬇️ (Success path-la fetchDoctors call panrom)
      fetchDoctors();

      // 5. Input fields auto-clear pannanum, register success aana pinbu!
      setDoctorForm({
        name: "",
        speciality: SPECIALITIES[0],
        email: "",
        phone: "",
        experience: "",
        timing: TIMINGS[0],
      });


    } catch (err: any) {
      console.error(err);
      triggerToast(`❌ Error: ${err.message || "Failed to register doctor"}`);
    }
  };


  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Settings database API integration coming in next step!");
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const query = searchTerm.toLowerCase();
    return (
      (patient.name && patient.name.toLowerCase().includes(query)) ||
      (patient.email && patient.email.toLowerCase().includes(query)) ||
      (patient.phone && patient.phone.includes(query))
    );
  });

  return (
    <div
      className="dashboard-layout"
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        minHeight: "100vh",
        backgroundColor: "#F8FAF9", // Clean light backdrop
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            backgroundColor: "#060F2D", // Title Color
            color: "#FFFFFF",
            padding: "16px 24px",
            borderRadius: "14px",
            boxShadow: "0 20px 40px rgba(6, 15, 45, 0.15)",
            zIndex: 10000,
            fontSize: "14.5px",
            fontWeight: "600",
            borderLeft: "4px solid #3F59FF", // Primary Color
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <span>💡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          backgroundColor: "#060F2D", // Dark navy title-color
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "32px 24px",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          overflowY: "auto",
        }}
      >
        <div>
          {/* Brand Logo Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              paddingBottom: "32px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3F59FF 0%, #31B0FF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "20px",
                boxShadow: "0 8px 20px rgba(63, 89, 255, 0.3)",
              }}
            >
              S
            </div>
            <div>
              <span style={{ fontWeight: "700", fontSize: "19px", display: "block", letterSpacing: "-0.5px" }}>
                Sri Sai Hospital
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", display: "block", marginTop: "2px" }}>
                Super Admin Panel
              </span>
            </div>
          </div>

          {/* Core Modules Section */}
          <div style={{ marginBottom: "28px" }}>
            <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", fontWeight: "700", marginBottom: "14px", paddingLeft: "12px" }}>
              Core Systems
            </span>
            <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
                { id: "doctors", label: "Doctors Directory", icon: <Stethoscope size={18} /> },
                { id: "patients", label: "Patients Registry", icon: <Users size={18} /> },
                { id: "appointments", label: "Appointments", icon: <Calendar size={18} /> },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      width: "100%",
                      padding: "12px 18px",
                      backgroundColor: isActive ? "#3F59FF" : "transparent",
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)",
                      border: "none",
                      borderRadius: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isActive ? "0 4px 14px rgba(63, 89, 255, 0.3)" : "none",
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Profile & Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Settings Tab relocated here */}
          <button
            onClick={() => {
              setActiveTab("settings");
              setSearchTerm("");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              width: "100%",
              padding: "12px 18px",
              backgroundColor: activeTab === "settings" ? "#3F59FF" : "transparent",
              color: activeTab === "settings" ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)",
              border: "none",
              borderRadius: "12px",
              textAlign: "left",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: activeTab === "settings" ? "0 4px 14px rgba(63, 89, 255, 0.3)" : "none",
            }}
            onMouseOver={(e) => {
              if (activeTab !== "settings") e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
            }}
            onMouseOut={(e) => {
              if (activeTab !== "settings") e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}><Settings size={18} /></span>
            <span>Setup Settings</span>
          </button>

          <div
            style={{
              padding: "14px 16px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#3F59FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              SA
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "13.5px" }}>Super Admin</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Active Session</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "transparent",
              color: "#EF4444",
              border: "1.5px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13.5px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main style={{ display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
        {/* Header Bar */}
        <header
          style={{
            backgroundColor: "#FFFFFF",
            padding: "24px 40px",
            borderBottom: "1px solid rgba(6, 15, 45, 0.04)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#060F2D", letterSpacing: "-0.5px" }}>
              {getHeaderTitle()}
            </h2>
            <span style={{ fontSize: "12px", color: "#616161", marginTop: "2px", display: "block" }}>
              Sri Sai Hospital Roster Control Room
            </span>
          </div>
          <button
            onClick={() => triggerToast("System notifications integration coming in next step!")}
            style={{
              background: "#F2F3FE",
              border: "none",
              cursor: "pointer",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Bell size={20} color="#3F59FF" />
          </button>
        </header>

        {/* Tab Page Containers */}
        <div style={{ padding: "40px", flexGrow: 1 }}>
          {/* ───────────────── TAB 1: OVERVIEW ───────────────── */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                {[
                  { label: "Total Bookings", value: "--", color: "#3F59FF", bg: "rgba(63, 89, 255, 0.08)" },
                  { label: "Active Doctors Roster", value: "--", color: "#31B0FF", bg: "rgba(49, 176, 255, 0.08)" },
                  { label: "Registered Patients List", value: patients.length || "--", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" },
                ].map((card, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "28px",
                      borderRadius: "18px",
                      boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                      border: "1px solid rgba(6, 15, 45, 0.04)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "14px", color: "#616161", fontWeight: "600" }}>{card.label}</span>
                      <div style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", marginTop: "10px" }}>
                        {card.value}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        backgroundColor: card.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: card.color,
                      }}
                    >
                      {i === 0 ? <Calendar size={22} color={card.color} /> : i === 1 ? <Stethoscope size={22} color={card.color} /> : <Users size={22} color={card.color} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Clean Empty State */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "60px 40px",
                  boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                  border: "1px dashed rgba(6, 15, 45, 0.12)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(63, 89, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Calendar size={36} color="#3F59FF" />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#060F2D" }}>
                  Appointment Registry Log
                </h3>
                <p style={{ fontSize: "14.5px", color: "#616161", marginTop: "8px", maxWidth: "450px", lineHeight: "1.6" }}>
                  All real-time patient booking logs, consultant specialists and timing allocations will register here automatically once backend API connects.
                </p>
                <button
                  onClick={() => triggerToast("Database API connection is planned next!")}
                  style={{
                    marginTop: "24px",
                    backgroundColor: "#3F59FF",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                    boxShadow: "0 4px 12px rgba(63, 89, 255, 0.2)",
                  }}
                >
                  Configure Roster API
                </button>
              </div>
            </div>
          )}

          {/* ───────────────── TAB 2: DOCTORS CONFIG ───────────────── */}
          {activeTab === "doctors" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "40px" }}>
              {/* Add Doctor Form */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "36px",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                  border: "1px solid rgba(6, 15, 45, 0.04)",
                }}
              >
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#060F2D" }}>
                    Register Roster Specialist
                  </h3>
                  <span style={{ fontSize: "12px", color: "#616161", marginTop: "2px", display: "block" }}>
                    Add profiles to populate user booking dropdown choices.
                  </span>
                </div>

                <form onSubmit={handleAddDoctorSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                      Doctor Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Raman Srinivasan"
                      required
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                      onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                      Speciality Category
                    </label>
                    <select
                      value={doctorForm.speciality}
                      onChange={(e) => setDoctorForm({ ...doctorForm, speciality: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        backgroundColor: "#fff",
                        outline: "none",
                      }}
                    >
                      {SPECIALITIES.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      placeholder="doctor@srisaihospital.org"
                      required
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 12"
                        required
                        value={doctorForm.experience}
                        onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "10px",
                          border: "1.5px solid #cbd5e1",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                        Session Timings
                      </label>
                      <select
                        value={doctorForm.timing}
                        onChange={(e) => setDoctorForm({ ...doctorForm, timing: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "10px",
                          border: "1.5px solid #cbd5e1",
                          fontSize: "14px",
                          backgroundColor: "#fff",
                          outline: "none",
                        }}
                      >
                        {TIMINGS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: "16px",
                      padding: "16px",
                      backgroundColor: "#3F59FF",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontSize: "14.5px",
                      boxShadow: "0 8px 20px rgba(63, 89, 255, 0.2)",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    Register Doctor Details
                  </button>
                </form>
              </div>

              {/* Doctors Registry List Placeholder */}
                            {/* Doctors Registry List */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "32px",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                  border: "1px solid rgba(6, 15, 45, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  overflowY: "auto",
                  maxHeight: "650px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #F2F3FE", paddingBottom: "16px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#060F2D" }}>
                    Registered Specialists ({doctors.length})
                  </h3>
                </div>

                {isLoadingDoctors ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <span style={{ fontSize: "14px", color: "#616161" }}>Fetching doctor roster...</span>
                  </div>
                ) : doctors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#616161" }}>
                    <Stethoscope size={32} color="#cbd5e1" style={{ marginBottom: "12px" }} />
                    <p style={{ fontSize: "14px", fontWeight: "600" }}>No doctors registered yet.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {doctors.map((doc) => (
                      <div
                        key={doc._id}
                        style={{
                          padding: "20px",
                          borderRadius: "14px",
                          border: "1px solid #F2F3FE",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: doc.isAvailable ? "#FFFFFF" : "#F9FAFB",
                          opacity: doc.isAvailable ? 1 : 0.8,
                          transition: "all 0.2s"
                        }}
                      >
                        <div>
                          <h4 style={{ fontSize: "15.5px", fontWeight: "700", color: "#060F2D" }}>
                            {doc.name}
                          </h4>
                          <span style={{ fontSize: "12px", color: "#3F59FF", fontWeight: "600", display: "block", marginTop: "2px" }}>
                            {doc.speciality}
                          </span>
                          
                          <div style={{ display: "flex", gap: "16px", marginTop: "12px", fontSize: "12.5px", color: "#616161" }}>
                            <span>💼 {doc.experience} Years Exp</span>
                            <span>⏰ {doc.timing}</span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginTop: "6px" }}>
                            📧 {doc.email}
                          </span>
                        </div>

                        {/* Right side availability indicator status */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: "700",
                              backgroundColor: doc.isAvailable ? "#D1FAE5" : "#FEE2E2",
                              color: doc.isAvailable ? "#065F46" : "#991B1B",
                            }}
                          >
                            {doc.isAvailable ? "● Active Roster" : "○ Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ───────────────── TAB 3: PATIENTS LOGS ───────────────── */}
          {activeTab === "patients" && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                border: "1px solid rgba(6, 15, 45, 0.04)",
                padding: "32px",
              }}
            >
              {/* Patients Search and Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#060F2D" }}>
                    Patients Registry Log
                  </h3>
                  <span style={{ fontSize: "12px", color: "#616161", display: "block", marginTop: "2px" }}>
                    Live registry records containing active user metadata accounts.
                  </span>
                </div>

                <div style={{ position: "relative", width: "300px" }}>
                  <input
                    type="text"
                    placeholder="🔍 Search patient registries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "13.5px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Patients Table */}
              {isLoadingPatients ? (
                <div style={{ textAlign: "center", padding: "60px" }}>
                  <div className="admin-spinner" style={{ margin: "0 auto" }}></div>
                  <p style={{ marginTop: "16px", color: "#616161", fontSize: "14px" }}>Retrieving registered data...</p>
                </div>
              ) : patientsError ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#EF4444" }}>
                  <p style={{ fontSize: "14.5px", fontWeight: "600" }}>{patientsError}</p>
                  <button
                    onClick={fetchPatients}
                    style={{
                      marginTop: "16px",
                      padding: "10px 24px",
                      backgroundColor: "#3F59FF",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Retry Connection
                  </button>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#616161" }}>
                  <Users size={40} color="#3F59FF" style={{ marginBottom: "12px" }} />
                  <p style={{ fontWeight: "600", color: "#060F2D" }}>No registered patient accounts found.</p>
                  <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Sign-ups from client applications will map here.</span>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #F2F3FE", color: "#616161", fontSize: "13px", fontWeight: "700" }}>
                        <th style={{ padding: "16px 12px" }}>Patient Profile</th>
                        <th style={{ padding: "16px 12px" }}>Email ID</th>
                        <th style={{ padding: "16px 12px" }}>Mobile Number</th>
                        <th style={{ padding: "16px 12px" }}>Blood Group</th>
                        <th style={{ padding: "16px 12px" }}>Registration Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => {
                        const formattedDate = patient.createdAt
                          ? new Date(patient.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "--";

                        return (
                          <tr
                            key={patient._id}
                            style={{
                              borderBottom: "1px solid #F2F3FE",
                              fontSize: "14px",
                              color: "#060F2D",
                            }}
                          >
                            <td style={{ padding: "18px 12px", fontWeight: "700" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(63, 89, 255, 0.06)",
                                    color: "#3F59FF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "800",
                                    fontSize: "12px",
                                  }}
                                >
                                  {patient.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{patient.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: "18px 12px" }}>{patient.email}</td>
                            <td style={{ padding: "18px 12px" }}>{patient.phone}</td>
                            <td style={{ padding: "18px 12px" }}>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "8px",
                                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                                  color: "#EF4444",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span style={{ width: "6px", height: "6px", backgroundColor: "#EF4444", borderRadius: "50%" }}></span>
                                {patient.bloodGroup || "Unknown"}
                              </span>
                            </td>
                            <td style={{ padding: "18px 12px", color: "#616161" }}>{formattedDate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ───────────────── TAB 4: APPOINTMENTS REGISTRY ───────────────── */}
          {activeTab === "appointments" && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                border: "1px solid rgba(6, 15, 45, 0.04)",
                padding: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#060F2D" }}>
                    Appointment Bookings Log
                  </h3>
                  <span style={{ fontSize: "12px", color: "#616161", display: "block", marginTop: "2px" }}>
                    Manage doctor check-ups, consult scheduling, and patient visits.
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => triggerToast("New appointment scheduling panel coming in Phase 2!")}
                    style={{
                      backgroundColor: "#3F59FF",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "10px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "13.5px",
                      boxShadow: "0 4px 12px rgba(63, 89, 255, 0.2)",
                    }}
                  >
                    + Create Booking
                  </button>
                </div>
              </div>

              {/* Mock/Demo Appointments for visualization */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #F2F3FE", color: "#616161", fontSize: "13px", fontWeight: "700" }}>
                      <th style={{ padding: "16px 12px" }}>Patient Profile</th>
                      <th style={{ padding: "16px 12px" }}>Assigned Specialist</th>
                      <th style={{ padding: "16px 12px" }}>Slot Date & Time</th>
                      <th style={{ padding: "16px 12px" }}>Consultation Status</th>
                      <th style={{ padding: "16px 12px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { patient: "Surendhar", doctor: "Dr. Raman Srinivasan (Diabetology)", date: "Jun 30, 2026 - 10:30 AM", status: "Approved", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" },
                      { patient: "Test User", doctor: "Dr. Anjali Sen (Gynecology)", date: "Jul 01, 2026 - 02:00 PM", status: "Pending", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)" },
                      { patient: "Verification User", doctor: "Dr. Raman Srinivasan (Diabetology)", date: "Jul 02, 2026 - 11:15 AM", status: "Approved", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" }
                    ].map((app, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid #F2F3FE",
                          fontSize: "14px",
                          color: "#060F2D",
                        }}
                      >
                        <td style={{ padding: "18px 12px", fontWeight: "700" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(63, 89, 255, 0.06)",
                                color: "#3F59FF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "800",
                                fontSize: "12px",
                              }}
                            >
                              {app.patient.charAt(0).toUpperCase()}
                            </div>
                            <span>{app.patient}</span>
                          </div>
                        </td>
                        <td style={{ padding: "18px 12px", fontWeight: "500" }}>{app.doctor}</td>
                        <td style={{ padding: "18px 12px", color: "#616161" }}>{app.date}</td>
                        <td style={{ padding: "18px 12px" }}>
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: "20px",
                              backgroundColor: app.bg,
                              color: app.color,
                              fontSize: "12px",
                              fontWeight: "700",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", backgroundColor: app.color, borderRadius: "50%" }}></span>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: "18px 12px" }}>
                          <button
                            onClick={() => triggerToast("Appointment action features (Approve/Cancel) will connect to the DB API in Phase 2!")}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "transparent",
                              border: "1.5px solid #cbd5e1",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#616161",
                              cursor: "pointer",
                            }}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────── TAB 4: SETUP CONFIGURATION ───────────────── */}
          {activeTab === "settings" && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                border: "1px solid rgba(6, 15, 45, 0.04)",
                padding: "40px",
                maxWidth: "850px",
              }}
            >
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#060F2D" }}>
                  Hospital Configurations & Gateway setup
                </h3>
                <span style={{ fontSize: "12px", color: "#616161", display: "block", marginTop: "2px" }}>
                  Manage hospital billing charges, Virtual consultation setups, and Payment APIs.
                </span>
              </div>

              <form onSubmit={handleSaveSettingsSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                      Hospital Display Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.hospitalName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                      Default Consultation Fee (INR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.consultationFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, consultationFee: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Google Sync Block */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F2F3FE", // Theme matching
                    borderRadius: "14px",
                    border: "1.5px solid rgba(63, 89, 255, 0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#060F2D" }}>
                      Google Calendar & Virtual Meet Integration
                    </h4>
                    <p style={{ fontSize: "12px", color: "#616161", marginTop: "4px", lineHeight: "1.4" }}>
                      Enable automatic Calendar sync and Google Meet url links creation upon success payment bookings.
                    </p>
                  </div>
                  <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px" }}>
                    <input
                      type="checkbox"
                      checked={settingsForm.googleIntegration}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, googleIntegration: e.target.checked })
                      }
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: settingsForm.googleIntegration ? "#3F59FF" : "#cbd5e1",
                        borderRadius: "34px",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          height: "18px",
                          width: "18px",
                          left: settingsForm.googleIntegration ? "26px" : "4px",
                          bottom: "4px",
                          backgroundColor: "#fff",
                          borderRadius: "50%",
                          transition: "0.3s",
                        }}
                      ></span>
                    </span>
                  </label>
                </div>

                {/* Razorpay gateway settings */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F2F3FE",
                    borderRadius: "14px",
                    border: "1.5px solid rgba(63, 89, 255, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#060F2D" }}>
                    Razorpay Checkout Integration Setup
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#616161", display: "block", marginBottom: "6px" }}>
                        Razorpay API Key ID
                      </label>
                      <input
                        type="text"
                        placeholder="rzp_test_..."
                        value={settingsForm.razorpayKey}
                        onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKey: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1.5px solid #cbd5e1",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#616161", display: "block", marginBottom: "6px" }}>
                        Razorpay Key Secret
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={settingsForm.razorpaySecret}
                        onChange={(e) => setSettingsForm({ ...settingsForm, razorpaySecret: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1.5px solid #cbd5e1",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "fit-content",
                    padding: "14px 36px",
                    backgroundColor: "#3F59FF",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "14.5px",
                    boxShadow: "0 6px 20px rgba(63, 89, 255, 0.2)",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  Save Settings Setup
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
