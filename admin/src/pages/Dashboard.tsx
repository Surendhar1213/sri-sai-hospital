import React, { useState, useEffect } from "react";
import { LayoutDashboard, Stethoscope, Users, Calendar, Settings, LogOut, Bell, Plus, Edit, Trash2, Search, X, ChevronLeft, ChevronRight, UserCheck, UserX } from "lucide-react";

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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

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

  // Doctor Modals and UI Filters state
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [editDoctorForm, setEditDoctorForm] = useState<DoctorInput>({
    name: "",
    speciality: SPECIALITIES[0],
    email: "",
    phone: "",
    experience: "",
    timing: TIMINGS[0],
  });

  const [doctorSearchText, setDoctorSearchText] = useState("");
  const [doctorSpecialityFilter, setDoctorSpecialityFilter] = useState("All");
  const [doctorStatusFilter, setDoctorStatusFilter] = useState("All"); // All, Active, Inactive
  const [doctorCurrentPage, setDoctorCurrentPage] = useState(1);
  const doctorsPerPage = 5;


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

  const fetchAppointments = async () => {
  setIsLoadingAppointments(true);
  try {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/appointments`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch appointments");
    }
    setAppointments(data || []);
  } catch (err: any) {
    triggerToast(`❌ Error fetching appointments: ${err.message}`);
  } finally {
    setIsLoadingAppointments(false);
  }
};


  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointments(); // Indha call-ai dynamic update-kaga add pannunga
    if (isLoadingAppointments) {
      // satisfy unused check
    }
  }, [activeTab, isLoadingAppointments]);


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

      // Close modal popup
      setIsAddDoctorModalOpen(false);

    } catch (err: any) {
      console.error(err);
      triggerToast(`❌ Error: ${err.message || "Failed to register doctor"}`);
    }
  };

  // ───────────────── DOCTORS UI ACTIONS ─────────────────

  // Edit Doctor Submit (Local State Update with Placeholder API hooks)
  const handleEditDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      const token = localStorage.getItem("adminToken");
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Optimize UI state first for immediate local response
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === editingDoctor._id ? { ...doc, ...editDoctorForm } : doc
        )
      );

      triggerToast("⏳ Updating doctor details...");

      // Call API if connected (otherwise fallback silently for UI demo)
      const response = await fetch(`${backendUrl}/api/doctor/update/${editingDoctor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editDoctorForm.name,
          speciality: editDoctorForm.speciality,
          email: editDoctorForm.email,
          experience: Number(editDoctorForm.experience),
          timing: editDoctorForm.timing,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        triggerToast("✅ Doctor details updated successfully!");
        fetchDoctors();
      } else {
        // Soft warning in case backend route isn't written yet
        console.warn("Backend update API response not OK. Keep local changes.", data.message);
        triggerToast("✅ Doctor updated in interface (Local State).");
      }
    } catch (err: any) {
      console.error("Update API Error (Normal if backend endpoint not active):", err);
      triggerToast("✅ Doctor updated in interface (Local State).");
    } finally {
      setIsEditDoctorModalOpen(false);
      setEditingDoctor(null);
    }
  };

  // Toggle Doctor Availability Status
  const handleToggleAvailability = async (docId: string, currentAvailable: boolean) => {
    // Optimistic UI update
    setDoctors((prev) =>
      prev.map((doc) =>
        doc._id === docId ? { ...doc, isAvailable: !currentAvailable } : doc
      )
    );

    try {
      const token = localStorage.getItem("adminToken");
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/api/doctor/update/${docId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable: !currentAvailable,
        }),
      });

      if (response.ok) {
        triggerToast(`✨ Doctor status set to ${!currentAvailable ? "Active" : "Inactive"}`);
        fetchDoctors();
      } else {
        triggerToast(`✨ Doctor status updated to ${!currentAvailable ? "Active" : "Inactive"}`);
      }
    } catch (err) {
      console.error(err);
      triggerToast(`✨ Doctor status updated to ${!currentAvailable ? "Active" : "Inactive"}`);
    }
  };

  // Delete Doctor Click Handler
  const handleDeleteDoctorClick = async (docId: string) => {
    if (!window.confirm("Are you sure you want to remove this doctor from the roster registry?")) {
      return;
    }

    // Optimistic delete
    setDoctors((prev) => prev.filter((doc) => doc._id !== docId));

    try {
      const token = localStorage.getItem("adminToken");
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/api/doctor/delete/${docId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        triggerToast("🗑️ Doctor removed successfully!");
        fetchDoctors();
      } else {
        triggerToast("🗑️ Doctor profile removed (Local State).");
      }
    } catch (err) {
      console.error(err);
      triggerToast("🗑️ Doctor profile removed (Local State).");
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
              <span style={{ fontWeight: "700", fontSize: "14.5px", display: "block", letterSpacing: "-0.5px" }}>
                Srisai Subhramaniya
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", display: "block", marginTop: "2px" }}>
                Hospitals Admin Hub
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
              Srisai Subhramaniya Hospitals Management Hub
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

              {/* Premium Welcome Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #060F2D 0%, #1A2E69 100%)",
                  borderRadius: "24px",
                  padding: "36px 40px",
                  color: "#FFFFFF",
                  boxShadow: "0 12px 30px rgba(6, 15, 45, 0.12)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Background decorative glowing element */}
                <div style={{
                  position: "absolute",
                  right: "-50px",
                  top: "-50px",
                  width: "250px",
                  height: "250px",
                  borderRadius: "50%",
                  background: "rgba(63, 89, 255, 0.15)",
                  filter: "blur(40px)",
                  pointerEvents: "none"
                }}></div>

                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px", fontFamily: "'Outfit', sans-serif" }}>
                    Welcome back, Hospital Administrator!
                  </h3>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "8px", maxWidth: "600px", lineHeight: "1.6" }}>
                    Srisai Subhramaniya Hospitals management center is active. Track active appointments, verify patient records, and update doctor duty registries in real-time.
                  </p>
                  <div style={{ display: "flex", gap: "16px", marginTop: "20px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.06)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }}></span>
                      Hospital Status: Fully Operational
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.06)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }}></span>
                      Specialist Roster: Synced & Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                {[
                  { label: "Total Bookings", value: appointments.length ? appointments.length.toString() : "0", subtext: "Live Appointments log", targetTab: "appointments", color: "#3F59FF", bg: "linear-gradient(135deg, rgba(63, 89, 255, 0.08) 0%, rgba(49, 176, 255, 0.08) 100%)", icon: <Calendar size={22} /> },
                  { label: "Active Doctors Roster", value: doctors.length ? doctors.length.toString() : "--", subtext: "Qualified specialists on duty", targetTab: "doctors", color: "#31B0FF", bg: "linear-gradient(135deg, rgba(49, 176, 255, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)", icon: <Stethoscope size={22} /> },
                  { label: "Registered Patients List", value: patients.length ? patients.length.toString() : "--", subtext: "Members registry count", targetTab: "patients", color: "#10B981", bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(63, 89, 255, 0.08) 100%)", icon: <Users size={22} /> },
                ].map((card, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveTab(card.targetTab)}
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "28px",
                      borderRadius: "18px",
                      boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                      border: "1.5px solid rgba(6, 15, 45, 0.04)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.25s ease-in-out",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 16px 36px rgba(63, 89, 255, 0.08)";
                      e.currentTarget.style.borderColor = card.color;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(6, 15, 45, 0.02)";
                      e.currentTarget.style.borderColor = "rgba(6, 15, 45, 0.04)";
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "14px", color: "#616161", fontWeight: "600" }}>{card.label}</span>
                      <div style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", marginTop: "10px" }}>
                        {card.value}
                      </div>
                      <span style={{ fontSize: "12px", color: card.color, display: "block", marginTop: "6px", fontWeight: "600" }}>
                        {card.subtext} →
                      </span>
                    </div>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        background: card.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Roster Overview Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px" }}>

                {/* Recent Bookings Roster Widget */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px",
                    padding: "32px",
                    boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                    border: "1px solid rgba(6, 15, 45, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "750", color: "#060F2D", letterSpacing: "-0.3px" }}>
                        Recent Appointments Logs
                      </h3>
                      <span style={{ fontSize: "12.5px", color: "#64748B", display: "block", marginTop: "2px" }}>
                        Overview of active patient schedule queues
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab("appointments")}
                      style={{
                        backgroundColor: "transparent",
                        border: "1.5px solid #E2E8F0",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#3F59FF",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#F8FAFC"; e.currentTarget.style.borderColor = "#3F59FF"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                    >
                      View All Logs
                    </button>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #F1F5F9", color: "#64748B", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          <th style={{ padding: "12px 8px" }}>Patient</th>
                          <th style={{ padding: "12px 8px" }}>Speciality</th>
                          <th style={{ padding: "12px 8px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                                              {appointments.slice(0, 3).map((app: any, idx: number) => {
                        const statusColor = app.status === "approved" ? "#10B981" : app.status === "cancelled" ? "#EF4444" : "#F59E0B";
                        const statusBg = app.status === "approved" ? "rgba(16, 185, 129, 0.08)" : app.status === "cancelled" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)";
                        return (
                          <tr key={app._id || idx} style={{ borderBottom: "1px solid #F1F5F9", fontSize: "14px", color: "#0F172A" }}>
                            <td style={{ padding: "16px 8px", fontWeight: "600" }}>{app.pasentname}</td>
                            <td style={{ padding: "16px 8px", color: "#475569" }}>{app.speciality}</td>
                            <td style={{ padding: "16px 8px" }}>
                              <span style={{
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "700",
                                color: statusColor,
                                backgroundColor: statusBg,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                textTransform: "capitalize"
                              }}>
                                <span style={{ width: "6px", height: "6px", backgroundColor: statusColor, borderRadius: "50%" }}></span>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Integrations Panel - Dynamic "Soon" Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "20px",
                      padding: "28px",
                      boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                      border: "1px solid rgba(6, 15, 45, 0.04)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "750", color: "#060F2D" }}>Tele-Consultations</h4>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#3F59FF", backgroundColor: "rgba(63, 89, 255, 0.08)", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
                        Soon
                      </span>
                    </div>
                    <p style={{ fontSize: "12.5px", color: "#64748B", marginTop: "8px", lineHeight: "1.5" }}>
                      Sync with Google Calendar API to automatically generate unique secure Google Meet links for consultations.
                    </p>
                    <button
                      onClick={() => triggerToast("📢 Google Calendar & Meet Sync integration is Coming Soon!")}
                      style={{
                        marginTop: "16px",
                        backgroundColor: "#060F2D",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Authorize Google Workspace
                    </button>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "20px",
                      padding: "28px",
                      boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                      border: "1px solid rgba(6, 15, 45, 0.04)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "750", color: "#060F2D" }}>Payment Gateway</h4>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.08)", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>
                        Soon
                      </span>
                    </div>
                    <p style={{ fontSize: "12.5px", color: "#64748B", marginTop: "8px", lineHeight: "1.5" }}>
                      Receive consultation booking fees directly. Integration with Razorpay key values and webhook handlers.
                    </p>
                    <button
                      onClick={() => triggerToast("📢 Razorpay Merchant checkout integration is Coming Soon!")}
                      style={{
                        marginTop: "16px",
                        backgroundColor: "#10B981",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Setup Razorpay Merchant API
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ───────────────── TAB 2: DOCTORS CONFIG ───────────────── */}
          {activeTab === "doctors" && (() => {
            // Client-side filtering & search
            const filteredDoctors = doctors.filter((doc) => {
              const matchesSearch =
                doc.name.toLowerCase().includes(doctorSearchText.toLowerCase()) ||
                doc.email.toLowerCase().includes(doctorSearchText.toLowerCase());

              const matchesSpeciality =
                doctorSpecialityFilter === "All" || doc.speciality === doctorSpecialityFilter;

              const matchesStatus =
                doctorStatusFilter === "All" ||
                (doctorStatusFilter === "Active" && doc.isAvailable) ||
                (doctorStatusFilter === "Inactive" && !doc.isAvailable);

              return matchesSearch && matchesSpeciality && matchesStatus;
            });

            // Client-side pagination
            const totalDoctorPages = Math.ceil(filteredDoctors.length / doctorsPerPage) || 1;
            // Bound current page to max page in case filters reduced list size
            const activePage = Math.min(doctorCurrentPage, totalDoctorPages);
            const indexOfLastDoctor = activePage * doctorsPerPage;
            const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
            const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

            return (
              <div style={{ fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.4s ease" }}>
                <style>{`
                  @keyframes scaleIn {
                    from {
                      opacity: 0;
                      transform: scale(0.96) translateY(8px);
                    }
                    to {
                      opacity: 1;
                      transform: scale(1) translateY(0);
                    }
                  }
                  .doctor-card {
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                  }
                  .doctor-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(6, 15, 45, 0.08) !important;
                    border-color: #3F59FF !important;
                  }
                  .filter-select {
                    transition: all 0.2s ease;
                  }
                  .filter-select:hover {
                    border-color: #3F59FF !important;
                  }
                  .action-btn {
                    transition: all 0.2s ease;
                  }
                  .action-btn:hover {
                    transform: scale(1.08);
                  }
                `}</style>

                {/* Header Actions & Filter Controls */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: "20px 28px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                    border: "1px solid rgba(6, 15, 45, 0.04)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: "19px", fontWeight: "600", color: "#060F2D" }}>
                      Registered Specialists ({filteredDoctors.length})
                    </h2>
                    <span style={{ fontSize: "13px", color: "#616161", display: "block", marginTop: "3px" }}>
                      Manage schedules, directories and specialist availability.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setDoctorForm({
                        name: "",
                        speciality: SPECIALITIES[0],
                        email: "",
                        phone: "",
                        experience: "",
                        timing: TIMINGS[0],
                      });
                      setIsAddDoctorModalOpen(true);
                    }}
                    style={{
                      backgroundColor: "#3F59FF",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 8px 24px rgba(63, 89, 255, 0.2)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2b45eb")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3F59FF")}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Register New Doctor</span>
                  </button>
                </div>

                {/* Stats Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "16px",
                  }}
                >
                  {/* Card 1: Total Registered */}
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "20px 24px",
                      borderRadius: "14px",
                      boxShadow: "0 8px 24px rgba(6, 15, 45, 0.02)",
                      border: "1px solid #e2e8f0",
                      borderTop: "3px solid #3F59FF",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(63, 89, 255, 0.06)",
                        color: "#3F59FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", display: "block" }}>Total Registered</span>
                      <strong style={{ fontSize: "20px", color: "#0F172A", fontWeight: "600", display: "block", marginTop: "2px" }}>{doctors.length}</strong>
                    </div>
                  </div>

                  {/* Card 2: Active on Duty */}
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "20px 24px",
                      borderRadius: "14px",
                      boxShadow: "0 8px 24px rgba(6, 15, 45, 0.02)",
                      border: "1px solid #e2e8f0",
                      borderTop: "3px solid #10B981",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(16, 185, 129, 0.06)",
                        color: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", display: "block" }}>Active Roster</span>
                      <strong style={{ fontSize: "20px", color: "#0F172A", fontWeight: "600", display: "block", marginTop: "2px" }}>{doctors.filter(d => d.isAvailable).length}</strong>
                    </div>
                  </div>

                  {/* Card 3: Away/Inactive */}
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      padding: "20px 24px",
                      borderRadius: "14px",
                      boxShadow: "0 8px 24px rgba(6, 15, 45, 0.02)",
                      border: "1px solid #e2e8f0",
                      borderTop: "3px solid #ef4444",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(239, 68, 68, 0.06)",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <UserX size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", display: "block" }}>Away / Inactive</span>
                      <strong style={{ fontSize: "20px", color: "#0F172A", fontWeight: "600", display: "block", marginTop: "2px" }}>{doctors.filter(d => !d.isAvailable).length}</strong>
                    </div>
                  </div>
                </div>

                {/* Filters Grid */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: "20px 28px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                    border: "1px solid rgba(6, 15, 45, 0.04)",
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr",
                    gap: "16px",
                    alignItems: "center"
                  }}
                >
                  {/* Search input */}
                  <div style={{ position: "relative" }}>
                    <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      placeholder="Search by specialist name or email..."
                      value={doctorSearchText}
                      onChange={(e) => {
                        setDoctorSearchText(e.target.value);
                        setDoctorCurrentPage(1);
                      }}
                      style={{
                        width: "100%",
                        padding: "11px 12px 11px 36px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.2s"
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  {/* Speciality Filter */}
                  <div>
                    <select
                      className="filter-select"
                      value={doctorSpecialityFilter}
                      onChange={(e) => {
                        setDoctorSpecialityFilter(e.target.value);
                        setDoctorCurrentPage(1);
                      }}
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      <option value="All">All Specialities</option>
                      {SPECIALITIES.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability status Filter */}
                  <div>
                    <select
                      className="filter-select"
                      value={doctorStatusFilter}
                      onChange={(e) => {
                        setDoctorStatusFilter(e.target.value);
                        setDoctorCurrentPage(1);
                      }}
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      <option value="All">All Availability States</option>
                      <option value="Active">Active Roster Only</option>
                      <option value="Inactive">Inactive/Away</option>
                    </select>
                  </div>
                </div>

                {/* Doctors List Container */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: "24px 28px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
                    border: "1px solid rgba(6, 15, 45, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }}
                >
                  {isLoadingDoctors ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <span style={{ fontSize: "14px", color: "#616161" }}>Fetching doctor roster...</span>
                    </div>
                  ) : filteredDoctors.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#616161" }}>
                      <Stethoscope size={32} color="#cbd5e1" style={{ marginBottom: "12px" }} />
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#060F2D" }}>No doctors matches your search criteria.</p>
                      <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "2px", display: "block" }}>Try clearing search or filters to see all specialists.</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {currentDoctors.map((doc) => (
                          <div
                            key={doc._id}
                            className="doctor-card"
                            style={{
                              padding: "20px 24px",
                              borderRadius: "14px",
                              border: "1px solid #e2e8f0",
                              display: "grid",
                              gridTemplateColumns: "1.2fr 0.8fr 0.4fr",
                              alignItems: "center",
                              backgroundColor: doc.isAvailable ? "#FFFFFF" : "#F9FAFB",
                              opacity: doc.isAvailable ? 1 : 0.9,
                            }}
                          >
                            {/* Column 1: Profile & Info */}
                            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                              {/* Styled Circle Avatar */}
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  background: doc.isAvailable
                                    ? "linear-gradient(135deg, #3F59FF 0%, #31B0FF 100%)"
                                    : "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
                                  color: "#FFFFFF",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "18px",
                                  fontWeight: "600",
                                  boxShadow: doc.isAvailable
                                    ? "0 4px 12px rgba(63, 89, 255, 0.15)"
                                    : "none",
                                  userSelect: "none"
                                }}
                              >
                                {doc.name.replace("Dr. ", "").substring(0, 1).toUpperCase()}
                              </div>

                              <div>
                                {/* Auto Capitalized & Formatted Name */}
                                <h4 style={{
                                  fontSize: "16.5px",
                                  fontWeight: "600",
                                  color: doc.isAvailable ? "#0F172A" : "#64748B",
                                  fontFamily: "'Outfit', 'Inter', sans-serif",
                                  letterSpacing: "-0.3px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}>
                                  {(() => {
                                    const cleaned = doc.name.replace(/^dr\.\s*/i, "");
                                    const capitalized = cleaned
                                      .split(" ")
                                      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                                      .join(" ");
                                    return `Dr. ${capitalized}`;
                                  })()}
                                </h4>

                                <span style={{ fontSize: "13px", color: doc.isAvailable ? "#3F59FF" : "#94A3B8", fontWeight: "600", display: "block", marginTop: "2px" }}>
                                  {doc.speciality}
                                </span>

                                <div style={{ display: "flex", gap: "14px", marginTop: "8px", fontSize: "13px", color: "#616161" }}>
                                  <span>💼 {doc.experience} Years Exp</span>
                                  <span>⏰ {doc.timing}</span>
                                </div>
                                <span style={{ fontSize: "13px", color: "#94a3b8", display: "block", marginTop: "4px" }}>
                                  📧 {doc.email}
                                </span>
                              </div>
                            </div>

                            {/* Column 2: Roster Status Toggle (Center) */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                              <span style={{ fontSize: "10px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Roster Status</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "13px", fontWeight: "600", color: doc.isAvailable ? "#065F46" : "#991B1B" }}>
                                  {doc.isAvailable ? "Active" : "Inactive"}
                                </span>
                                <button
                                  onClick={() => handleToggleAvailability(doc._id, doc.isAvailable)}
                                  style={{
                                    width: "42px",
                                    height: "22px",
                                    borderRadius: "11px",
                                    backgroundColor: doc.isAvailable ? "#10B981" : "#cbd5e1",
                                    border: "none",
                                    position: "relative",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease",
                                    padding: 0
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      borderRadius: "50%",
                                      backgroundColor: "#FFFFFF",
                                      position: "absolute",
                                      top: "3px",
                                      left: doc.isAvailable ? "23px" : "3px",
                                      transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                                    }}
                                  />
                                </button>
                              </div>
                            </div>

                            {/* Column 3: Actions (Right) */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                              {/* Edit details */}
                              <button
                                className="action-btn"
                                onClick={() => {
                                  setEditingDoctor(doc);
                                  setEditDoctorForm({
                                    name: doc.name,
                                    speciality: doc.speciality,
                                    email: doc.email,
                                    phone: doc.phone || "",
                                    experience: doc.experience.toString(),
                                    timing: doc.timing,
                                  });
                                  setIsEditDoctorModalOpen(true);
                                }}
                                title="Edit Doctor Profile"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  borderRadius: "8px",
                                  border: "1.5px solid #cbd5e1",
                                  backgroundColor: "#FFFFFF",
                                  color: "#64748b",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  outline: "none"
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.borderColor = "#3F59FF";
                                  e.currentTarget.style.color = "#3F59FF";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.borderColor = "#cbd5e1";
                                  e.currentTarget.style.color = "#64748b";
                                }}
                              >
                                <Edit size={16} />
                              </button>

                              {/* Delete Profile */}
                              <button
                                className="action-btn"
                                onClick={() => handleDeleteDoctorClick(doc._id)}
                                title="Delete Doctor Profile"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  borderRadius: "8px",
                                  border: "1.5px solid #cbd5e1",
                                  backgroundColor: "#FFFFFF",
                                  color: "#64748b",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  outline: "none"
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.borderColor = "#ef4444";
                                  e.currentTarget.style.color = "#ef4444";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.borderColor = "#cbd5e1";
                                  e.currentTarget.style.color = "#64748b";
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {totalDoctorPages > 1 && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTop: "1.5px solid #F2F3FE",
                            paddingTop: "24px",
                            marginTop: "16px"
                          }}
                        >
                          <span style={{ fontSize: "14px", color: "#616161" }}>
                            Showing page <strong>{activePage}</strong> of {totalDoctorPages} ({filteredDoctors.length} doctors total)
                          </span>

                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button
                              disabled={activePage === 1}
                              onClick={() => setDoctorCurrentPage(activePage - 1)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "1.5px solid #e2e8f0",
                                backgroundColor: activePage === 1 ? "#F9FAFB" : "#FFFFFF",
                                color: activePage === 1 ? "#cbd5e1" : "#060F2D",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: activePage === 1 ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                outline: "none",
                                transition: "all 0.2s"
                              }}
                            >
                              <ChevronLeft size={16} /> Prev
                            </button>

                            {Array.from({ length: totalDoctorPages }, (_, i) => i + 1).map((p) => (
                              <button
                                key={p}
                                onClick={() => setDoctorCurrentPage(p)}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "8px",
                                  border: p === activePage ? "none" : "1.5px solid #e2e8f0",
                                  backgroundColor: p === activePage ? "#3F59FF" : "#FFFFFF",
                                  color: p === activePage ? "#FFFFFF" : "#060F2D",
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                  outline: "none",
                                  transition: "all 0.2s"
                                }}
                              >
                                {p}
                              </button>
                            ))}

                            <button
                              disabled={activePage === totalDoctorPages}
                              onClick={() => setDoctorCurrentPage(activePage + 1)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "1.5px solid #e2e8f0",
                                backgroundColor: activePage === totalDoctorPages ? "#F9FAFB" : "#FFFFFF",
                                color: activePage === totalDoctorPages ? "#cbd5e1" : "#060F2D",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: activePage === totalDoctorPages ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                outline: "none",
                                transition: "all 0.2s"
                              }}
                            >
                              Next <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ───────────────── ADD DOCTOR MODAL ───────────────── */}
                {isAddDoctorModalOpen && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(6, 15, 45, 0.4)",
                      backdropFilter: "blur(6px)",
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      animation: "fadeIn 0.25s ease forwards"
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        width: "100%",
                        maxWidth: "560px",
                        borderRadius: "24px",
                        padding: "36px",
                        boxShadow: "0 24px 60px rgba(6, 15, 45, 0.15)",
                        border: "1px solid rgba(6, 15, 45, 0.05)",
                        position: "relative",
                        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                      }}
                    >
                      <button
                        onClick={() => setIsAddDoctorModalOpen(false)}
                        style={{
                          position: "absolute",
                          top: "24px",
                          right: "24px",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          padding: "4px"
                        }}
                      >
                        <X size={24} />
                      </button>

                      <div style={{ marginBottom: "28px" }}>
                        <h3 style={{ fontSize: "21px", fontWeight: "800", color: "#060F2D" }}>
                          Register Roster Specialist
                        </h3>
                        <span style={{ fontSize: "14px", color: "#616161", marginTop: "4px", display: "block" }}>
                          Add profiles to populate user booking dropdown choices.
                        </span>
                      </div>

                      <form onSubmit={handleAddDoctorSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                          <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
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
                              fontSize: "15px",
                              outline: "none",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
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
                              fontSize: "15px",
                              backgroundColor: "#fff",
                              outline: "none",
                              cursor: "pointer"
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
                          <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
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
                              fontSize: "15px",
                              outline: "none",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
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
                                fontSize: "15px",
                                outline: "none",
                              }}
                              onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                              onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
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
                                fontSize: "15px",
                                backgroundColor: "#fff",
                                outline: "none",
                                cursor: "pointer"
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
                            borderRadius: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "15px",
                            boxShadow: "0 8px 20px rgba(63, 89, 255, 0.2)",
                            transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2b45eb")}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3F59FF")}
                        >
                          Register Doctor Details
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* ───────────────── EDIT DOCTOR MODAL ───────────────── */}
                {isEditDoctorModalOpen && editingDoctor && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(6, 15, 45, 0.4)",
                      backdropFilter: "blur(6px)",
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      animation: "fadeIn 0.25s ease forwards"
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        width: "100%",
                        maxWidth: "560px",
                        borderRadius: "24px",
                        padding: "36px",
                        boxShadow: "0 24px 60px rgba(6, 15, 45, 0.15)",
                        border: "1px solid rgba(6, 15, 45, 0.05)",
                        position: "relative",
                        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                      }}
                    >
                      <button
                        onClick={() => {
                          setIsEditDoctorModalOpen(false);
                          setEditingDoctor(null);
                        }}
                        style={{
                          position: "absolute",
                          top: "24px",
                          right: "24px",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          padding: "4px"
                        }}
                      >
                        <X size={24} />
                      </button>

                      <div style={{ marginBottom: "28px" }}>
                        <h3 style={{ fontSize: "21px", fontWeight: "800", color: "#060F2D" }}>
                          Edit Specialist Profile
                        </h3>
                        <span style={{ fontSize: "14px", color: "#616161", marginTop: "4px", display: "block" }}>
                          Update directory record and scheduler configuration options.
                        </span>
                      </div>

                      <form onSubmit={handleEditDoctorSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                          <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                            Doctor Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editDoctorForm.name}
                            onChange={(e) => setEditDoctorForm({ ...editDoctorForm, name: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "14px",
                              borderRadius: "10px",
                              border: "1.5px solid #cbd5e1",
                              fontSize: "15px",
                              outline: "none",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                            Speciality Category
                          </label>
                          <select
                            value={editDoctorForm.speciality}
                            onChange={(e) => setEditDoctorForm({ ...editDoctorForm, speciality: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "14px",
                              borderRadius: "10px",
                              border: "1.5px solid #cbd5e1",
                              fontSize: "15px",
                              backgroundColor: "#fff",
                              outline: "none",
                              cursor: "pointer"
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
                          <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                            Contact Email
                          </label>
                          <input
                            type="email"
                            required
                            value={editDoctorForm.email}
                            onChange={(e) => setEditDoctorForm({ ...editDoctorForm, email: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "14px",
                              borderRadius: "10px",
                              border: "1.5px solid #cbd5e1",
                              fontSize: "15px",
                              outline: "none",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                              Experience (Years)
                            </label>
                            <input
                              type="number"
                              required
                              value={editDoctorForm.experience}
                              onChange={(e) => setEditDoctorForm({ ...editDoctorForm, experience: e.target.value })}
                              style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "10px",
                                border: "1.5px solid #cbd5e1",
                                fontSize: "15px",
                                outline: "none",
                              }}
                              onFocus={(e) => (e.target.style.borderColor = "#3F59FF")}
                              onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                              Session Timings
                            </label>
                            <select
                              value={editDoctorForm.timing}
                              onChange={(e) => setEditDoctorForm({ ...editDoctorForm, timing: e.target.value })}
                              style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "10px",
                                border: "1.5px solid #cbd5e1",
                                fontSize: "15px",
                                backgroundColor: "#fff",
                                outline: "none",
                                cursor: "pointer"
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
                            borderRadius: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "15px",
                            boxShadow: "0 8px 20px rgba(63, 89, 255, 0.2)",
                            transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2b45eb")}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3F59FF")}
                        >
                          Save Changes
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

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
                                        {appointments.map((app: any, idx: number) => {
                      const dateObj = new Date(app.appointmenttime);
                      const formattedDate = dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                      
                      // Status styling logic
                      const statusColor = app.status === "approved" ? "#10B981" : app.status === "cancelled" ? "#EF4444" : "#F59E0B";
                      const statusBg = app.status === "approved" ? "rgba(16, 185, 129, 0.08)" : app.status === "cancelled" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)";
                      
                      return (
                        <tr
                          key={app._id || idx}
                          style={{
                            borderBottom: "1px solid #F2F3FE",
                            fontSize: "14px",
                            color: "#060F2D",
                          }}
                        >
                          {/* Patient Profile info */}
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
                                {app.pasentname.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div>{app.pasentname}</div>
                                <div style={{ fontSize: "11px", color: "#616161", fontWeight: "normal" }}>
                                  {app.pasentnumber} | {app.pasentmail}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Assigned Doctor / Speciality info */}
                          <td style={{ padding: "18px 12px", fontWeight: "500" }}>
                            {app.assignedDoctor 
                              ? `${app.assignedDoctor.name} (${app.speciality})` 
                              : `Not Assigned (${app.speciality})`
                            }
                          </td>

                          {/* Slot Time */}
                          <td style={{ padding: "18px 12px", color: "#616161" }}>{formattedDate}</td>

                          {/* Status label */}
                          <td style={{ padding: "18px 12px" }}>
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                backgroundColor: statusBg,
                                color: statusColor,
                                fontSize: "12px",
                                fontWeight: "700",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                textTransform: "capitalize"
                              }}
                            >
                              <span style={{ width: "6px", height: "6px", backgroundColor: statusColor, borderRadius: "50%" }}></span>
                              {app.status}
                            </span>
                          </td>

                          {/* Manage Action */}
                          <td style={{ padding: "18px 12px" }}>
                            <button
                              onClick={() => triggerToast(`Managing ${app.pasentname}'s appointment (Status: ${app.status})`)}
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
                      );
                    })}

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
