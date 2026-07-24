import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaPrint,
  FaClock,
  FaCreditCard,
  FaCopy,
  FaCheck,
  FaPills,
  FaUtensils,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaWallet,
  FaArrowRight,
  FaEnvelope,
  FaMobileAlt,
  FaTint,
  FaEdit,
  FaVideo,
  FaShieldAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import profileIllustration from "../../assets/srisai-profile.png";

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
  setActiveTab?: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userName: _userName,
  appointments,
  upcomingAppointment: _upcomingAppointment,
  handleJoinMeeting: _handleJoinMeeting,
  setActiveTab
}) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/#appointment-section");
    setTimeout(() => {
      const element = document.getElementById("appointment-form-wrapper") || document.getElementById("appointment-section");
      if (element) {
        const headerHeight = 90;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerHeight - 20,
          behavior: "smooth",
        });
        const nameInput = document.getElementById("pasentname");
        if (nameInput) nameInput.focus();
      }
    }, 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeInUp 0.5s ease" }}>
      {/* Top Banner */}
      <div style={{
        background: "linear-gradient(105.87deg, #E9F2FF 0%, #F3F8FF 100%)",
        borderRadius: "16px",
        padding: "36px 40px",
        border: "1px solid #E2EEFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ flex: 1, zIndex: 2, textAlign: "left" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2239", margin: "0 0 12px 0", lineHeight: "1.2" }}>
            Dedicated to Your <br />Health & Well-being
          </h2>
          <p style={{ margin: "0 0 24px 0", color: "#4D5765", fontSize: "15px", fontWeight: "600", lineHeight: "1.6", maxWidth: "450px" }}>
            Get clinical guidance from Sri Sai specialist doctors, manage your consultations, and track prescription slips securely.
          </p>
          <button
            onClick={handleBookAppointment}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "10px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1D4ED8"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
          >
            <FaCalendarAlt /> Book Appointment
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 1 }}>
          <img
            src={profileIllustration}
            alt="Profile Illustration"
            style={{
              maxHeight: "220px",
              width: "auto",
              objectFit: "contain",
              pointerEvents: "none"
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F2239", margin: "0 0 16px 0", textAlign: "left" }}>Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {[
            {
              title: "View Prescriptions",
              desc: "View and download prescription slips",
              color: "#10B981",
              bg: "#ECFDF5",
              border: "#D1FAE5",
              action: () => setActiveTab && setActiveTab("prescriptions"),
              icon: <FaFileAlt />
            },
            {
              title: "Payment Receipts",
              desc: "View your payment history",
              color: "#8B5CF6",
              bg: "#F5F3FF",
              border: "#EDE9FE",
              action: () => setActiveTab && setActiveTab("payments"),
              icon: <FaCreditCard />
            },
            {
              title: "Update Profile",
              desc: "Manage your personal information",
              color: "#0D9488",
              bg: "#F0FDFA",
              border: "#CCFBF1",
              action: () => setActiveTab && setActiveTab("settings"),
              icon: <FaUser />
            }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EBF1F9",
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "140px",
                transition: "all 0.25s ease",
                textAlign: "left"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(77, 87, 101, 0.05)";
                e.currentTarget.style.borderColor = item.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#EBF1F9";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  backgroundColor: item.bg,
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  border: `1px solid ${item.border}`
                }}>
                  {item.icon}
                </div>
                <span style={{ color: item.color, fontSize: "14px", fontWeight: "700" }}>
                  <FaArrowRight />
                </span>
              </div>
              <div style={{ marginTop: "12px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0F2239", margin: "0 0 4px 0" }}>{item.title}</h4>
                <p style={{ fontSize: "12px", color: "#72849B", margin: 0, fontWeight: "600", lineHeight: "1.4" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        {[
          {
            title: "Total Bookings",
            value: appointments.length,
            color: "#3B82F6",
            bg: "#EEF2FF",
            border: "#E0E7FF",
            icon: <FaCalendarAlt />,
            linkText: "View all bookings",
            action: () => setActiveTab && setActiveTab("appointments")
          },
          {
            title: "Completed Sessions",
            value: appointments.filter(a => a.status === "completed").length,
            color: "#8B5CF6",
            bg: "#F5F3FF",
            border: "#EDE9FE",
            icon: <FaFileAlt />,
            linkText: "View session history",
            action: () => setActiveTab && setActiveTab("appointments")
          },
          {
            title: "Payments Made",
            value: appointments.filter(a => a.paymentStatus === "paid").length,
            color: "#0D9488",
            bg: "#F0FDFA",
            border: "#CCFBF1",
            icon: <FaWallet />,
            linkText: "View payment history",
            action: () => setActiveTab && setActiveTab("payments")
          }
        ].map((stat, idx) => (
          <div key={idx} style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EBF1F9",
            borderRadius: "14px",
            padding: "24px 20px 16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "150px",
            boxShadow: "0 4px 12px rgba(77, 87, 101, 0.01)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.title}</span>
                <h4 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2239", margin: "6px 0 0 0" }}>{stat.value}</h4>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: stat.bg,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                border: `1px solid ${stat.border}`
              }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={stat.action}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: stat.color,
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                {stat.linkText}
              </button>
              <span style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: stat.bg,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                cursor: "pointer"
              }}
              onClick={stat.action}
              >
                <FaArrowRight />
              </span>
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
  setActiveTab?: (tab: string) => void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  handleJoinMeeting,
  setActiveTab
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate total pages
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  // Slice appointments list for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ animation: "fadeInUp 0.4s ease", textAlign: "left" }}>
      {/* Header section with Calendar icon badge */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "28px" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#EEF2FF",
          color: "#4F46E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px"
        }}>
          <FaCalendarAlt />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "750", color: "#0F2239", margin: "0 0 4px 0" }}>My Appointments</h2>
          <p style={{ margin: 0, color: "#72849B", fontSize: "14px", fontWeight: "600" }}>Track your consultation status and join your appointments easily.</p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <FaCalendarAlt size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#4D5765", margin: "0 0 4px 0" }}>No bookings found</h3>
          <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px" }}>Your scheduled consultations will be listed here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {paginatedAppointments.map((app) => {
              // Determine active themes
              const isPendingPaymentOnly = app.paymentStatus === "pending" && app.status === "pending";
              const isPaidButPendingApproval = app.paymentStatus === "paid" && app.status === "pending";
              const isPendingPayment = isPendingPaymentOnly || isPaidButPendingApproval;
              const isApproved = app.status === "approved";
              const isCompleted = app.status === "completed";
              const isCancelled = app.status === "cancelled";

              let themeColor = "#3B82F6"; // default blue
              let themeBg = "#EEF2FF";
              let panelBg = "#F8FAFF";
              let leftIcon = <FaFileAlt />;
              let statusLabel = "Scheduled";
              let rightHeader = "Status Active";
              let rightDesc = "Consultation is active.";
              
              if (isPendingPayment) {
                if (isPaidButPendingApproval) {
                  themeColor = "#D97706"; // golden yellow/amber
                  themeBg = "#FEF3C7";
                  panelBg = "#FFFDF5";
                  leftIcon = <FaClock />;
                  statusLabel = "AWAITING APPROVAL";
                  rightHeader = "Payment Successful";
                  rightDesc = "Payment received! Please wait a few minutes. Once the admin approves, your meeting link will appear here.";
                } else {
                  themeColor = "#EA580C"; // orange
                  themeBg = "#FFF3E0";
                  panelBg = "#FFFDF5";
                  leftIcon = <FaClock />;
                  statusLabel = "PENDING PAYMENT";
                  rightHeader = "Payment Pending";
                  rightDesc = "Complete your payment to confirm this appointment.";
                }
              } else if (isApproved) {
                themeColor = "#10B981"; // green
                themeBg = "#E8F8F0";
                panelBg = "#F4FDF7";
                leftIcon = <FaShieldAlt />;
                statusLabel = "APPROVED";
                rightHeader = "Admin Approved";
                rightDesc = "Your appointment has been approved. You can join the meeting at the scheduled time.";
              } else if (isCompleted) {
                themeColor = "#3B82F6"; // blue
                themeBg = "#EEF2FF";
                panelBg = "#F8FAFF";
                leftIcon = <FaFileAlt />;
                statusLabel = "COMPLETED";
                rightHeader = "Completed";
                rightDesc = "This appointment has been completed. Thank you for consulting with us.";
              } else if (isCancelled) {
                themeColor = "#EF4444"; // red
                themeBg = "#FEE2E2";
                panelBg = "#FEF2F2";
                leftIcon = <FaExclamationTriangle />;
                statusLabel = "CANCELLED";
                rightHeader = "Cancelled";
                rightDesc = "This appointment was cancelled. Please contact helpline for details.";
              }

              const formattedTime = new Date(app.appointmenttime).toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
              });

              return (
                <div
                  key={app._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1fr",
                    backgroundColor: "#FFFFFF",
                    border: `2px solid ${themeColor}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.01)"
                  }}
                >
                  {/* Left Section: Details */}
                  <div style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    {/* Status Big Icon Container */}
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      backgroundColor: themeBg,
                      color: themeColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0
                    }}>
                      {leftIcon}
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                      {/* Status Badge */}
                      <div>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: themeBg,
                          color: themeColor,
                          fontSize: "10px",
                          fontWeight: "600",
                          letterSpacing: "0.5px"
                        }}>
                          {statusLabel}
                        </span>
                      </div>

                      {/* Speciality Title */}
                      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0F2239", margin: 0 }}>
                        {app.speciality}
                      </h3>

                      {/* Doctor & Date Row info */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: "#72849B" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#3B82F6", display: "flex" }}><FaUser size={12} /></span>
                          Doctor: <strong style={{ color: "#4D5765", fontWeight: "600" }}>{app.assignedDoctor ? app.assignedDoctor.name : "Not Assigned"}</strong>
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#3B82F6", display: "flex" }}><FaCalendarAlt size={12} /></span>
                          {formattedTime}
                        </span>
                      </div>

                      {/* Extra meeting link if approved */}
                      {isApproved && app.meetingLink && (
                        <div style={{
                          marginTop: "2px",
                          padding: "10px 14px",
                          backgroundColor: "#F0FDF4",
                          borderRadius: "10px",
                          border: "1px solid #DCFCE7",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "13px"
                        }}>
                          <span style={{ color: "#10B981", display: "flex", fontSize: "14px" }}><FaVideo /></span>
                          <div style={{ textAlign: "left" }}>
                            <span style={{ display: "block", fontSize: "10px", color: "#15803D", fontWeight: "600" }}>Meeting Link</span>
                            <a
                              href={app.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#2563EB", fontWeight: "600", textDecoration: "none" }}
                              onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                              onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                            >
                              {app.meetingLink}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section: Status Panel Actions */}
                  <div style={{
                    backgroundColor: panelBg,
                    borderLeft: `1.5px solid ${themeColor}`,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "left"
                  }}>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#0F2239", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: themeColor }}>{isPendingPayment ? "⚠️" : "✓"}</span> {rightHeader}
                      </h4>
                      <p style={{ fontSize: "12px", color: "#4D5765", fontWeight: "500", margin: 0, lineHeight: "1.4" }}>
                        {rightDesc}
                      </p>
                    </div>

                    {/* Dynamic Action Trigger Buttons */}
                    <div style={{ marginTop: "20px" }}>
                      {isPendingPaymentOnly && (
                        <button
                          onClick={() => setActiveTab && setActiveTab("payments")}
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            backgroundColor: "#EA580C",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "750",
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(234, 88, 12, 0.15)",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C2410C"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EA580C"}
                        >
                          Pay Now
                        </button>
                      )}

                      {isPaidButPendingApproval && (
                        <div style={{
                          width: "100%",
                          padding: "10px 16px",
                          backgroundColor: "#FEF3C7",
                          color: "#D97706",
                          border: "1px solid #FCD34D",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "750",
                          textAlign: "center"
                        }}>
                          ⏳ Awaiting Approval
                        </div>
                      )}

                      {isApproved && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {app.meetingLink ? (
                            <button
                              onClick={() => handleJoinMeeting(app._id)}
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                backgroundColor: "#10B981",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "750",
                                cursor: "pointer",
                                boxShadow: "0 4px 10px rgba(16, 185, 129, 0.15)",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#059669"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10B981"}
                            >
                              🎥 Join Call
                            </button>
                          ) : (
                            <button
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                backgroundColor: "#FFFFFF",
                                border: "1.5px solid #2563EB",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "750",
                                color: "#2563EB",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#2563EB";
                                e.currentTarget.style.color = "#FFFFFF";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#FFFFFF";
                                e.currentTarget.style.color = "#2563EB";
                              }}
                            >
                              📅 Add to Calendar
                            </button>
                          )}
                        </div>
                      )}

                      {isCompleted && (
                        <button
                          onClick={() => setActiveTab && setActiveTab("prescriptions")}
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            backgroundColor: "#FFFFFF",
                            border: "1.5px solid #2563EB",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "750",
                            color: "#2563EB",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#2563EB";
                            e.currentTarget.style.color = "#FFFFFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                            e.currentTarget.style.color = "#2563EB";
                          }}
                        >
                          View Summary
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #F1F5F9"
            }}>
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  color: currentPage === 1 ? "#94A3B8" : "#0F2239",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  transition: "all 0.2s"
                }}
              >
                <FaChevronLeft />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: isActive ? "none" : "1.5px solid #E2E8F0",
                      backgroundColor: isActive ? "#2563EB" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : "#0F2239",
                      fontWeight: "750",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s"
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  color: currentPage === totalPages ? "#94A3B8" : "#0F2239",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  transition: "all 0.2s"
                }}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
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
    <div style={{ animation: "fadeInUp 0.4s ease", textAlign: "left" }}>
      {/* Header section with Document icon badge */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "28px" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#EEF2FF",
          color: "#4F46E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px"
        }}>
          <FaFileAlt />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#0F2239", margin: "0 0 4px 0" }}>Medical Prescriptions</h2>
          <p style={{ margin: 0, color: "#72849B", fontSize: "14px", fontWeight: "500" }}>View and download prescriptions shared by your specialist doctor.</p>
        </div>
      </div>

      {completedWithPrescription.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <FaFileAlt size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#4D5765", margin: "0 0 4px 0" }}>No prescriptions found</h3>
          <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px" }}>Doctor prescriptions will show here after completed sessions.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {completedWithPrescription.map((app) => {
            const isExpanded = expandedId === app._id;
            
            // Replicate the mockup with clean blue Completed theme for all prescriptions
            const accentColor = "#2563EB"; 
            const statusLabel = "Completed";
            const statusBg = "#EEF2FF";

            const formattedDate = new Date(app.appointmenttime).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric"
            });

            return (
              <div
                key={app._id}
                style={{
                  border: `2px solid ${accentColor}`,
                  borderRadius: "16px",
                  backgroundColor: "#FFFFFF",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.01)",
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
                    padding: "20px 24px",
                    backgroundColor: "#FFFFFF",
                    display: "grid",
                    gridTemplateColumns: "60px 1.5fr 1fr 180px",
                    gap: "16px",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  {/* Left Rx Icon block */}
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "#EEF2FF",
                    color: "#2563EB",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    fontSize: "14px",
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: "1" }}>Rx</span>
                    <FaFileAlt style={{ fontSize: "12px", marginTop: "1px" }} />
                  </div>

                  {/* Doctor & Speciality */}
                  <div style={{ textAlign: "left" }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#0F2239" }}>
                      Prescription • {formattedDate}
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#72849B", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#3B82F6", display: "flex" }}><FaUser size={12} /></span>
                        Dr. {app.assignedDoctor ? app.assignedDoctor.name : "Specialist Doctor"} • {app.speciality}
                      </span>
                      <div>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "6px",
                          backgroundColor: statusBg,
                          color: accentColor,
                          fontSize: "11px",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <span style={{ width: "5px", height: "5px", backgroundColor: accentColor, borderRadius: "50%" }}></span>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date Column (Center) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#72849B", fontWeight: "500", textAlign: "left" }}>
                    <FaCalendarAlt style={{ color: "#3B82F6" }} />
                    {formattedDate}
                  </div>

                  {/* Actions (Right) */}
                  <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}
                    onClick={(e) => e.stopPropagation()} // Prevents toggling accordion when clicking button controls
                  >
                    {/* View Details Button */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app._id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        backgroundColor: "#EEF2FF",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#2563EB",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2563EB";
                        e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#EEF2FF";
                        e.currentTarget.style.color = "#2563EB";
                      }}
                    >
                      👁 View Details
                    </button>


                    {/* Collapse chevron */}
                    <span
                      onClick={() => setExpandedId(isExpanded ? null : app._id)}
                      style={{ color: "#72849B", cursor: "pointer", fontSize: "14px", marginLeft: "4px", display: "flex" }}
                    >
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
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
                      <div style={{ textAlign: "left" }}>
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
                        <div style={{ textAlign: "left" }}>
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
                        <span style={{ color: "#4A65FF", fontWeight: "700" }}>Sri Sai Hospital Verified</span>
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
    <div style={{ animation: "fadeInUp 0.4s ease", textAlign: "left" }}>
      {/* Header section with Illustration */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #F1F5F9", paddingBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0F2239", margin: "0 0 6px 0" }}>Payment Receipts</h2>
          <p style={{ margin: 0, color: "#72849B", fontSize: "14px", fontWeight: "600" }}>Consultation fee receipts and transaction histories.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" fill="#F3F8FF"/>
            <path d="M95 85C95 90 90 95 85 95C80 95 75 90 75 85" stroke="#E2EEFF" strokeWidth="4" strokeLinecap="round"/>
            <rect x="35" y="25" width="50" height="70" rx="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3"/>
            <rect x="48" y="18" width="24" height="10" rx="3" fill="#3B82F6"/>
            <circle cx="60" cy="23" r="2" fill="#FFFFFF"/>
            <line x1="45" y1="42" x2="75" y2="42" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round"/>
            <line x1="45" y1="52" x2="75" y2="52" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round"/>
            <line x1="45" y1="62" x2="65" y2="62" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round"/>
            <line x1="45" y1="72" x2="70" y2="72" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="85" cy="75" r="16" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2"/>
            <text x="85" y="80" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">₹</text>
          </svg>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <FaCreditCard size={48} style={{ color: "#E2E8F0", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#4D5765", margin: "0 0 4px 0" }}>No transactions found</h3>
          <p style={{ margin: 0, color: "#94A3B8", fontSize: "15px" }}>Invoices will appear here once booking is confirmed.</p>
        </div>
      ) : (
        <div>
          {/* Table Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "100px 1.5fr 1fr 100px 120px",
            gap: "16px",
            padding: "0 20px 12px 20px",
            color: "#72849B",
            fontSize: "12px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            <div>Date</div>
            <div>Description</div>
            <div>Amount Paid</div>
            <div style={{ textAlign: "center" }}>Status</div>
            <div style={{ textAlign: "right" }}>Receipt</div>
          </div>

          {/* Table Rows (Card Style) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {appointments.map((app: Appointment) => {
              const dateObj = new Date(app.createdAt || app.appointmenttime);
              const day = dateObj.getDate().toString().padStart(2, "0");
              const monthYear = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
              
              const isPaid = app.paymentStatus === "paid";
              const payColor = isPaid ? "#10B981" : app.paymentStatus === "failed" ? "#EF4444" : "#F59E0B";
              const payBg = isPaid ? "#E8F8F0" : app.paymentStatus === "failed" ? "rgba(239, 68, 68, 0.06)" : "rgba(245, 158, 11, 0.06)";

              return (
                <div
                  key={app._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1.5fr 1fr 100px 120px",
                    gap: "16px",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #F1F5F9",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.01)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#F1F5F9";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.01)";
                  }}
                >
                  {/* Calendar Date Block */}
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    backgroundColor: "#F5F8FF",
                    border: "1px solid #E2EEFF",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#2563EB", lineHeight: "1" }}>{day}</span>
                    <span style={{ fontSize: "11px", fontWeight: "750", color: "#72849B", marginTop: "4px" }}>{monthYear}</span>
                  </div>

                  {/* Booking Description */}
                  <div style={{ textAlign: "left" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0F2239", margin: "0 0 4px 0" }}>
                      {app.speciality} Consultation
                    </h4>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "monospace" }}>
                        Booking ID: {app.paymentId || app._id}
                      </span>
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
                  </div>

                  {/* Amount Paid */}
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#0F2239", textAlign: "left" }}>
                    ₹ {app.amount || 1000}.00
                  </div>

                  {/* Payment Status Badge */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "800",
                      color: payColor,
                      backgroundColor: payBg,
                      textTransform: "capitalize",
                      display: "inline-block",
                      textAlign: "center"
                    }}>
                      {app.paymentStatus || "pending"}
                    </span>
                  </div>

                  {/* Receipt Download Action */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {isPaid ? (
                      <button
                        onClick={() => setSelectedReceipt(app)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          backgroundColor: "#FFFFFF",
                          border: "1.5px solid #2563EB",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "750",
                          color: "#2563EB",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#2563EB";
                          e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                          e.currentTarget.style.color = "#2563EB";
                        }}
                      >
                        📥 Receipt
                      </button>
                    ) : (
                      <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: "600" }}>No Receipt</span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
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
  userAddress: string;
  userAlternatePhone: string;
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
  editAddress: string;
  setEditAddress: (val: string) => void;
  editAlternatePhone: string;
  setEditAlternatePhone: (val: string) => void;
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
  userAddress,
  userAlternatePhone,
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
  editAddress,
  setEditAddress,
  editAlternatePhone,
  setEditAlternatePhone,
  handleSaveProfile,
  isSaving
}) => {
  return (
    <div style={{ textAlign: "left", animation: "fadeInUp 0.4s ease" }}>
      {/* Header section with Edit Profile button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0F2239", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            Patient Profile <span style={{ color: "#3B82F6", fontSize: "20px" }}>🛡️</span>
          </h2>
          <p style={{ margin: 0, color: "#72849B", fontSize: "14px", fontWeight: "600" }}>Your personal details and account information</p>
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              setEditName(userName);
              setEditPhone(userPhone);
              setEditAge(userAge);
              setEditGender(userGender);
              setEditBloodGroup(userBloodGroup);
              setEditAddress(userAddress);
              setEditAlternatePhone(userAlternatePhone);
            }
            setIsEditing(!isEditing);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "1.5px solid #E2E8F0",
            backgroundColor: isEditing ? "#EF4444" : "#FFFFFF",
            color: isEditing ? "#FFFFFF" : "#3B82F6",
            fontWeight: "750",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            transition: "all 0.2s"
          }}
        >
          <FaEdit /> {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Main 2-column Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "28px", alignItems: "start" }}>
        
        {/* Left Column: Personal Information & Verified Badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Personal Info Card */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EBF1F9",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 4px 12px rgba(77, 87, 101, 0.01)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0F2239", margin: "0 0 24px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#EEF2FF", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaUser size={14} />
              </div>
              Personal Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Full Name */}
              <div style={{
                border: "1px solid #EBF1F9",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: "#FFFFFF"
              }}>
                <div style={{ color: "#3B82F6", display: "flex" }}><FaUser size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ width: "100%", fontSize: "14px", fontWeight: "700", color: "#0F2239", border: "none", outline: "none", padding: 0 }}
                    />
                  ) : (
                    <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239" }}>{userName}</div>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div style={{
                border: "1px solid #EBF1F9",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: "#F8FAFC"
              }}>
                <div style={{ color: "#3B82F6", display: "flex" }}><FaEnvelope size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Email Address</label>
                  <div style={{ fontSize: "14px", fontWeight: "750", color: "#4D5765" }}>{userEmail}</div>
                </div>
              </div>

              {/* Mobile Number */}
              <div style={{
                border: "1px solid #EBF1F9",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: "#FFFFFF"
              }}>
                <div style={{ color: "#3B82F6", display: "flex" }}><FaMobileAlt size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ""))}
                      style={{ width: "100%", fontSize: "14px", fontWeight: "700", color: "#0F2239", border: "none", outline: "none", padding: 0 }}
                    />
                  ) : (
                    <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239" }}>{userPhone || "Not Provided"}</div>
                  )}
                </div>
              </div>

              {/* Age & Gender Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                
                {/* Age */}
                <div style={{
                  border: "1px solid #EBF1F9",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  backgroundColor: "#FFFFFF"
                }}>
                  <div style={{ color: "#3B82F6", display: "flex" }}><FaCalendarAlt size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Age</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editAge}
                        onChange={(e) => setEditAge(e.target.value)}
                        style={{ width: "100%", fontSize: "14px", fontWeight: "700", color: "#0F2239", border: "none", outline: "none", padding: 0 }}
                      />
                    ) : (
                      <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239" }}>{userAge || "Not Provided"}</div>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div style={{
                  border: "1px solid #EBF1F9",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  backgroundColor: "#FFFFFF"
                }}>
                  <div style={{ color: "#3B82F6", display: "flex" }}><FaUser size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Gender</label>
                    {isEditing ? (
                      <select
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                        style={{ width: "100%", fontSize: "14px", fontWeight: "700", color: "#0F2239", border: "none", outline: "none", padding: 0, backgroundColor: "#FFFFFF" }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239" }}>{userGender || "Not Provided"}</div>
                    )}
                  </div>
                </div>

              </div>

              {/* Blood Group */}
              <div style={{
                border: "1px solid #EBF1F9",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: "#FFFFFF"
              }}>
                <div style={{ color: "#3B82F6", display: "flex" }}><FaTint size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Blood Group</label>
                  {isEditing ? (
                    <select
                      value={editBloodGroup}
                      onChange={(e) => setEditBloodGroup(e.target.value)}
                      style={{ width: "100%", fontSize: "14px", fontWeight: "700", color: "#0F2239", border: "none", outline: "none", padding: 0, backgroundColor: "#FFFFFF" }}
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
                    <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239" }}>{userBloodGroup || "Unknown"}</div>
                  )}
                </div>
              </div>

            </div>

            {/* Save Button for editing */}
            {isEditing && (
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "20px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "750",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(59, 130, 246, 0.15)",
                  transition: "all 0.2s"
                }}
              >
                {isSaving ? "Saving changes..." : "Save Profile Details"}
              </button>
            )}

          </div>

          {/* Verification Box Footer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px 24px",
            backgroundColor: "#F0FDF4",
            borderRadius: "16px",
            border: "1px solid #DCFCE7",
            color: "#15803D"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              ✓
            </div>
            <div style={{ textAlign: "left" }}>
              <h4 style={{ margin: "0 0 2px 0", fontSize: "15px", fontWeight: "800", color: "#166534" }}>Verified Sri Sai Patient Profile</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#15803D", fontWeight: "600" }}>Your profile has been verified by Sri Sai Hospital.</p>
            </div>
          </div>

        </div>

        {/* Right Column: Care Team & Account Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Primary Contact Address */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EBF1F9",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "left",
            boxShadow: "0 4px 12px rgba(77, 87, 101, 0.01)"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0F2239", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>📍</span> Contact Address
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Residential Address</label>
                {isEditing ? (
                  <textarea
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Enter your full address..."
                    style={{
                      width: "100%",
                      height: "80px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F2239",
                      padding: "8px 12px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "8px",
                      outline: "none",
                      resize: "none",
                      fontFamily: "inherit"
                    }}
                  />
                ) : (
                  <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                    {userAddress || "Not Provided"}
                  </div>
                )}
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Alternate Mobile No</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editAlternatePhone}
                    onChange={(e) => setEditAlternatePhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Alternate mobile number..."
                    style={{
                      width: "100%",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0F2239",
                      padding: "8px 12px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "8px",
                      outline: "none"
                    }}
                  />
                ) : (
                  <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239" }}>
                    {userAlternatePhone || "Not Provided"}
                  </div>
                )}
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Emergency Hotline</label>
                <div style={{ fontSize: "14px", fontWeight: "750" }}>
                  <a
                    href="tel:+919444479090"
                    style={{
                      color: "#EF4444",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                  >
                    📞 +91 94444 79090
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EBF1F9",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "left",
            boxShadow: "0 4px 12px rgba(77, 87, 101, 0.01)"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0F2239", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>🛡️</span> Account Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Member Since</label>
                <div style={{ fontSize: "14px", fontWeight: "750", color: "#0F2239", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaCalendarAlt color="#94A3B8" /> 22 Jul 2026
                </div>
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "750", color: "#72849B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Profile Status</label>
                <div>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    backgroundColor: "#DCFCE7",
                    color: "#15803D",
                    fontSize: "12px",
                    fontWeight: "800",
                    display: "inline-block"
                  }}>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
