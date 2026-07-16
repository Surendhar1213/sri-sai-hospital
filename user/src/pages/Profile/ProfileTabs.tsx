import React from "react";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaPrint,
  FaStethoscope,
  FaClock,
  FaCreditCard,
  FaCopy,
  FaCheck,
  FaCheckCircle,
  FaPills,
  FaUtensils,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

// Types
interface Doctor {
  name: string;
}

interface Appointment {
  _id: string;
  status: string;
  speciality: string;
  appointmenttime: string;
  assignedDoctor?: Doctor;
  meetingLink?: string;
  prescription?: string;
  paymentStatus?: string;
  paymentId?: string;
  amount?: number;
  createdAt?: string;
  pasentname: string;
  pasentnumber: string;
  pasentmail: string;
}

// 1. OVERVIEW TAB
interface OverviewTabProps {
  userName: string;
  appointments: Appointment[];
  upcomingAppointment: Appointment | undefined;
  handleJoinMeeting: (id: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userName,
  appointments,
  upcomingAppointment,
  handleJoinMeeting
}) => {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>
        Welcome Back, {userName.split(" ")[0]}!
      </h2>
      <p style={{ margin: 0, color: "#72849B", fontSize: "15px", fontWeight: "600", marginBottom: "28px" }}>
        Here is your telehealth dashboard overview.
      </p>

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
                backgroundColor: "rgba(74, 101, 255, 0.2)",
                color: "#FFFFFF",
                padding: "4px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "12px"
              }}>
                Upcoming Consultation
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 10px 0" }}>
                {upcomingAppointment.speciality}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaStethoscope style={{ color: "#4A65FF" }} /> Specialist: <strong style={{ color: "#FFFFFF", fontWeight: "600" }}>{upcomingAppointment.assignedDoctor ? upcomingAppointment.assignedDoctor.name : "Not Assigned"}</strong>
                </p>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaClock style={{ color: "#4A65FF" }} /> Scheduled: <strong style={{ color: "#FFFFFF", fontWeight: "600" }}>{new Date(upcomingAppointment.appointmenttime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong>
                </p>
              </div>
            </div>
            {upcomingAppointment.meetingLink && (
              <button
                onClick={() => handleJoinMeeting(upcomingAppointment._id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  backgroundColor: "#4A65FF",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
                  boxShadow: "0 4px 12px rgba(74, 101, 255, 0.2)",
                  transition: "all 0.2s"
                }}
              >
                🎥 Join Consultation
              </button>
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
          { title: "Total Bookings", value: appointments.length, color: "#4A65FF", bg: "rgba(74, 101, 255, 0.06)" },
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
  );
};

// 2. MY APPOINTMENTS TAB
interface AppointmentsTabProps {
  appointments: Appointment[];
  handleJoinMeeting: (id: string) => void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  handleJoinMeeting
}) => {
  return (
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
                    backgroundColor: "rgba(74, 101, 255, 0.05)",
                    color: "#4A65FF",
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
                    <button
                      onClick={() => handleJoinMeeting(app._id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#4A65FF",
                        color: "#FFFFFF",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "14px",
                        boxShadow: "0 4px 10px rgba(74, 101, 255, 0.15)",
                        transition: "background 0.2s"
                      }}
                    >
                      🎥 Join Call
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 3. PRESCRIPTIONS TAB
interface PrescriptionsTabProps {
  appointments: Appointment[];
  userAge: string | number;
  userGender: string;
  userBloodGroup: string;
}

export const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({
  appointments,
  userAge,
  userGender,
  userBloodGroup
}) => {
  const completedWithPrescription = appointments.filter(a => a.status === "completed" && a.prescription);

  // Track which prescription ID is expanded. Default to the most recent one (first in the list).
  const [expandedId, setExpandedId] = React.useState<string | null>(
    completedWithPrescription.length > 0 ? completedWithPrescription[0]._id : null
  );

  const [printPrescriptionId, setPrintPrescriptionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (printPrescriptionId) {
      const timer = setTimeout(() => {
        window.print();
        setPrintPrescriptionId(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [printPrescriptionId]);

  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>Medical Prescriptions</h2>
      <p style={{ margin: 0, color: "#72849B", fontSize: "15px", fontWeight: "600", marginBottom: "28px" }}>View prescriptions shared by your specialist doctor.</p>

      {completedWithPrescription.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <FaFileAlt size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#4D5765", margin: "0 0 4px 0" }}>No prescriptions found</h3>
          <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px" }}>Doctor prescriptions will show here after completed sessions.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {completedWithPrescription.map((app) => {
            const isExpanded = expandedId === app._id;
            return (
              <div 
                key={app._id} 
                style={{
                  border: "1px solid #EBF1F9",
                  borderRadius: "14px",
                  backgroundColor: "#FFFFFF",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(77, 87, 101, 0.02)",
                  transition: "all 0.3s ease"
                }}
              >
                {printPrescriptionId === app._id && (
                  <style>{`
                    @media print {
                      html, body {
                        height: 100% !important;
                        overflow: hidden !important;
                      }
                      body * {
                        visibility: hidden !important;
                      }
                      .user-prescription-print-container-${app._id},
                      .user-prescription-print-container-${app._id} * {
                        visibility: visible !important;
                      }
                      .user-prescription-print-container-${app._id} {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        background: white !important;
                        color: black !important;
                      }
                      .print-btn-no-print {
                        display: none !important;
                      }
                    }
                  `}</style>
                )}

                {/* Accordion Header - clickable to expand/collapse */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : app._id)}
                  style={{
                    padding: "18px 24px",
                    backgroundColor: isExpanded ? "#0F2239" : "#FFFFFF",
                    color: isExpanded ? "#FFFFFF" : "#0F2239",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderBottom: isExpanded ? "none" : "1px solid transparent"
                  }}
                  onMouseOver={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor = "#F8FAFC";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      backgroundColor: isExpanded ? "rgba(255,255,255,0.1)" : "rgba(74, 101, 255, 0.08)",
                      color: isExpanded ? "#FFFFFF" : "#4A65FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px"
                    }}>
                      <FaFileAlt />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                        Prescription - {new Date(app.appointmenttime).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: isExpanded ? "#94A3B8" : "#72849B", fontWeight: "600" }}>
                        By {app.assignedDoctor ? app.assignedDoctor.name : "Specialist Doctor"} &bull; {app.speciality}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      fontSize: "12px",
                      fontWeight: "750",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      backgroundColor: isExpanded ? "rgba(255, 255, 255, 0.15)" : "rgba(74, 101, 255, 0.08)",
                      color: isExpanded ? "#FFFFFF" : "#4A65FF",
                    }}>
                      {isExpanded ? "Collapse" : "Expand"}
                    </span>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className={`user-prescription-print-container-${app._id}`}>
                    {/* Clinical Letterhead Subheader */}
                    <div style={{
                      background: "#1A3454",
                      padding: "16px 28px",
                      color: "#FFFFFF",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid rgba(255,255,255,0.05)"
                    }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#FFFFFF" }}>SRI SAI HOSPITAL</h3>
                        <span style={{ fontSize: "11px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Telehealth Prescription slip</span>
                      </div>
                      <button
                        className="print-btn-no-print"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrintPrescriptionId(app._id);
                        }}
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          border: "none",
                          color: "#FFFFFF",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
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
                          <div style={{ display: "flex", gap: "10px", marginTop: "4px", fontSize: "13px", color: "#72849B" }}>
                            <span>Age: <strong>{userAge || "N/A"}</strong></span>
                            <span>Gender: <strong>{userGender || "N/A"}</strong></span>
                            <span>Blood: <strong>{userBloodGroup || "N/A"}</strong></span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#72849B", fontWeight: "700" }}>Consultant</span>
                          <h4 style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "700", color: "#0F2239" }}>{app.assignedDoctor ? app.assignedDoctor.name : "Specialist Doctor"}</h4>
                          <p style={{ margin: "2px 0 0 0", fontSize: "14px", color: "#72849B" }}>{app.speciality}</p>
                        </div>
                      </div>

                      {/* Prescription Text / Structured Table */}
                      {(() => {
                        let isStructured = false;
                        let medicinesList: any[] = [];
                        let adviceNotes = app.prescription || "";

                        try {
                          const parsed = JSON.parse(app.prescription || "");
                          if (parsed && (Array.isArray(parsed.medicines) || parsed.notes !== undefined)) {
                            isStructured = true;
                            medicinesList = parsed.medicines || [];
                            adviceNotes = parsed.notes || "";
                          }
                        } catch (e) {
                          // Not structured JSON
                        }

                        return (
                          <div style={{ marginBottom: "24px", textAlign: "left" }}>
                            <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#4A65FF", fontWeight: "700", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                              Rx Prescriptions
                            </span>
                            {isStructured ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {/* Medicines Table */}
                                {medicinesList.length > 0 ? (
                                  <div style={{ overflowX: "auto", border: "1px solid #EBF1F9", borderRadius: "10px" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                      <thead>
                                        <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "2px solid #EBF1F9", textAlign: "left", fontSize: "12px", color: "#72849B" }}>
                                          <th style={{ padding: "12px", fontWeight: "700" }}>Medicine Name</th>
                                          <th style={{ padding: "12px", fontWeight: "700" }}>Dosage Schedule</th>
                                          <th style={{ padding: "12px", fontWeight: "700" }}>Instruction</th>
                                          <th style={{ padding: "12px", fontWeight: "700" }}>Duration</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {medicinesList.map((med, idx) => (
                                          <tr key={idx} style={{ borderBottom: "1px solid #EBF1F9", fontSize: "14px", color: "#0F2239" }}>
                                            <td style={{ padding: "14px 12px", fontWeight: "700" }}>
                                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                <FaPills color="#4A65FF" /> {med.name}
                                              </span>
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                              {med.isSos ? (
                                                <span style={{ padding: "4px 10px", borderRadius: "8px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", fontWeight: "bold", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                  <FaExclamationTriangle /> SOS / As Needed
                                                </span>
                                              ) : (
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                  <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: med.morning ? "#FEF3C7" : "#F3F4F6", color: med.morning ? "#D97706" : "#9CA3AF", fontWeight: "bold", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                                    Morning
                                                  </span>
                                                  <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: med.noon ? "#FFE4E6" : "#F3F4F6", color: med.noon ? "#E11D48" : "#9CA3AF", fontWeight: "bold", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                                    Noon
                                                  </span>
                                                  <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: med.night ? "#DBEAFE" : "#F3F4F6", color: med.night ? "#2563EB" : "#9CA3AF", fontWeight: "bold", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                                    Night
                                                  </span>
                                                </div>
                                              )}
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                              <span style={{
                                                padding: "4px 10px",
                                                borderRadius: "8px",
                                                fontWeight: "700",
                                                fontSize: "12px",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                color: med.timing === "before" ? "#10B981" : med.timing === "sos" ? "#F59E0B" : "#3B82F6",
                                                backgroundColor: med.timing === "before" ? "rgba(16, 185, 129, 0.08)" : med.timing === "sos" ? "rgba(245, 158, 11, 0.08)" : "rgba(59, 130, 246, 0.08)"
                                              }}>
                                                {med.timing === "before" ? (
                                                  <>
                                                    <FaUtensils /> Before Food
                                                  </>
                                                ) : med.timing === "sos" ? (
                                                  <>
                                                    <FaExclamationTriangle /> SOS / As Needed
                                                  </>
                                                ) : (
                                                  <>
                                                    <FaUtensils /> After Food
                                                  </>
                                                )}
                                              </span>
                                            </td>
                                            <td style={{ padding: "12px", fontWeight: "600", color: "#72849B" }}>
                                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                <FaCalendarAlt /> {med.duration}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div style={{ padding: "20px", textAlign: "center", border: "1px solid #EBF1F9", borderRadius: "10px", color: "#94A3B8", fontSize: "14px" }}>
                                    No specific medicines listed.
                                  </div>
                                )}

                                {/* Advice / Notes */}
                                {adviceNotes && (
                                  <div>
                                    <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#72849B", fontWeight: "700", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
                                      General Notes & Instructions
                                    </span>
                                    <div style={{ padding: "18px", backgroundColor: "#F8FAFC", border: "1px solid #EBF1F9", borderRadius: "10px", fontSize: "15px", color: "#4D5765", whiteSpace: "pre-line", lineHeight: "1.6" }}>
                                      {adviceNotes}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* Legacy plain text fallback */
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
                                {adviceNotes}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#72849B" }}>
                        <span>Date: {new Date(app.appointmenttime).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                        <span style={{ color: "#4A65FF", fontWeight: "700" }}>Sri Sai Hospital Telehealth Verified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 4. BILLING & PAYMENTS TAB
interface PaymentsTabProps {
  appointments: Appointment[];
  copiedId: string | null;
  copyToClipboard: (text: string) => void;
  setSelectedReceipt: (app: Appointment) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  appointments,
  copiedId,
  copyToClipboard,
  setSelectedReceipt
}) => {
  return (
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
                <th style={{ padding: "14px 16px" }}>Receipt</th>
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
                            onClick={() => copyToClipboard(app.paymentId || app._id || "")}
                            style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", padding: "2px" }}
                            title="Copy ID"
                          >
                            {copiedId === (app.paymentId || app._id) ? <FaCheck style={{ color: "#10B981" }} size={10} /> : <FaCopy size={10} />}
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px", fontWeight: "700", color: "#0F2239" }}>₹ {app.amount || 1000}.00</td>
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
                    <td style={{ padding: "16px" }}>
                      {app.paymentStatus === "paid" ? (
                        <button
                          onClick={() => setSelectedReceipt(app)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#4A65FF",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#FFFFFF",
                            cursor: "pointer",
                            transition: "opacity 0.2s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                        >
                          Receipt
                        </button>
                      ) : (
                        <span style={{ fontSize: "13px", color: "#94A3B8" }}>No Receipt</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 5. ACCOUNT SETTINGS TAB
interface ProfileSettingsTabProps {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAge: string | number;
  userGender: string;
  userBloodGroup: string;
  editName: string;
  setEditName: (val: string) => void;
  editPhone: string;
  setEditPhone: (val: string) => void;
  editAge: string | number;
  setEditAge: (val: string | number) => void;
  editGender: string;
  setEditGender: (val: string) => void;
  editBloodGroup: string;
  setEditBloodGroup: (val: string) => void;
  handleSaveProfile: () => void;
  isSaving: boolean;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({
  isEditing,
  setIsEditing,
  userName,
  userEmail,
  userPhone,
  userAge,
  userGender,
  userBloodGroup,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  editAge,
  setEditAge,
  editGender,
  setEditGender,
  editBloodGroup,
  setEditBloodGroup,
  handleSaveProfile,
  isSaving
}) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F2239", margin: "0 0 6px 0" }}>Patient Profile Info</h2>
          <p style={{ margin: 0, color: "#72849B", fontSize: "14px", fontWeight: "600" }}>Your registered telehealth profile details.</p>
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              setEditName(userName);
              setEditPhone(userPhone);
              setEditAge(userAge);
              setEditGender(userGender);
              setEditBloodGroup(userBloodGroup);
            }
            setIsEditing(!isEditing);
          }}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            backgroundColor: isEditing ? "#EF4444" : "#FFFFFF",
            color: isEditing ? "#FFFFFF" : "#4A65FF",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

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
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ width: "100%", fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #CBD5E1" }}
              />
            ) : (
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                {userName}
              </div>
            )}
          </div>
          
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Email Address</label>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#72849B", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9", cursor: "not-allowed" }}>
              {userEmail}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Mobile Number</label>
            {isEditing ? (
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ""))}
                style={{ width: "100%", fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #CBD5E1" }}
              />
            ) : (
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                {userPhone || "Not Provided"}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  style={{ width: "100%", fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
              ) : (
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                  {userAge || "Not Provided"}
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Gender</label>
              {isEditing ? (
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  style={{ width: "100%", fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                  {userGender || "Not Provided"}
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>Blood Group</label>
            {isEditing ? (
              <select
                value={editBloodGroup}
                onChange={(e) => setEditBloodGroup(e.target.value)}
                style={{ width: "100%", fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #CBD5E1" }}
              >
                <option value="Unknown">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F2239", padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #EBF1F9" }}>
                {userBloodGroup || "Unknown"}
              </div>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#4A65FF",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {isSaving ? "Saving changes..." : "Save Profile Details"}
            </button>
          )}

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
  );
};
