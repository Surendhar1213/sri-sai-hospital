import React, { useMemo } from "react";
import {
  Calendar,
  Stethoscope,
  Users,
  CreditCard,
  UserPlus,
  FileText
} from "lucide-react";

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
}

interface Appointment {
  _id: string;
  pasentname: string;
  pasentmail: string;
  pasentnumber: string;
  appointmenttime: string;
  speciality: string;
  status: string;
  assignedDoctor?: Doctor;
  paymentStatus: string;
  meetingLink?: string;
}

interface OverviewTabProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: any[];
  setActiveTab: (tab: string) => void;
  triggerToast: (msg: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  appointments = [],
  doctors = [],
  patients = [],
  setActiveTab,
  triggerToast,
}) => {
  // Operational Metrics
  const totalAppointmentsCount = appointments.length;
  const totalPatientsCount = patients.length || 156; // Mockup default fallback
  const activeDoctorsCount = doctors.length || 28;

  // Calculate dynamic today's revenue (e.g. ₹500 per paid consultation)
  const todayRevenueVal = useMemo(() => {
    const paidApps = appointments.filter(app => (app.paymentStatus || "").toLowerCase() === "paid");
    return paidApps.length * 500 || 68420; // Mockup default fallback
  }, [appointments]);

  // Appointments by Status Count
  const statusSummary = useMemo(() => {
    const approved = appointments.filter(app => (app.status || "").toLowerCase() === "approved").length;
    const completed = appointments.filter(app => (app.status || "").toLowerCase() === "completed").length;
    const pending = appointments.filter(app => (app.status || "").toLowerCase() === "pending").length;
    const cancelled = appointments.filter(app => (app.status || "").toLowerCase() === "cancelled").length;

    const total = approved + completed + pending + cancelled || totalAppointmentsCount || 24;

    return {
      approved: approved || 12,
      completed: completed || 8,
      pending: pending || 3,
      cancelled: cancelled || 1,
      total: total || 24
    };
  }, [appointments, totalAppointmentsCount]);

  // Render recent 5 appointments
  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => new Date(b.appointmenttime).getTime() - new Date(a.appointmenttime).getTime())
      .slice(0, 5);
  }, [appointments]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "'Onest', sans-serif" }}>

      {/* 🚀 Four Stat Cards Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
        {/* Card 1: Total Appointments */}
        <div
          onClick={() => setActiveTab("appointments")}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(6, 15, 45, 0.08)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(6, 15, 45, 0.02)"; }}
          style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "24px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 12px rgba(6, 15, 45, 0.02)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#EEF2FF", color: "#4A65FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748B" }}>Total Appointments</span>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#3B82F6", backgroundColor: "#EFF6FF", padding: "3px 8px", borderRadius: "20px" }}>↑ 18.4%</span>
          </div>
          <div>
            <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", margin: 0 }}>{totalAppointmentsCount || 24}</h3>
            <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "500" }}>Today</span>
          </div>
          <div style={{ width: "100%", height: "20px", marginTop: "10px" }}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d="M0,15 C20,5 40,18 60,8 C80,18 90,5 100,12" fill="none" stroke="#4A65FF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Patients Registered */}
        <div
          onClick={() => setActiveTab("patients")}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(6, 15, 45, 0.08)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(6, 15, 45, 0.02)"; }}
          style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "24px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 12px rgba(6, 15, 45, 0.02)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#E6F4EA", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748B" }}>Patients Registered</span>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#10B981", backgroundColor: "#E6F4EA", padding: "3px 8px", borderRadius: "20px" }}>↑ 12.7%</span>
          </div>
          <div>
            <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", margin: 0 }}>{totalPatientsCount}</h3>
            <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "500" }}>This Month</span>
          </div>
          <div style={{ width: "100%", height: "20px", marginTop: "10px" }}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d="M0,12 C20,15 40,5 60,15 C80,8 90,12 100,5" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Active Doctors */}
        <div
          onClick={() => setActiveTab("doctors")}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(6, 15, 45, 0.08)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(6, 15, 45, 0.02)"; }}
          style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "24px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 12px rgba(6, 15, 45, 0.02)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#F3E8FF", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Stethoscope size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748B" }}>Active Doctors</span>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#8B5CF6", backgroundColor: "#F3E8FF", padding: "3px 8px", borderRadius: "20px" }}>100%</span>
          </div>
          <div>
            <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", margin: 0 }}>{activeDoctorsCount}</h3>
            <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "500" }}>On Duty</span>
          </div>
          <div style={{ width: "100%", height: "20px", marginTop: "10px" }}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d="M0,15 C20,18 40,8 60,12 C80,5 90,15 100,8" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Today's Revenue */}
        <div
          onClick={() => setActiveTab("payments")}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(6, 15, 45, 0.08)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(6, 15, 45, 0.02)"; }}
          style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "24px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 12px rgba(6, 15, 45, 0.02)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#FFF3E0", color: "#FF9800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748B" }}>Today's Revenue</span>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#FF9800", backgroundColor: "#FFF3E0", padding: "3px 8px", borderRadius: "20px" }}>↑ 12.7%</span>
          </div>
          <div>
            <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", margin: 0 }}>₹{todayRevenueVal.toLocaleString()}</h3>
            <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "500" }}>Total Collections</span>
          </div>
          <div style={{ width: "100%", height: "20px", marginTop: "10px" }}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d="M0,18 C20,12 40,15 60,5 C80,12 90,8 100,10" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 📊 Premium Full-Width Recent Appointments Section */}
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        border: "1px solid #E2E8F0",
        padding: "32px",
        boxShadow: "0 12px 36px rgba(6, 15, 45, 0.03), 0 2px 6px rgba(6, 15, 45, 0.02)",
        width: "100%",
        marginBottom: "28px"
      }}>
        {/* Section Header */}
        <div 
          className="overview-header-container"
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-end", 
            marginBottom: "28px" 
          }}
        >
          <style>{`
            @media (max-width: 600px) {
              .overview-header-container {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 16px !important;
              }
              .overview-header-badge {
                white-space: nowrap !important;
              }
              .overview-header-btn {
                margin-top: 14px !important;
              }
            }
          `}</style>
          <div>
            <div 
              className="overview-header-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "20px",
                backgroundColor: "#EEF2FF",
                color: "#4A65FF",
                fontSize: "12.5px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                marginBottom: "10px",
                border: "1px solid #C7D2FE",
                whiteSpace: "nowrap"
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#4A65FF", display: "inline-block", boxShadow: "0 0 6px #4A65FF" }}></span>
              LIVE APPOINTMENTS FEED ({recentAppointments.length})
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: "750", color: "#060F2D", margin: 0, letterSpacing: "-0.3px" }}>Recent Appointments</h3>
            <p style={{ fontSize: "14px", color: "#64748B", margin: "4px 0 0 0", fontWeight: "500" }}>Real-time consultation bookings & patient status tracking</p>
          </div>

          <button
            onClick={() => setActiveTab("appointments")}
            className="overview-header-btn"
            style={{
              background: "linear-gradient(135deg, #4A65FF 0%, #2563EB 100%)",
              border: "none",
              borderRadius: "14px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "700",
              color: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(74, 101, 255, 0.28)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(74, 101, 255, 0.38)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(74, 101, 255, 0.28)";
            }}
          >
            <span>View All Appointments</span>
            <span style={{ fontSize: "15px" }}>→</span>
          </button>
        </div>

        {/* Table Container */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", color: "#475569", fontSize: "13px", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                <th style={{ padding: "16px 20px", borderRadius: "14px 0 0 14px", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", borderLeft: "1px solid #E2E8F0" }}>Patient Details</th>
                <th style={{ padding: "16px 20px", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>Assigned Doctor</th>
                <th style={{ padding: "16px 20px", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>Specialty</th>
                <th style={{ padding: "16px 20px", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>Time Slot</th>
                <th style={{ padding: "16px 20px", borderRadius: "0 14px 14px 0", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "50px", color: "#64748B", fontSize: "15px", fontWeight: "600" }}>
                    No recent appointments found.
                  </td>
                </tr>
              ) : (
                recentAppointments.map((app, idx) => {
                  const appDateObj = app.appointmenttime ? new Date(app.appointmenttime) : null;
                  const appTime = appDateObj
                    ? appDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                    : "10:00 AM";
                  const appDate = appDateObj
                    ? appDateObj.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
                    : "";

                  const getStatusColor = (status: string) => {
                    const normalized = (status || "").toLowerCase();
                    if (normalized === "approved" || normalized === "paid") {
                      return { text: "#047857", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" };
                    }
                    if (normalized === "completed") {
                      return { text: "#6D28D9", bg: "#F3E8FF", border: "#DDD6FE", dot: "#8B5CF6" };
                    }
                    if (normalized === "cancelled" || normalized === "failed") {
                      return { text: "#B91C1C", bg: "#FEE2E2", border: "#FCA5A5", dot: "#EF4444" };
                    }
                    return { text: "#B45309", bg: "#FEF3C7", border: "#FDE68A", dot: "#F59E0B" };
                  };
                  const statusColor = getStatusColor(app.status);

                  return (
                    <tr
                      key={app._id || idx}
                      style={{
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.02)",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#F8FAFF";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Patient Name & Details */}
                      <td style={{
                        padding: "18px 20px",
                        borderRadius: "16px 0 0 16px",
                        borderTop: "1px solid #F1F5F9",
                        borderBottom: "1px solid #F1F5F9",
                        borderLeft: "1px solid #F1F5F9"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #4A65FF 0%, #2563EB 100%)",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "750",
                            flexShrink: 0,
                            boxShadow: "0 4px 14px rgba(74, 101, 255, 0.25)"
                          }}>
                            {app.pasentname ? app.pasentname.charAt(0).toUpperCase() : "P"}
                          </div>
                          <div>
                            <div style={{ fontSize: "16.5px", fontWeight: "700", color: "#060F2D", lineHeight: "1.3" }}>
                              {app.pasentname}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                              <span style={{
                                backgroundColor: "#F1F5F9",
                                color: "#475569",
                                fontSize: "12.5px",
                                fontWeight: "650",
                                padding: "3px 9px",
                                borderRadius: "6px"
                              }}>
                                #PT{app._id ? app._id.slice(-6).toUpperCase() : "000000"}
                              </span>
                              <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>
                                {app.pasentnumber || app.pasentmail || ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Doctor Details */}
                      <td style={{
                        padding: "18px 20px",
                        borderTop: "1px solid #F1F5F9",
                        borderBottom: "1px solid #F1F5F9"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "#EFF6FF",
                            color: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "750",
                            fontSize: "13px",
                            border: "1px solid #DBEAFE"
                          }}>
                            Dr
                          </div>
                          <div>
                            <div style={{ fontSize: "15.5px", fontWeight: "650", color: "#0F172A", lineHeight: "1.2" }}>
                              {app.assignedDoctor ? app.assignedDoctor.name : "Dr. Karthi T"}
                            </div>
                            <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: "500" }}>Attending Specialist</span>
                          </div>
                        </div>
                      </td>

                      {/* Specialty Tag */}
                      <td style={{
                        padding: "18px 20px",
                        borderTop: "1px solid #F1F5F9",
                        borderBottom: "1px solid #F1F5F9"
                      }}>
                        <span style={{
                          backgroundColor: "#EEF2FF",
                          color: "#4A65FF",
                          border: "1px solid #C7D2FE",
                          padding: "7px 16px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          fontWeight: "650",
                          display: "inline-block",
                          boxShadow: "0 2px 4px rgba(74, 101, 255, 0.05)"
                        }}>
                          {app.speciality || "General Medicine"}
                        </span>
                      </td>

                      {/* Time & Date Slot */}
                      <td style={{
                        padding: "18px 20px",
                        borderTop: "1px solid #F1F5F9",
                        borderBottom: "1px solid #F1F5F9",
                        whiteSpace: "nowrap"
                      }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0F172A", fontSize: "15.5px", fontWeight: "700" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3B82F6", display: "inline-block" }}></span>
                            {appTime}
                          </div>
                          {appDate && (
                            <div style={{ fontSize: "12.5px", color: "#64748B", fontWeight: "600", marginTop: "3px", paddingLeft: "16px" }}>
                              📅 {appDate}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td style={{
                        padding: "18px 20px",
                        borderRadius: "0 16px 16px 0",
                        borderTop: "1px solid #F1F5F9",
                        borderBottom: "1px solid #F1F5F9",
                        borderRight: "1px solid #F1F5F9"
                      }}>
                        <span style={{
                          padding: "7px 16px",
                          borderRadius: "20px",
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          border: `1.5px solid ${statusColor.border}`,
                          fontSize: "13px",
                          fontWeight: "700",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)"
                        }}>
                          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: statusColor.dot }}></span>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📈 Bottom Visual Analytics & Quick Actions Section */}
      <div className="overview-bottom-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 1.15fr 1fr", gap: "24px" }}>

        {/* 1. Appointments Trend Chart */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "22px",
          border: "1px solid #EAEFF5",
          padding: "24px 26px",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.02)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: 0, letterSpacing: "-0.2px" }}>Appointments Trend</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <select style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                fontWeight: "700",
                color: "#4F46E5",
                backgroundColor: "transparent",
                cursor: "pointer",
                paddingRight: "2px"
              }}>
                <option>This Week</option>
              </select>
              <span style={{ fontSize: "11px", color: "#4F46E5", fontWeight: "800" }}>▼</span>
            </div>
          </div>
          <div style={{ width: "100%", height: "165px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {/* Inline Smooth Curve SVG Chart */}
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "125px", overflow: "visible" }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4338CA" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#4338CA" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Smooth Bezier path matching image wave (starts mid, dips, peaks around Fri, drops Sat, rises Sun) */}
              <path
                d="M 0,35 C 10,25 20,28 30,34 C 40,40 52,18 64,6 C 74,-4 82,42 88,44 C 92,45 96,28 100,20 L 100,50 L 0,50 Z"
                fill="url(#trendGrad)"
              />
              <path
                d="M 0,35 C 10,25 20,28 30,34 C 40,40 52,18 64,6 C 74,-4 82,42 88,44 C 92,45 96,28 100,20"
                fill="none"
                stroke="#4338CA"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", color: "#94A3B8", fontWeight: "600", padding: "0 2px" }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* 2. Appointments by Status Donut */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "22px",
          border: "1px solid #EAEFF5",
          padding: "24px 26px",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.02)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: "0 0 16px 0", letterSpacing: "-0.2px" }}>Appointments by Status</h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexGrow: 1 }}>
            <div style={{ width: "125px", height: "125px", position: "relative", flexShrink: 0 }}>
              {/* SVG Donut Chart */}
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)", overflow: "visible" }}>
                {/* Cancelled 20% (red) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#EF4444" strokeWidth="4.8" strokeDasharray="20 80" strokeDashoffset="0" strokeLinecap="butt" />
                {/* Pending 40% (orange) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#F59E0B" strokeWidth="4.8" strokeDasharray="40 60" strokeDashoffset="-20" strokeLinecap="butt" />
                {/* Completed 20% (purple) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#8B5CF6" strokeWidth="4.8" strokeDasharray="20 80" strokeDashoffset="-60" strokeLinecap="butt" />
                {/* Approved 20% (green) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10B981" strokeWidth="4.8" strokeDasharray="20 80" strokeDashoffset="-80" strokeLinecap="butt" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>{statusSummary.total}</span>
                <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "600", marginTop: "3px" }}>Total</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }}></span>
                  <span style={{ color: "#475569", fontWeight: "600" }}>Approved</span>
                </div>
                <span style={{ color: "#0F172A", fontWeight: "800" }}>{statusSummary.approved} ({Math.round(statusSummary.approved / statusSummary.total * 100) || 20}%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#8B5CF6" }}></span>
                  <span style={{ color: "#475569", fontWeight: "600" }}>Completed</span>
                </div>
                <span style={{ color: "#0F172A", fontWeight: "800" }}>{statusSummary.completed} ({Math.round(statusSummary.completed / statusSummary.total * 100) || 20}%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#F59E0B" }}></span>
                  <span style={{ color: "#475569", fontWeight: "600" }}>Pending</span>
                </div>
                <span style={{ color: "#0F172A", fontWeight: "800" }}>{statusSummary.pending} ({Math.round(statusSummary.pending / statusSummary.total * 100) || 40}%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#EF4444" }}></span>
                  <span style={{ color: "#475569", fontWeight: "600" }}>Cancelled</span>
                </div>
                <span style={{ color: "#0F172A", fontWeight: "800" }}>{statusSummary.cancelled} ({Math.round(statusSummary.cancelled / statusSummary.total * 100) || 20}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions Panel */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "22px",
          border: "1px solid #EAEFF5",
          padding: "24px 26px",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.02)",
          display: "flex",
          flexDirection: "column"
        }}>
          <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: "0 0 16px 0", letterSpacing: "-0.2px" }}>Quick Actions</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", flexGrow: 1 }}>

            {/* New Appointment Action */}
            <button
              onClick={() => {
                setActiveTab("appointments");
                triggerToast("📅 Opening Appointments log to create a new slot!");
              }}
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px 14px",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#4F46E5"; e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(79, 70, 229, 0.08)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.backgroundColor = "#F8FAFC"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#EEF2FF", color: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "750", color: "#0F172A", lineHeight: "1.2" }}>New Appointment</span>
            </button>

            {/* Add New Patient Action */}
            <button
              onClick={() => {
                setActiveTab("patients");
                triggerToast("👤 Opening Patients Registry to register a new user!");
              }}
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px 14px",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.08)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.backgroundColor = "#F8FAFC"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UserPlus size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "750", color: "#0F172A", lineHeight: "1.2" }}>Add New Patient</span>
            </button>

            {/* Add Doctor Action */}
            <button
              onClick={() => {
                setActiveTab("doctors");
                triggerToast("🩺 Opening Doctors Tab to register a new specialist!");
              }}
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px 14px",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.08)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.backgroundColor = "#F8FAFC"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#F3E8FF", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Stethoscope size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "750", color: "#0F172A", lineHeight: "1.2" }}>Add Doctor</span>
            </button>

            {/* Generate Report Action */}
            <button
              onClick={() => {
                triggerToast("📑 Exporting Excel & PDF Reports database dump...");
              }}
              style={{
                backgroundColor: "#F8FAFC",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px 14px",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.08)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.backgroundColor = "#F8FAFC"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FEF3C7", color: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={18} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "750", color: "#0F172A", lineHeight: "1.2" }}>Generate Report</span>
            </button>

          </div>
        </div>
      </div>

    </div>
  );
};

export default OverviewTab;
