import React, { useMemo } from "react";
import {
  Calendar,
  Stethoscope,
  Users,
  CreditCard,
  UserPlus,
  FileText,
  Activity,
  Heart,
  Droplets,
  Scissors
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

  // Speciality count calculation for Department Summary
  const departmentSummary = useMemo(() => {
    const counts: { [key: string]: number } = {};
    appointments.forEach(app => {
      const spec = app.speciality || "General Medicine";
      counts[spec] = (counts[spec] || 0) + 1;
    });

    // Make sure we have some defaults if data is empty
    const defaults = [
      { name: "General Medicine", count: counts["General Medicine"] || 8, icon: <Activity size={16} color="#10B981" />, bg: "#E6F4EA" },
      { name: "Pediatrics", count: counts["Pediatrics"] || 5, icon: <Heart size={16} color="#3B82F6" />, bg: "#E8F0FE" },
      { name: "Orthopedics", count: counts["Orthopedics"] || 4, icon: <Activity size={16} color="#F59E0B" />, bg: "#FEF3C7" },
      { name: "Gynecology", count: counts["Gynecology & Women's Health"] || counts["Gynecology"] || 7, icon: <Droplets size={16} color="#EC4899" />, bg: "#FCE7F3" },
      { name: "Dermatology", count: counts["Dermatology & Cosmetology"] || counts["Dermatology"] || 6, icon: <Scissors size={16} color="#8B5CF6" />, bg: "#F3E8FF" }
    ];

    return defaults;
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

      {/* 📊 Main Split Grid Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1.1fr", gap: "28px" }}>
        
        {/* Left Side: Recent Appointments Table */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0", padding: "32px", boxShadow: "0 10px 30px rgba(6, 15, 45, 0.01)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#060F2D" }}>Recent Appointments</h3>
            <button
              onClick={() => setActiveTab("appointments")}
              style={{
                backgroundColor: "transparent",
                border: "1.5px solid #F1F5F9",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#4A65FF",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#EEF1FF")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              View All
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #F1F5F9", color: "#94A3B8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <th style={{ padding: "12px 6px" }}>Patient</th>
                  <th style={{ padding: "12px 6px" }}>Doctor</th>
                  <th style={{ padding: "12px 6px" }}>Specialty</th>
                  <th style={{ padding: "12px 6px" }}>Time</th>
                  <th style={{ padding: "12px 6px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>No recent appointments found.</td>
                  </tr>
                ) : (
                  recentAppointments.map((app, idx) => {
                    const appTime = app.appointmenttime
                      ? new Date(app.appointmenttime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                      : "10:00 AM";

                    const getStatusColor = (status: string) => {
                      const normalized = (status || "").toLowerCase();
                      if (normalized === "approved" || normalized === "paid") return { text: "#10B981", bg: "#E6F4EA" };
                      if (normalized === "completed") return { text: "#512DA8", bg: "#EDE7F6" };
                      if (normalized === "cancelled" || normalized === "failed") return { text: "#EF4444", bg: "#FCE8E6" };
                      return { text: "#F59E0B", bg: "#FFF3E0" };
                    };
                    const statusColor = getStatusColor(app.status);

                    return (
                      <tr key={app._id || idx} style={{ borderBottom: "1px solid #F8FAFC", fontSize: "13.5px", color: "#0F172A" }}>
                        <td style={{ padding: "16px 6px", fontWeight: "700" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#EEF2FF", color: "#4A65FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800" }}>
                              {app.pasentname.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div>{app.pasentname}</div>
                              <span style={{ fontSize: "10.5px", color: "#94A3B8", fontWeight: "500" }}>#PT{app._id.slice(-6).toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 6px", color: "#475569", fontWeight: "600" }}>
                          {app.assignedDoctor ? app.assignedDoctor.name : "Dr. Karthi T"}
                        </td>
                        <td style={{ padding: "16px 6px", color: "#64748B", fontWeight: "500" }}>
                          {app.speciality}
                        </td>
                        <td style={{ padding: "16px 6px", color: "#475569", fontWeight: "600" }}>
                          {appTime}
                        </td>
                        <td style={{ padding: "16px 6px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            fontSize: "11.5px",
                            fontWeight: "700",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px"
                          }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: statusColor.text }}></span>
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

        {/* Right Side: Today's Department Summary */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0", padding: "32px", boxShadow: "0 10px 30px rgba(6, 15, 45, 0.01)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#060F2D" }}>Today's Department Summary</h3>
            <button
              onClick={() => {
                triggerToast("📋 Preparing Department Analytics Report...");
              }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "12px",
                fontWeight: "750",
                color: "#4A65FF",
                cursor: "pointer"
              }}
            >
              View Report
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {departmentSummary.map((dept, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", backgroundColor: "#FCFDFD", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: dept.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {dept.icon}
                  </div>
                  <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#060F2D" }}>{dept.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#060F2D" }}>{dept.count.toString().padStart(2, "0")}</span>
                  <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "600" }}>Patients</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📈 Bottom Visual Analytics & Quick Actions Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1fr", gap: "28px" }}>
        
        {/* 1. Appointments Trend Chart */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0", padding: "28px", boxShadow: "0 10px 30px rgba(6, 15, 45, 0.01)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#060F2D" }}>Appointments Trend</h4>
            <select style={{ border: "none", outline: "none", fontSize: "12px", fontWeight: "700", color: "#4A65FF", backgroundColor: "transparent", cursor: "pointer" }}>
              <option>This Week</option>
            </select>
          </div>
          <div style={{ width: "100%", height: "160px", position: "relative" }}>
            {/* Inline SVG Chart */}
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A65FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4A65FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0,40 Q 15,20 30,35 T 60,15 T 85,30 T 100,25 L 100,50 L 0,50 Z" fill="url(#trendGrad)" />
              <path d="M 0,40 Q 15,20 30,35 T 60,15 T 85,30 T 100,25" fill="none" stroke="#4A65FF" strokeWidth="2.5" strokeLinecap="round" />
              {/* Dot Markers */}
              <circle cx="0" cy="40" r="1.5" fill="#4A65FF" />
              <circle cx="30" cy="35" r="1.5" fill="#4A65FF" />
              <circle cx="60" cy="15" r="1.5" fill="#4A65FF" />
              <circle cx="100" cy="25" r="1.5" fill="#4A65FF" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "10px", color: "#94A3B8", fontWeight: "700" }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* 2. Appointments by Status Donut */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0", padding: "28px", boxShadow: "0 10px 30px rgba(6, 15, 45, 0.01)" }}>
          <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#060F2D", marginBottom: "20px" }}>Appointments by Status</h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ width: "120px", height: "120px", position: "relative" }}>
              {/* SVG Donut Chart */}
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                {/* Cancelled 5% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#EF4444" strokeWidth="4.2" strokeDasharray="5 95" strokeDashoffset="0" />
                {/* Pending 12% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#FF9800" strokeWidth="4.2" strokeDasharray="12 88" strokeDashoffset="-5" />
                {/* Completed 33% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#8B5CF6" strokeWidth="4.2" strokeDasharray="33 67" strokeDashoffset="-17" />
                {/* Approved 50% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10B981" strokeWidth="4.2" strokeDasharray="50 50" strokeDashoffset="-50" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#060F2D" }}>{statusSummary.total}</span>
                <span style={{ fontSize: "9px", color: "#94A3B8", fontWeight: "700" }}>Total</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: "700" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }}></span>
                  <span style={{ color: "#64748B" }}>Approved</span>
                </div>
                <span style={{ color: "#060F2D" }}>{statusSummary.approved} ({Math.round(statusSummary.approved / statusSummary.total * 100) || 50}%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: "700" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#8B5CF6" }}></span>
                  <span style={{ color: "#64748B" }}>Completed</span>
                </div>
                <span style={{ color: "#060F2D" }}>{statusSummary.completed} ({Math.round(statusSummary.completed / statusSummary.total * 100) || 33}%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: "700" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FF9800" }}></span>
                  <span style={{ color: "#64748B" }}>Pending</span>
                </div>
                <span style={{ color: "#060F2D" }}>{statusSummary.pending} ({Math.round(statusSummary.pending / statusSummary.total * 100) || 12}%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: "700" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#EF4444" }}></span>
                  <span style={{ color: "#64748B" }}>Cancelled</span>
                </div>
                <span style={{ color: "#060F2D" }}>{statusSummary.cancelled} ({Math.round(statusSummary.cancelled / statusSummary.total * 100) || 5}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions Panel */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0", padding: "28px", boxShadow: "0 10px 30px rgba(6, 15, 45, 0.01)", display: "flex", flexDirection: "column" }}>
          <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#060F2D", marginBottom: "20px" }}>Quick Actions</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", flexGrow: 1 }}>
            
            {/* New Appointment Action */}
            <button
              onClick={() => {
                setActiveTab("appointments");
                triggerToast("📅 Opening Appointments log to create a new slot!");
              }}
              style={{
                backgroundColor: "#FCFDFD",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
                gap: "10px",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#4A65FF"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 101, 255, 0.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#EEF2FF", color: "#4A65FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={16} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: "750", color: "#060F2D" }}>New Appointment</span>
            </button>

            {/* Add New Patient Action */}
            <button
              onClick={() => {
                setActiveTab("patients");
                triggerToast("👤 Opening Patients Registry to register a new user!");
              }}
              style={{
                backgroundColor: "#FCFDFD",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
                gap: "10px",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#E6F4EA", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UserPlus size={16} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: "750", color: "#060F2D" }}>Add New Patient</span>
            </button>

            {/* Add Doctor Action */}
            <button
              onClick={() => {
                setActiveTab("doctors");
                triggerToast("🩺 Opening Doctors Tab to register a new specialist!");
              }}
              style={{
                backgroundColor: "#FCFDFD",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
                gap: "10px",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#F3E8FF", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Stethoscope size={16} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: "750", color: "#060F2D" }}>Add Doctor</span>
            </button>

            {/* Generate Report Action */}
            <button
              onClick={() => {
                triggerToast("📑 Exporting Excel & PDF Reports database dump...");
              }}
              style={{
                backgroundColor: "#FCFDFD",
                border: "1px solid #F1F5F9",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
                gap: "10px",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#FF9800"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 152, 0, 0.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#FFF3E0", color: "#FF9800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={16} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: "750", color: "#060F2D" }}>Generate Report</span>
            </button>

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default OverviewTab;
