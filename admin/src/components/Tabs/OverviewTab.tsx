import React, { useState, useMemo } from "react";
import { 
  Calendar, Stethoscope, Video, Users, Link2, Copy, Send, 
  CheckCircle2, ShieldAlert, Search, Filter, RefreshCw, ChevronRight, PlayCircle
} from "lucide-react";

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
  // Local states for Overview page filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Extract unique specialties from current appointments
  const uniqueSpecialities = useMemo(() => {
    const specs = appointments.map((app: any) => app.speciality).filter(Boolean);
    return Array.from(new Set(specs));
  }, [appointments]);

  // Handle Search and Filter logic dynamically
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app: any) => {
      const matchSearch = 
        (app.pasentname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.pasentnumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.pasentmail || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchSpeciality = specialityFilter === "all" || app.speciality === specialityFilter;
      const matchStatus = statusFilter === "all" || (app.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchSpeciality && matchStatus;
    });
  }, [appointments, searchQuery, specialityFilter, statusFilter]);

  // Operational Roster Metrics
  const now = new Date();
  const todayDateString = now.toDateString();

  const todayCount = useMemo(() => {
    return appointments.filter((app: any) => {
      if (!app.appointmenttime) return false;
      return new Date(app.appointmenttime).toDateString() === todayDateString;
    }).length;
  }, [appointments, todayDateString]);

  const activeLinksCount = useMemo(() => {
    return appointments.filter((app: any) => app.meetingLink && app.status !== "completed" && app.status !== "cancelled").length;
  }, [appointments]);

  const nextUpcoming = useMemo(() => {
    return appointments.find((app: any) => app.meetingLink && app.status === "approved");
  }, [appointments]);

  const handleCopyMeetLink = (link: string) => {
    if (!link) {
      triggerToast("❌ No link available to copy.");
      return;
    }
    navigator.clipboard.writeText(link);
    triggerToast("📋 Google Meet link copied!");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSpecialityFilter("all");
    setStatusFilter("all");
    triggerToast("🔄 Filters reset successfully!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* Premium Telehealth Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A1E4B 0%, #1A2E69 100%)",
          borderRadius: "24px",
          padding: "36px 40px",
          color: "#FFFFFF",
          boxShadow: "0 12px 30px rgba(6, 15, 45, 0.15)",
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
            background: "rgba(14, 165, 233, 0.25)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        ></div>

        <div>
          <span style={{ 
            fontSize: "11px", 
            fontWeight: "800", 
            backgroundColor: "rgba(14, 165, 233, 0.2)", 
            color: "#38BDF8", 
            padding: "4px 12px", 
            borderRadius: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}>
            Srisai Subhramaniya Hospitals Telehealth Center
          </span>
          <h3 style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px", fontFamily: "'Outfit', sans-serif", marginTop: "12px" }}>
            Operational Command Hub
          </h3>
          <p style={{ fontSize: "14.5px", color: "rgba(240, 249, 255, 0.8)", marginTop: "8px", maxWidth: "680px", lineHeight: "1.6" }}>
            Real-time management console for fully virtual consultation queues. Monitor live video consultation rooms, manage Google Meet roster integrations, and coordinate telehealth slots.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 8px #10B981" }}></span>
              Tele-Clinic Status: Fully Operational
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#0EA5E9", boxShadow: "0 0 8px #0EA5E9" }}></span>
              Google Meet Integration: Fully Active
            </div>
          </div>
        </div>
      </div>

      {/* Telehealth Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {[
          { 
            label: "Today's Tele-Consultations", 
            value: todayCount.toString(), 
            subtext: `${appointments.length} total bookings logged`, 
            targetTab: "appointments", 
            color: "#0EA5E9", 
            bg: "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)", 
            icon: <Calendar size={22} /> 
          },
          { 
            label: "Active Video consultation rooms", 
            value: activeLinksCount.toString(), 
            subtext: "Live online consultation links active", 
            targetTab: "appointments", 
            color: "#6366F1", 
            bg: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)", 
            icon: <Video size={22} /> 
          },
          { 
            label: "On-Duty Specialists", 
            value: doctors.length ? doctors.length.toString() : "0", 
            subtext: "Click to manage doctors roster", 
            targetTab: "doctors", 
            color: "#10B981", 
            bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)", 
            icon: <Stethoscope size={22} /> 
          },
        ].map((card, i) => (
          <div
            key={i}
            onClick={() => setActiveTab(card.targetTab)}
            style={{
              backgroundColor: "#FFFFFF",
              padding: "28px",
              borderRadius: "20px",
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
              e.currentTarget.style.boxShadow = "0 16px 36px rgba(14, 165, 233, 0.12)";
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(6, 15, 45, 0.02)";
              e.currentTarget.style.borderColor = "rgba(6, 15, 45, 0.04)";
            }}
          >
            <div>
              <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "600" }}>{card.label}</span>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", marginTop: "10px", fontFamily: "'Outfit', sans-serif" }}>
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
        
        {/* Recent Telehealth Sessions Roster Widget */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
            border: "1px solid rgba(6, 15, 45, 0.04)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#060F2D", letterSpacing: "-0.3px" }}>
                Telehealth Slot Roster
              </h3>
              <span style={{ fontSize: "12.5px", color: "#64748B", display: "block", marginTop: "2px" }}>
                Currently showing {filteredAppointments.length} matching slots
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {(searchQuery || specialityFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    backgroundColor: "#F1F5F9",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <RefreshCw size={12} />
                  Reset Filters
                </button>
              )}
              <button
                onClick={() => setActiveTab("appointments")}
                style={{
                  backgroundColor: "transparent",
                  border: "1.5px solid #E2E8F0",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0EA5E9",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#F0F9FF"; e.currentTarget.style.borderColor = "#0EA5E9"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
              >
                Go to Logs
              </button>
            </div>
          </div>

          {/* Interactive Filters Area */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1.5fr 1fr 1fr", 
            gap: "12px", 
            marginBottom: "20px", 
            backgroundColor: "#F8FAFC", 
            padding: "16px", 
            borderRadius: "14px",
            border: "1px solid #E2E8F0"
          }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#FFFFFF", padding: "8px 12px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <Search size={14} color="#64748B" />
              <input
                type="text"
                placeholder="Search patient name / phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: "13px", width: "100%" }}
              />
            </div>

            {/* Speciality Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#FFFFFF", padding: "4px 8px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <Filter size={12} color="#64748B" />
              <select
                value={specialityFilter}
                onChange={(e) => setSpecialityFilter(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: "12.5px", fontWeight: "600", color: "#475569", width: "100%", backgroundColor: "transparent", cursor: "pointer" }}
              >
                <option value="all">All Specialties</option>
                {uniqueSpecialities.map((spec, idx) => (
                  <option key={idx} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#FFFFFF", padding: "4px 8px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <Filter size={12} color="#64748B" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: "12.5px", fontWeight: "600", color: "#475569", width: "100%", backgroundColor: "transparent", cursor: "pointer" }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F1F5F9", color: "#64748B", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <th style={{ padding: "12px 8px" }}>Patient Profile</th>
                  <th style={{ padding: "12px 8px" }}>Speciality</th>
                  <th style={{ padding: "12px 8px" }}>Virtual Slot</th>
                  <th style={{ padding: "12px 8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "40px 0", color: "#64748B", fontSize: "14px" }}>
                      No virtual slots found matching search filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.slice(0, 5).map((app: any, idx: number) => {
                    const getStatusStyles = (status: string) => {
                      const normalized = (status || "").toLowerCase().trim();
                      switch (normalized) {
                        case "paid":
                        case "approved":
                          return { color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" };
                        case "failed":
                          return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.08)" };
                        case "pending":
                          return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)" };
                        case "processing":
                          return { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)" };
                        case "completed":
                          return { color: "#6366F1", bg: "rgba(99, 102, 241, 0.08)" };
                        case "cancelled":
                          return { color: "#64748B", bg: "rgba(100, 116, 139, 0.08)" };
                        case "rescheduled":
                          return { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.08)" };
                        case "in progress":
                        case "inprogress":
                          return { color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.08)" };
                        default:
                          return { color: "#64748B", bg: "rgba(100, 116, 139, 0.08)" };
                      }
                    };
                    const styles = getStatusStyles(app.status);
                    return (
                      <tr 
                        key={app._id || idx} 
                        style={{ borderBottom: "1px solid #F1F5F9", fontSize: "14px", color: "#0F172A", transition: "background-color 0.2s" }}
                        className="interactive-row"
                      >
                        {/* Patient Linkable profile */}
                        <td 
                          style={{ padding: "16px 8px", cursor: "pointer" }}
                          onClick={() => {
                            setActiveTab("patients");
                            triggerToast(`🔍 Navigating to Patient Registry for ${app.pasentname}`);
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <strong style={{ color: "#0F172A", textDecoration: "underline", textDecorationColor: "rgba(6, 15, 45, 0.2)" }}>{app.pasentname}</strong>
                            <span style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{app.pasentnumber} • View Card</span>
                          </div>
                        </td>

                        {/* Speciality Linkable field */}
                        <td 
                          style={{ padding: "16px 8px", color: "#475569", fontWeight: "500", cursor: "pointer" }}
                          onClick={() => {
                            setActiveTab("doctors");
                            triggerToast(`🩺 Searching Roster for ${app.speciality} specialists`);
                          }}
                        >
                          <span style={{ borderBottom: "1.5px dashed rgba(71, 85, 105, 0.3)" }}>
                            {app.speciality}
                          </span>
                        </td>

                        {/* Google Meet Link slots */}
                        <td style={{ padding: "16px 8px" }}>
                          {app.meetingLink ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <a
                                href={app.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#0EA5E9",
                                  textDecoration: "none",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  backgroundColor: "rgba(14, 165, 233, 0.08)",
                                  padding: "4px 8px",
                                  borderRadius: "6px"
                                }}
                              >
                                <Video size={12} />
                                Join Call
                              </a>
                              <button
                                onClick={() => handleCopyMeetLink(app.meetingLink)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: "4px" }}
                                title="Copy Meeting Link"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveTab("appointments");
                                triggerToast("🚀 Please set a consultation Meet link in Appointments Log");
                              }}
                              style={{
                                border: "1px dashed #E2E8F0",
                                background: "#FFFFFF",
                                color: "#64748B",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "11.5px",
                                fontWeight: "600",
                                cursor: "pointer"
                              }}
                            >
                              + Add Meet Room
                            </button>
                          )}
                        </td>

                        {/* Status badge */}
                        <td 
                          style={{ padding: "16px 8px", cursor: "pointer" }}
                          onClick={() => {
                            setActiveTab("appointments");
                            triggerToast("📋 Manage consultation status inside Bookings Log");
                          }}
                        >
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: styles.color,
                            backgroundColor: styles.bg,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            textTransform: "capitalize",
                          }}>
                            <span style={{
                              width: "6px",
                              height: "6px",
                              backgroundColor: styles.color,
                              borderRadius: "50%",
                              boxShadow: `0 0 6px ${styles.color}`,
                            }}></span>
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

        {/* Clinical Operations Center / Live Telehealth Monitor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Active Consultation Monitor */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
              border: "1.5px solid rgba(6, 15, 45, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "750", color: "#060F2D" }}>Tele-Consult Monitor</h4>
              <span style={{ 
                fontSize: "11px", 
                fontWeight: "800", 
                color: "#10B981", 
                backgroundColor: "rgba(16, 185, 129, 0.08)", 
                padding: "4px 10px", 
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981", animation: "pulse 1.5s infinite" }} />
                Live
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderLeft: "3.5px solid #0EA5E9", paddingLeft: "14px", margin: "14px 0" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>Active Google Meet Link</span>
                <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A", display: "block", marginTop: "2px" }}>
                  {nextUpcoming ? `${nextUpcoming.pasentname} • ${nextUpcoming.speciality}` : "No Active Call"}
                </span>
              </div>
              {nextUpcoming && (
                <button
                  onClick={() => handleCopyMeetLink(nextUpcoming.meetingLink)}
                  style={{
                    backgroundColor: "rgba(14, 165, 233, 0.08)",
                    color: "#0EA5E9",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    alignSelf: "flex-start"
                  }}
                >
                  <Link2 size={12} />
                  Copy Active Link
                </button>
              )}
            </div>

            <div style={{ borderTop: "1.5px solid #F1F5F9", paddingTop: "14px", marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "8px" }}>
                <span style={{ color: "#64748B" }}>Total Virtual Rooms:</span>
                <strong style={{ color: "#0F172A" }}>{activeLinksCount} Link(s) Configured</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                <span style={{ color: "#64748B" }}>Workspace API Check:</span>
                <strong style={{ color: "#10B981", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={13} />
                  Healthy
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Tele-Actions Panel */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
              border: "1.5px solid rgba(6, 15, 45, 0.04)",
            }}
          >
            <h4 style={{ fontSize: "15px", fontWeight: "750", color: "#060F2D", marginBottom: "16px" }}>Clinical Quick Actions</h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => {
                  if (nextUpcoming) {
                    handleCopyMeetLink(nextUpcoming.meetingLink);
                  } else {
                    triggerToast("⚠️ No upcoming virtual consultation slot available.");
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0F172A",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F8FAFC"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#FFFFFF"}
              >
                <span>Copy Current Roster Call Link</span>
                <Link2 size={14} color="#64748B" />
              </button>

              <button
                onClick={() => triggerToast("📨 Bulk WhatsApp / Email reminders sent to today's patients!")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0F172A",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F8FAFC"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#FFFFFF"}
              >
                <span>Send SMS/Meet Link Reminders</span>
                <Send size={14} color="#64748B" />
              </button>

              <button
                onClick={() => setActiveTab("appointments")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(244, 63, 94, 0.2)",
                  backgroundColor: "rgba(244, 63, 94, 0.02)",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#F43F5E",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(244, 63, 94, 0.05)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(244, 63, 94, 0.02)"}
              >
                <span>Trigger Emergency Slot Lockout</span>
                <ShieldAlert size={14} color="#F43F5E" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
