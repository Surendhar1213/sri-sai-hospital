import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaCreditCard,
  FaFileAlt,
  FaHome,
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaPrint,
  FaCopy,
  FaCheck
} from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check Auth
    const token = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("userInfo");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserName(user.name || "User");
      setUserEmail(user.email || "");
      setUserPhone(user.phone || "");
    }

    // Read URL query parameter for tab selection
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [navigate]);

  // Fetch appointments
  useEffect(() => {
    if (!userEmail) return;

    const fetchAppointments = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${backendUrl}/api/appointments?email=${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Find next upcoming appointment
  const upcomingAppointment = appointments
    .filter(app => app.status === "approved" && new Date(app.appointmenttime) > new Date())
    .sort((a, b) => new Date(a.appointmenttime).getTime() - new Date(b.appointmenttime).getTime())[0];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FFFFFF",
      fontFamily: "'Inter', sans-serif",
      color: "#4D5765",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1240px",
        margin: "0 auto"
      }}>
        {/* Top Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "36px",
          animation: "fadeInUp 0.4s ease"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3F59FF" }}></span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#3F59FF", letterSpacing: "1.2px", textTransform: "uppercase" }}>Sri Sai Subhramaniya Hospital</span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "700", color: "#0F2239", margin: 0, letterSpacing: "-0.3px" }}>Patient Dashboard</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="home-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 22px",
              borderRadius: "50px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              fontSize: "15px",
              fontWeight: "700",
              color: "#3F59FF",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <FaHome /> Back to Home
          </button>
        </div>

        {/* Dashboard Layout Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "310px 1fr",
          gap: "36px",
          alignItems: "start",
          animation: "fadeInUp 0.5s ease"
        }}>
          {/* Left Sidebar - Clean Pure White Container */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EBF1F9",
            padding: "28px 24px",
            boxShadow: "0 10px 30px rgba(77, 87, 101, 0.03)"
          }}>
            {/* User Info - Flex Row Layout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingBottom: "24px",
              borderBottom: "1px solid #F1F5F9",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3F59FF 0%, #31B0FF 100%)",
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(63, 89, 255, 0.1)",
                border: "2px solid #FFFFFF"
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F2239", margin: 0 }}>{userName}</h3>
                <p style={{ margin: "2px 0 0 0", color: "#72849B", fontSize: "14px", fontWeight: "600" }}>{userEmail}</p>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { id: "overview", label: "Overview", icon: <FaHome /> },
                { id: "appointments", label: "My Appointments", icon: <FaCalendarAlt /> },
                { id: "prescriptions", label: "Prescriptions Slip", icon: <FaFileAlt /> },
                { id: "payments", label: "Payment Receipts", icon: <FaCreditCard /> },
                { id: "settings", label: "Patient Profile", icon: <FaUser /> }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      padding: "12px 18px",
                      border: "none",
                      borderRadius: "12px",
                      backgroundColor: isActive ? "rgba(63, 89, 255, 0.08)" : "transparent",
                      color: isActive ? "#3F59FF" : "#72849B",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "18px", display: "flex" }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 18px",
                  border: "none",
                  borderRadius: "12px",
                  backgroundColor: "transparent",
                  color: "#EF4444",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  textAlign: "left",
                  marginTop: "24px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span style={{ fontSize: "18px", display: "flex" }}><FaSignOutAlt /></span>
                Log Out
              </button>
            </div>
          </div>

          {/* Right Detailed Panel */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EBF1F9",
            padding: "36px",
            minHeight: "540px",
            boxShadow: "0 10px 30px rgba(77, 87, 101, 0.03)"
          }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px" }}>
                <div style={{ border: "3px solid #E2E8F0", borderTop: "3px solid #3F59FF", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: "16px", color: "#72849B", fontWeight: "700", fontSize: "16px" }}>Loading records...</p>
              </div>
            ) : (
              <>
                {/* 1. OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>Welcome Back, {userName.split(" ")[0]}!</h2>
                    <p style={{ margin: 0, color: "#72849B", fontSize: "15px", fontWeight: "600", marginBottom: "28px" }}>Here is your telehealth dashboard overview.</p>
                    
                    {/* Clean scheduled consult banner */}
                    {upcomingAppointment ? (
                      <div style={{
                        background: "linear-gradient(135deg, #0F2239 0%, #1A3454 100%)",
                        borderRadius: "14px",
                        padding: "28px",
                        color: "#FFFFFF",
                        marginBottom: "32px",
                        boxShadow: "0 8px 24px rgba(15, 34, 57, 0.08)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                          <div>
                            <span style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              backgroundColor: "rgba(63, 89, 255, 0.2)",
                              color: "#FFFFFF",
                              padding: "4px 10px",
                              borderRadius: "4px",
                              display: "inline-block",
                              marginBottom: "12px"
                            }}>
                              Upcoming Consultation
                            </span>
                            <h3 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 10px 0" }}>{upcomingAppointment.speciality}</h3>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                                <FaStethoscope style={{ color: "#3F59FF" }} /> Specialist: <strong style={{ color: "#FFFFFF", fontWeight: "600" }}>{upcomingAppointment.assignedDoctor ? upcomingAppointment.assignedDoctor.name : "Not Assigned"}</strong>
                              </p>
                              <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                                <FaClock style={{ color: "#3F59FF" }} /> Scheduled: <strong style={{ color: "#FFFFFF", fontWeight: "600" }}>{new Date(upcomingAppointment.appointmenttime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong>
                              </p>
                            </div>
                          </div>
                          {upcomingAppointment.meetingLink && (
                            <a
                              href={upcomingAppointment.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "12px 24px",
                                borderRadius: "6px",
                                backgroundColor: "#3F59FF",
                                color: "#FFFFFF",
                                textDecoration: "none",
                                fontWeight: "700",
                                fontSize: "16px",
                                boxShadow: "0 4px 12px rgba(63, 89, 255, 0.2)",
                                transition: "all 0.2s"
                              }}
                            >
                              🎥 Join Consultation
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        border: "1.5px dashed #EBF1F9",
                        borderRadius: "14px",
                        padding: "36px",
                        textAlign: "center",
                        color: "#72849B",
                        marginBottom: "32px"
                      }}>
                        <FaCalendarAlt size={32} style={{ color: "#94A3B8", marginBottom: "12px" }} />
                        <h4 style={{ fontSize: "17px", fontWeight: "700", color: "#4D5765", margin: "0 0 4px 0" }}>No upcoming consultations</h4>
                        <p style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>Book an appointment from Home to speak with a doctor.</p>
                      </div>
                    )}

                    {/* Quick Stats Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                      {[
                        { title: "Total Bookings", value: appointments.length, color: "#3F59FF", bg: "rgba(63, 89, 255, 0.06)" },
                        { title: "Approved Calls", value: appointments.filter(a => a.status === "approved").length, color: "#10B981", bg: "rgba(16, 185, 129, 0.06)" },
                        { title: "Completed Sessions", value: appointments.filter(a => a.status === "completed").length, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.06)" }
                      ].map((stat, idx) => (
                        <div key={idx} style={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #EBF1F9",
                          borderRadius: "14px",
                          padding: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.title}</span>
                            <h4 style={{ fontSize: "28px", fontWeight: "700", color: "#0F2239", margin: "6px 0 0 0" }}>{stat.value}</h4>
                          </div>
                          <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: stat.bg, color: stat.color, display: "flex", alignItems: "center", fontSize: "18px", fontWeight: "700", justifyContent: "center" }}>
                            #
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MY APPOINTMENTS TAB */}
                {activeTab === "appointments" && (
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>My Appointments</h2>
                    <p style={{ margin: 0, color: "#72849B", fontSize: "15px", fontWeight: "600", marginBottom: "28px" }}>Track consultation statuses and connect live.</p>

                    {appointments.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <FaCalendarAlt size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#4D5765", margin: "0 0 4px 0" }}>No bookings found</h3>
                        <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px" }}>Your scheduled consultations will be listed here.</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {appointments.map((app) => {
                          const statusColor = app.status === "approved" ? "#10B981" : app.status === "completed" ? "#3B82F6" : app.status === "cancelled" ? "#EF4444" : "#F59E0B";
                          const statusBg = app.status === "approved" ? "rgba(16, 185, 129, 0.06)" : app.status === "completed" ? "rgba(59, 130, 246, 0.06)" : app.status === "cancelled" ? "rgba(239, 68, 68, 0.06)" : "rgba(245, 158, 11, 0.06)";
                          return (
                            <div key={app._id} style={{
                              border: "1px solid #EBF1F9",
                              borderRadius: "14px",
                              padding: "20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "20px",
                              backgroundColor: "#FFFFFF"
                            }}>
                              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                <div style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "12px",
                                  backgroundColor: "rgba(63, 89, 255, 0.05)",
                                  color: "#3F59FF",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "22px"
                                }}>
                                  <FaStethoscope />
                                </div>
                                <div>
                                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F2239", margin: "0 0 4px 0" }}>{app.speciality}</h3>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                    <span style={{ color: "#72849B", fontSize: "14px", fontWeight: "600" }}>
                                      Doctor: <strong style={{ color: "#4D5765", fontWeight: "600" }}>{app.assignedDoctor ? app.assignedDoctor.name : "Not Assigned"}</strong>
                                    </span>
                                    <span style={{ color: "#72849B", fontSize: "14px", fontWeight: "600" }}>
                                      Slot: <strong style={{ color: "#4D5765", fontWeight: "600" }}>{new Date(app.appointmenttime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{
                                  padding: "4px 10px",
                                  borderRadius: "12px",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  color: statusColor,
                                  backgroundColor: statusBg,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textTransform: "uppercase"
                                }}>
                                  <span style={{ width: "5px", height: "5px", backgroundColor: statusColor, borderRadius: "50%" }}></span>
                                  {app.status}
                                </span>

                                {app.status === "approved" && app.meetingLink && (
                                  <a
                                    href={app.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      backgroundColor: "#3F59FF",
                                      color: "#FFFFFF",
                                      padding: "8px 16px",
                                      borderRadius: "6px",
                                      textDecoration: "none",
                                      fontWeight: "700",
                                      fontSize: "14px",
                                      boxShadow: "0 4px 10px rgba(63, 89, 255, 0.15)",
                                      transition: "background 0.2s"
                                    }}
                                  >
                                    🎥 Join Call
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PRESCRIPTIONS TAB */}
                {activeTab === "prescriptions" && (
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>Medical Prescriptions</h2>
                    <p style={{ margin: 0, color: "#72849B", fontSize: "15px", fontWeight: "600", marginBottom: "28px" }}>View prescriptions shared by your specialist doctor.</p>

                    {appointments.filter(a => a.status === "completed" && a.prescription).length === 0 ? (
                      <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <FaFileAlt size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#4D5765", margin: "0 0 4px 0" }}>No prescriptions found</h3>
                        <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px" }}>Doctor prescriptions will show here after completed sessions.</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {appointments
                          .filter(app => app.status === "completed" && app.prescription)
                          .map((app) => (
                            <div 
                              key={app._id} 
                              style={{
                                border: "1px solid #EBF1F9",
                                borderRadius: "14px",
                                backgroundColor: "#FFFFFF",
                                overflow: "hidden"
                              }}
                            >
                              {/* Clinical Letterhead Header */}
                              <div style={{
                                background: "#0F2239",
                                padding: "20px 28px",
                                color: "#FFFFFF",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}>
                                <div>
                                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>SRI SAI HOSPITAL</h3>
                                  <span style={{ fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Telehealth Prescription slip</span>
                                </div>
                                <button
                                  onClick={() => window.print()}
                                  style={{
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    color: "#FFFFFF",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                  }}
                                >
                                  <FaPrint /> Print
                                </button>
                              </div>

                              {/* Prescription Body Details */}
                              <div style={{ padding: "24px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px dashed #E2E8F0", paddingBottom: "16px", marginBottom: "20px" }}>
                                  <div>
                                    <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#72849B", fontWeight: "700" }}>Patient</span>
                                    <h4 style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "700", color: "#0F2239" }}>{app.pasentname}</h4>
                                    <p style={{ margin: "2px 0 0 0", fontSize: "14px", color: "#72849B" }}>Phone: {app.pasentnumber}</p>
                                  </div>
                                  <div style={{ textAlign: "right" }}>
                                    <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#72849B", fontWeight: "700" }}>Consultant</span>
                                    <h4 style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "700", color: "#0F2239" }}>{app.assignedDoctor ? app.assignedDoctor.name : "Specialist Doctor"}</h4>
                                    <p style={{ margin: "2px 0 0 0", fontSize: "14px", color: "#72849B" }}>{app.speciality}</p>
                                  </div>
                                </div>

                                <div style={{ marginBottom: "24px" }}>
                                  <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#3F59FF", fontWeight: "700", letterSpacing: "1px" }}>Rx Notes</span>
                                  <div style={{
                                    marginTop: "8px",
                                    padding: "16px",
                                    backgroundColor: "#F8FAFC",
                                    border: "1px solid #EBF1F9",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    lineHeight: "1.6",
                                    whiteSpace: "pre-line",
                                    color: "#4D5765"
                                  }}>
                                    {app.prescription}
                                  </div>
                                </div>
                                
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#72849B" }}>
                                  <span>Date: {new Date(app.appointmenttime).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                                  <span style={{ color: "#3F59FF", fontWeight: "700" }}>Sri Sai Hospital Telehealth Verified</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. BILLING & PAYMENTS TAB */}
                {activeTab === "payments" && (
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>Payment Receipts</h2>
                    <p style={{ margin: 0, color: "#72849B", fontSize: "15px", fontWeight: "600", marginBottom: "28px" }}>Consultation fee receipts and transaction histories.</p>

                    {appointments.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <FaCreditCard size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#4D5765", margin: "0 0 4px 0" }}>No transactions found</h3>
                        <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px" }}>Invoices will appear here once booking is confirmed.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                          <thead>
                            <tr style={{ borderBottom: "2px solid #F1F5F9", color: "#72849B", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>
                              <th style={{ padding: "14px 16px" }}>Transaction Date</th>
                              <th style={{ padding: "14px 16px" }}>Booking Description</th>
                              <th style={{ padding: "14px 16px" }}>Amount Paid</th>
                              <th style={{ padding: "14px 16px" }}>Payment Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.map((app) => {
                              const payColor = app.paymentStatus === "paid" ? "#10B981" : app.paymentStatus === "failed" ? "#EF4444" : "#F59E0B";
                              const payBg = app.paymentStatus === "paid" ? "rgba(16, 185, 129, 0.06)" : app.paymentStatus === "failed" ? "rgba(239, 68, 68, 0.06)" : "rgba(245, 158, 11, 0.06)";
                              return (
                                <tr key={app._id} style={{ borderBottom: "1px solid #F1F5F9", fontSize: "15px", color: "#4D5765" }}>
                                  <td style={{ padding: "16px" }}>{new Date(app.createdAt || app.appointmenttime).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                                  <td style={{ padding: "16px" }}>
                                    <div style={{ fontWeight: "700", color: "#0F2239" }}>{app.speciality}</div>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                      <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "monospace" }}>{app.paymentId || app._id}</span>
                                      {(app.paymentId || app._id) && (
                                        <button
                                          onClick={() => copyToClipboard(app.paymentId || app._id)}
                                          style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", padding: "2px" }}
                                          title="Copy ID"
                                        >
                                          {copiedId === (app.paymentId || app._id) ? <FaCheck style={{ color: "#10B981" }} size={10} /> : <FaCopy size={10} />}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                  <td style={{ padding: "16px", fontWeight: "700", color: "#0F2239" }}>₹ 500.00</td>
                                  <td style={{ padding: "16px" }}>
                                    <span style={{
                                      padding: "4px 8px",
                                      borderRadius: "12px",
                                      fontSize: "12px",
                                      fontWeight: "700",
                                      color: payColor,
                                      backgroundColor: payBg,
                                      textTransform: "uppercase"
                                    }}>
                                      {app.paymentStatus || "pending"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. ACCOUNT SETTINGS TAB */}
                {activeTab === "settings" && (
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>Patient Profile Info</h2>
                    <p style={{ margin: 0, color: "#72849B", fontSize: "14px", fontWeight: "600", marginBottom: "28px" }}>Your registered telehealth profile details.</p>

                    <div style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #EBF1F9",
                      borderRadius: "14px",
                      padding: "28px",
                      maxWidth: "550px"
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Full Name</label>
                          <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                            {userName}
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Email Address</label>
                          <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                            {userEmail}
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Mobile Number</label>
                          <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                            {userPhone || "Not Provided"}
                          </div>
                        </div>

                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "14px",
                          backgroundColor: "rgba(16, 185, 129, 0.04)",
                          borderRadius: "10px",
                          border: "1px solid rgba(16, 185, 129, 0.1)",
                          color: "#10B981",
                          fontSize: "14px",
                          fontWeight: "700",
                          marginTop: "8px"
                        }}>
                          <FaCheckCircle size={18} /> Verified Sri Sai Patient Profile
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Styles for dynamic animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .home-btn:hover {
          background-color: #3F59FF !important;
          color: #FFFFFF !important;
          border-color: #3F59FF !important;
        }
        @media (max-width: 992px) {
          div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
