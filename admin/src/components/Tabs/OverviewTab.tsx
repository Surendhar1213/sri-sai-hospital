import React from "react";
import { Calendar, Stethoscope, Users } from "lucide-react";

interface OverviewTabProps {
  appointments: any[];
  doctors: any[];
  patients: any[];
  setActiveTab: (tab: string) => void;
  triggerToast: (msg: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  appointments,
  doctors,
  patients,
  setActiveTab,
  triggerToast,
}) => {
  return (
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
        <div
          style={{
            position: "absolute",
            right: "-50px",
            top: "-50px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(63, 89, 255, 0.15)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        ></div>

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
                          textTransform: "capitalize",
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
  );
};

export default OverviewTab;
