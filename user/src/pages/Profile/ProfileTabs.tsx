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
  FaCheckCircle
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
                backgroundColor: "rgba(63, 89, 255, 0.2)",
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
                  <FaStethoscope style={{ color: "#3F59FF" }} /> Specialist: <strong style={{ color: "#FFFFFF", fontWeight: "600" }}>{upcomingAppointment.assignedDoctor ? upcomingAppointment.assignedDoctor.name : "Not Assigned"}</strong>
                </p>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaClock style={{ color: "#3F59FF" }} /> Scheduled: <strong style={{ color: "#FFFFFF", fontWeight: "600" }}>{new Date(upcomingAppointment.appointmenttime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong>
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
                  backgroundColor: "#3F59FF",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
                  boxShadow: "0 4px 12px rgba(63, 89, 255, 0.2)",
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
                    <button
                      onClick={() => handleJoinMeeting(app._id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#3F59FF",
                        color: "#FFFFFF",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "14px",
                        boxShadow: "0 4px 10px rgba(63, 89, 255, 0.15)",
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
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {completedWithPrescription.map((app) => (
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
                            backgroundColor: "#3F59FF",
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
            color: isEditing ? "#FFFFFF" : "#3F59FF",
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
                backgroundColor: "#3F59FF",
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
