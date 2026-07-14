import React, { useState } from "react";
import {
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
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
  subject?: string;
  status: string;
  assignedDoctor?: Doctor;
  paymentStatus: string;
  paymentId?: string;
  meetingLink?: string;
  prescription?: string;
}

interface AppointmentsTabProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: any[];
  isLoadingAppointments: boolean;
  appointmentsError: string;
  fetchAppointments: () => void;
  triggerToast: (msg: string) => void;

  // Manage Modal Props
  isManageModalOpen: boolean;
  setIsManageModalOpen: (open: boolean) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (app: Appointment | null) => void;
  manageStatus: string;
  setManageStatus: (status: string) => void;
  manageDoctor: string;
  setManageDoctor: (docId: string) => void;
  managePrescription: string;
  setManagePrescription: (prescription: string) => void;
  managePaymentStatus: string;
  setManagePaymentStatus: (status: string) => void;
  isSavingAppointment: boolean;
  handleManageSubmit: (e: React.FormEvent) => void;

  SPECIALITIES: string[];
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  doctors,
  patients,
  isLoadingAppointments,
  appointmentsError,
  fetchAppointments,
  triggerToast,

  isManageModalOpen,
  setIsManageModalOpen,
  selectedAppointment,
  setSelectedAppointment,
  manageStatus,
  setManageStatus,
  manageDoctor,
  setManageDoctor,
  managePrescription,
  setManagePrescription,
  managePaymentStatus,
  setManagePaymentStatus,
  isSavingAppointment,
  handleManageSubmit,

  SPECIALITIES,
}) => {
  // Local filter states
  const [appointmentSearchText, setAppointmentSearchText] = useState("");
  const [appointmentSpecialityFilter, setAppointmentSpecialityFilter] = useState("All");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("All");
  const [appointmentDateFilter, setAppointmentDateFilter] = useState("All"); // "All", "today", "tomorrow", "custom"
  const [appointmentCustomDate, setAppointmentCustomDate] = useState("");
  const [activeAppPage, setAppointmentCurrentPage] = useState(1);
  const [appointmentViewMode, setAppointmentViewMode] = useState<"table" | "calendar">("table");
  const [printPrescriptionAppointment, setPrintPrescriptionAppointment] = useState<any | null>(null);
  const appointmentsPerPage = 8;

  // Helper date matching
  const matchesFilterDate = (appDateStr: string) => {
    if (appointmentDateFilter === "All") return true;

    const appDate = new Date(appDateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (appointmentDateFilter === "today") {
      return (
        appDate.getDate() === today.getDate() &&
        appDate.getMonth() === today.getMonth() &&
        appDate.getFullYear() === today.getFullYear()
      );
    }
    if (appointmentDateFilter === "tomorrow") {
      return (
        appDate.getDate() === tomorrow.getDate() &&
        appDate.getMonth() === tomorrow.getMonth() &&
        appDate.getFullYear() === tomorrow.getFullYear()
      );
    }
    if (appointmentDateFilter === "custom" && appointmentCustomDate) {
      const custom = new Date(appointmentCustomDate);
      return (
        appDate.getDate() === custom.getDate() &&
        appDate.getMonth() === custom.getMonth() &&
        appDate.getFullYear() === custom.getFullYear()
      );
    }
    return true;
  };

  const filteredAppointments = appointments.filter((app) => {
    const searchLower = appointmentSearchText.toLowerCase();
    const matchesSearch =
      !appointmentSearchText ||
      (app.pasentname && app.pasentname.toLowerCase().includes(searchLower)) ||
      (app.pasentmail && app.pasentmail.toLowerCase().includes(searchLower)) ||
      (app.pasentnumber && app.pasentnumber.includes(searchLower));

    const matchesSpeciality =
      appointmentSpecialityFilter === "All" || app.speciality === appointmentSpecialityFilter;

    const matchesStatus =
      appointmentStatusFilter === "All" || app.status === appointmentStatusFilter.toLowerCase();

    const matchesDate = matchesFilterDate(app.appointmenttime);

    return matchesSearch && matchesSpeciality && matchesStatus && matchesDate;
  });

  // Client-side pagination
  const totalAppointmentPages = Math.ceil(filteredAppointments.length / appointmentsPerPage) || 1;
  const activeAppPageBounded = Math.min(activeAppPage, totalAppointmentPages);
  const indexOfLastApp = activeAppPageBounded * appointmentsPerPage;
  const indexOfFirstApp = indexOfLastApp - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstApp, indexOfLastApp);

  return (
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
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* View Toggles */}
          <div style={{ display: "flex", backgroundColor: "#F1F5F9", borderRadius: "10px", padding: "4px" }}>
            <button
              onClick={() => setAppointmentViewMode("table")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: appointmentViewMode === "table" ? "#FFFFFF" : "transparent",
                color: appointmentViewMode === "table" ? "#3F59FF" : "#64748B",
                boxShadow: appointmentViewMode === "table" ? "0 2px 8px rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              Table View
            </button>
            <button
              onClick={() => setAppointmentViewMode("calendar")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: appointmentViewMode === "calendar" ? "#FFFFFF" : "transparent",
                color: appointmentViewMode === "calendar" ? "#3F59FF" : "#64748B",
                boxShadow: appointmentViewMode === "calendar" ? "0 2px 8px rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              Calendar View
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={() => {
              if (appointments.length === 0) {
                triggerToast("❌ No appointment data to export.");
                return;
              }

              const headers = ["Patient Name", "Email", "Phone", "Specialist", "Timing", "Status", "Payment Status"];
              const rows = appointments.map((app) => [
                app.pasentname,
                app.pasentmail,
                app.pasentnumber,
                app.assignedDoctor ? app.assignedDoctor.name : "Not Assigned",
                new Date(app.appointmenttime).toLocaleString(),
                app.status,
                app.paymentStatus || "pending",
              ]);

              const csvContent = "data:text/csv;charset=utf-8,"
                + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Appointments_Export_${new Date().toISOString().split("T")[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              triggerToast("✅ CSV Export downloaded successfully!");
            }}
            style={{
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "13px",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Appointment Search & Filter Controls */}
      {appointmentViewMode === "table" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr 1fr",
            gap: "12px",
            marginBottom: "24px",
            alignItems: "center",
          }}
        >
          {/* Search Patient */}
          <div style={{ position: "relative" }}>
            <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search patient..."
              value={appointmentSearchText}
              onChange={(e) => {
                setAppointmentSearchText(e.target.value);
                setAppointmentCurrentPage(1);
              }}
              style={{
                width: "100%",
                padding: "9px 10px 9px 32px",
                borderRadius: "8px",
                border: "1.5px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          {/* Department Filter */}
          <select
            value={appointmentSpecialityFilter}
            onChange={(e) => {
              setAppointmentSpecialityFilter(e.target.value);
              setAppointmentCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "9px 10px",
              borderRadius: "8px",
              border: "1.5px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="All">All Specialities</option>
            {SPECIALITIES.map(sp => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={appointmentStatusFilter}
            onChange={(e) => {
              setAppointmentStatusFilter(e.target.value);
              setAppointmentCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "9px 10px",
              borderRadius: "8px",
              border: "1.5px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={appointmentDateFilter}
            onChange={(e) => {
              setAppointmentDateFilter(e.target.value);
              setAppointmentCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "9px 10px",
              borderRadius: "8px",
              border: "1.5px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="All">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="custom">Custom Date</option>
          </select>

          {/* Custom Date Input */}
          <input
            type="date"
            disabled={appointmentDateFilter !== "custom"}
            value={appointmentCustomDate}
            onChange={(e) => {
              setAppointmentCustomDate(e.target.value);
              setAppointmentCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "9px 10px",
              borderRadius: "8px",
              border: "1.5px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: appointmentDateFilter !== "custom" ? "#F1F5F9" : "#FFFFFF",
              color: appointmentDateFilter !== "custom" ? "#94a3b8" : "#0F172A",
              cursor: appointmentDateFilter !== "custom" ? "not-allowed" : "pointer",
            }}
          />
        </div>
      )}

      {/* Main Content Layout */}
      {isLoadingAppointments ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div className="admin-spinner" style={{ margin: "0 auto" }}></div>
          <p style={{ marginTop: "16px", color: "#616161", fontSize: "14px" }}>Synchronizing schedule records...</p>
        </div>
      ) : appointmentsError ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#EF4444" }}>
          <p style={{ fontSize: "14.5px", fontWeight: "600" }}>{appointmentsError}</p>
          <button
            onClick={fetchAppointments}
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
      ) : appointmentViewMode === "calendar" ? (
        <div style={{ animation: "scaleIn 0.3s ease" }}>
          {/* Calendar view logic */}
          {(() => {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth(); // 0-indexed

            const monthNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December",
            ];

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDayIndex = new Date(year, month, 1).getDay();

            const gridCells = [];

            for (let i = 0; i < firstDayIndex; i++) {
              gridCells.push(<div key={`empty-${i}`} style={{ backgroundColor: "rgba(241, 245, 249, 0.3)", borderRadius: "8px", border: "1px solid rgba(226, 232, 240, 0.5)" }} />);
            }

            for (let day = 1; day <= daysInMonth; day++) {
              const cellDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

              // Find appointments on this cell date
              const dayBookings = appointments.filter((app: any) => {
                const appDate = new Date(app.appointmenttime);
                return appDate.getDate() === day && appDate.getMonth() === month && appDate.getFullYear() === year;
              });

              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

              gridCells.push(
                <div
                  key={day}
                  onClick={() => {
                    setAppointmentDateFilter("custom");
                    setAppointmentCustomDate(cellDateStr);
                    setAppointmentViewMode("table");
                  }}
                  style={{
                    padding: "12px 10px",
                    borderRadius: "10px",
                    backgroundColor: isToday ? "rgba(63, 89, 255, 0.04)" : "#FFFFFF",
                    border: isToday ? "1.5px solid #3F59FF" : "1px solid #E2E8F0",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    minHeight: "85px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(63, 89, 255, 0.08)")}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <span style={{ fontSize: "14px", fontWeight: "700", color: isToday ? "#3F59FF" : "#0F172A" }}>{day}</span>
                  {dayBookings.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                      <span style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(63, 89, 255, 0.08)",
                        color: "#3F59FF",
                        fontWeight: "800",
                        display: "inline-block",
                        textAlign: "center",
                      }}>
                        {dayBookings.length} {dayBookings.length === 1 ? "Book" : "Books"}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>{monthNames[month]} {year}</h4>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Click on any date cell to filter details in table view</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "8px", textAlign: "center", fontWeight: "700", fontSize: "12px", color: "#64748B" }}>
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                  {gridCells}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          {filteredAppointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#616161" }}>
              <Calendar size={40} color="#3F59FF" style={{ marginBottom: "12px" }} />
              <p style={{ fontWeight: "600", color: "#060F2D" }}>No appointments matched your query filter.</p>
              <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Reset filter dropdown selectors to list all details.</span>
            </div>
          ) : (
            <>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F2F3FE", color: "#616161", fontSize: "13px", fontWeight: "700" }}>
                    <th style={{ padding: "16px 12px" }}>Patient Profile</th>
                    <th style={{ padding: "16px 12px" }}>Assigned Specialist</th>
                    <th style={{ padding: "16px 12px" }}>Slot Timestamp</th>
                    <th style={{ padding: "16px 12px" }}>Consult Status</th>
                    <th style={{ padding: "16px 12px" }}>Payment Status</th>
                    <th style={{ padding: "16px 12px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((app) => {
                    const formattedDate = app.appointmenttime
                      ? new Date(app.appointmenttime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "--";

                    const getStatusStyles = (status: string) => {
                      const normalized = (status || "").toLowerCase().trim();
                      switch (normalized) {
                        case "paid":
                        case "approved":
                          return { color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" };
                        case "failed":
                        case "missed":
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

                    const statusStyle = getStatusStyles(app.status);
                    const paymentStyle = getStatusStyles(app.paymentStatus || "pending");
                    const isOverdue = app.status === "approved" && app.appointmenttime && (new Date(app.appointmenttime).getTime() + 30 * 60 * 1000 < Date.now());

                    return (
                      <tr
                        key={app._id}
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
                          <div>
                            {app.assignedDoctor
                              ? `${app.assignedDoctor.name} (${app.speciality})`
                              : `Not Assigned (${app.speciality})`
                            }
                          </div>

                          {/* Meet link join button */}
                          {app.meetingLink && app.status !== "completed" && (
                            <a
                              href={app.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#3F59FF",
                                textDecoration: "none",
                                marginTop: "6px",
                                fontSize: "12px",
                                fontWeight: "700",
                                backgroundColor: "rgba(63, 89, 255, 0.08)",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                transition: "all 0.2s",
                              }}
                            >
                              🎥 Join Meeting
                            </a>
                          )}
                        </td>

                        {/* Slot Time */}
                        <td style={{ padding: "18px 12px", color: "#616161" }}>{formattedDate}</td>

                        {/* Status label */}
                        <td style={{ padding: "18px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                fontSize: "12px",
                                fontWeight: "700",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                textTransform: "capitalize",
                              }}
                            >
                              <span style={{
                                width: "6px",
                                height: "6px",
                                backgroundColor: statusStyle.color,
                                borderRadius: "50%",
                                boxShadow: `0 0 6px ${statusStyle.color}`,
                              }}></span>
                              {app.status}
                            </span>
                            {isOverdue && (
                              <span style={{
                                padding: "4px 8px",
                                backgroundColor: "rgba(239, 68, 68, 0.12)",
                                color: "#EF4444",
                                fontSize: "10px",
                                fontWeight: "800",
                                borderRadius: "6px",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                whiteSpace: "nowrap"
                              }}>
                                ⚠️ OVERDUE
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Payment status label */}
                        <td style={{ padding: "18px 12px" }}>
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: "20px",
                              backgroundColor: paymentStyle.bg,
                              color: paymentStyle.color,
                              fontSize: "12px",
                              fontWeight: "700",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              textTransform: "capitalize",
                            }}
                          >
                            <span style={{
                              width: "6px",
                              height: "6px",
                              backgroundColor: paymentStyle.color,
                              borderRadius: "50%",
                              boxShadow: `0 0 6px ${paymentStyle.color}`,
                            }}></span>
                            {app.paymentStatus || "pending"}
                          </span>
                        </td>

                        {/* Manage Action */}
                        <td style={{ padding: "18px 12px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button
                              onClick={() => {
                                setSelectedAppointment(app);
                                setManageStatus(app.status || "pending");
                                setManageDoctor(app.assignedDoctor?._id || "");
                                setManagePrescription(app.prescription || "");
                                setManagePaymentStatus(app.paymentStatus || "pending");
                                setIsManageModalOpen(true);
                              }}
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
                            {app.status === "completed" && app.prescription && (
                              <button
                                onClick={() => setPrintPrescriptionAppointment(app)}
                                style={{
                                  padding: "6px 12px",
                                  backgroundColor: "#3F59FF",
                                  border: "none",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#FFFFFF",
                                  cursor: "pointer",
                                }}
                              >
                                Rx Slip
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalAppointmentPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1.5px solid #F2F3FE",
                    paddingTop: "24px",
                    marginTop: "16px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#616161" }}>
                    Showing page <strong>{activeAppPageBounded}</strong> of {totalAppointmentPages} ({filteredAppointments.length} appointments total)
                  </span>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      disabled={activeAppPageBounded === 1}
                      onClick={() => setAppointmentCurrentPage(activeAppPageBounded - 1)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                        backgroundColor: activeAppPageBounded === 1 ? "#F9FAFB" : "#FFFFFF",
                        color: activeAppPageBounded === 1 ? "#cbd5e1" : "#060F2D",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: activeAppPageBounded === 1 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    {Array.from({ length: totalAppointmentPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setAppointmentCurrentPage(p)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: p === activeAppPageBounded ? "none" : "1.5px solid #e2e8f0",
                          backgroundColor: p === activeAppPageBounded ? "#3F59FF" : "#FFFFFF",
                          color: p === activeAppPageBounded ? "#FFFFFF" : "#060F2D",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      disabled={activeAppPageBounded === totalAppointmentPages}
                      onClick={() => setAppointmentCurrentPage(activeAppPageBounded + 1)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1.5px solid #e2e8f0",
                        backgroundColor: activeAppPageBounded === totalAppointmentPages ? "#F9FAFB" : "#FFFFFF",
                        color: activeAppPageBounded === totalAppointmentPages ? "#cbd5e1" : "#060F2D",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: activeAppPageBounded === totalAppointmentPages ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        outline: "none",
                        transition: "all 0.2s",
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
      )}

      {/* ───────────────── MANAGE APPOINTMENT MODAL ───────────────── */}
      {isManageModalOpen && selectedAppointment && (
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
            animation: "fadeIn 0.25s ease forwards",
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
              animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <button
              onClick={() => {
                setIsManageModalOpen(false);
                setSelectedAppointment(null);
              }}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#94a3b8",
                padding: "4px",
              }}
            >
              <X size={24} />
            </button>

            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontSize: "21px", fontWeight: "800", color: "#060F2D" }}>
                Update Scheduling Status
              </h3>
              <span style={{ fontSize: "14px", color: "#616161", marginTop: "4px", display: "block" }}>
                Modify check-up records, assign doctors, and write prescriptions.
              </span>
            </div>

            <form onSubmit={handleManageSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Status Option */}
              <div>
                <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                  Consultation Status
                </label>
                <select
                  value={manageStatus}
                  onChange={(e) => setManageStatus(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "15px",
                    backgroundColor: "#fff",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved / Active</option>
                  <option value="cancelled">Cancelled / Revoked</option>
                  <option value="completed">Completed Consult</option>
                  <option value="missed">Missed / No Show</option>
                </select>
              </div>

              {/* Doctor Assign Option */}
              <div>
                <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                  Assign Specialist {(manageStatus === "approved" || manageStatus === "completed") && <span style={{ color: "#EF4444" }}>*</span>}
                </label>
                <select
                  value={manageDoctor}
                  onChange={(e) => setManageDoctor(e.target.value)}
                  required={manageStatus === "approved" || manageStatus === "completed"}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "15px",
                    backgroundColor: "#fff",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">-- Choose Roster Doctor --</option>
                  {doctors
                    .filter((d) => d.speciality === selectedAppointment.speciality)
                    .map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Prescription / Notes Textarea */}
              {manageStatus === "completed" && (
                <div>
                  <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                    Prescription / Consultation Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Type advice dosage, diagnostic findings, or session notes here..."
                    value={managePrescription}
                    onChange={(e) => setManagePrescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "15px",
                      outline: "none",
                      resize: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              )}

              {/* Payment Status (Read-Only) */}
              <div>
                <label style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
                  Gateway Payment Status
                </label>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "15px",
                    backgroundColor: "#f8fafc",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: managePaymentStatus === "paid" ? "#10B981" : managePaymentStatus === "failed" ? "#EF4444" : "#F59E0B"
                    }}
                  />
                  <span style={{ color: managePaymentStatus === "paid" ? "#10B981" : managePaymentStatus === "failed" ? "#EF4444" : "#F59E0B" }}>
                    {managePaymentStatus === "paid" ? "Paid & Settled" : managePaymentStatus === "failed" ? "Failed / Cancelled" : "Pending Gateway Capture"}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingAppointment || ((manageStatus === "approved" || manageStatus === "completed") && !manageDoctor)}
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#3F59FF",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: (isSavingAppointment || ((manageStatus === "approved" || manageStatus === "completed") && !manageDoctor)) ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  boxShadow: "0 8px 20px rgba(63, 89, 255, 0.2)",
                  transition: "all 0.2s",
                  opacity: (isSavingAppointment || ((manageStatus === "approved" || manageStatus === "completed") && !manageDoctor)) ? 0.6 : 1,
                }}
              >
                {isSavingAppointment ? "Saving Changes..." : "Save Appointment Updates"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Prescription Modal */}
      {printPrescriptionAppointment && (() => {
        const patientDetails = patients.find(p => p.email === printPrescriptionAppointment.pasentmail) || {
          age: "N/A",
          gender: "N/A",
          bloodGroup: "N/A"
        };
        return (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(6, 15, 45, 0.5)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              zIndex: 99999,
              backdropFilter: "blur(4px)",
              overflowY: "auto",
              padding: "40px 16px"
            }}
            onClick={() => setPrintPrescriptionAppointment(null)}
          >
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                .printable-prescription-slip, .printable-prescription-slip * {
                  visibility: visible !important;
                }
                .printable-prescription-slip {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
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
            
            <div
              className="printable-prescription-slip"
              style={{
                width: "100%",
                maxWidth: "650px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  background: "#060F2D",
                  padding: "24px 32px",
                  color: "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", fontFamily: "'Outfit', sans-serif" }}>SRI SAI HOSPITAL</h3>
                  <span style={{ fontSize: "11px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Clinical Consultation Slip</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }} className="print-btn-no-print">
                  <button
                    onClick={() => window.print()}
                    style={{
                      background: "#3F59FF",
                      border: "none",
                      color: "#FFFFFF",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Print PDF
                  </button>
                  <button
                    onClick={() => setPrintPrescriptionAppointment(null)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "#FFFFFF",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "32px" }}>
                {/* Meta details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", borderBottom: "1px dashed #E2E8F0", paddingBottom: "20px", marginBottom: "24px" }}>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#72849B", fontWeight: "700", letterSpacing: "0.5px" }}>Patient Details</span>
                    <h4 style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "700", color: "#060F2D" }}>{printPrescriptionAppointment.pasentname}</h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13.5px", color: "#72849B" }}>Phone: {printPrescriptionAppointment.pasentnumber}</p>
                    <div style={{ display: "flex", gap: "12px", marginTop: "6px", fontSize: "13px", color: "#72849B" }}>
                      <span>Age: <strong>{patientDetails.age || "N/A"}</strong></span>
                      <span>Gender: <strong>{patientDetails.gender || "N/A"}</strong></span>
                      <span>Blood: <strong>{patientDetails.bloodGroup || "N/A"}</strong></span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#72849B", fontWeight: "700", letterSpacing: "0.5px" }}>Consultant Doctor</span>
                    <h4 style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "700", color: "#060F2D" }}>{printPrescriptionAppointment.assignedDoctor ? printPrescriptionAppointment.assignedDoctor.name : "Specialist Doctor"}</h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13.5px", color: "#72849B" }}>{printPrescriptionAppointment.speciality}</p>
                  </div>
                </div>

                {/* Prescription Text */}
                <div style={{ marginBottom: "28px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#3F59FF", fontWeight: "700", letterSpacing: "1px" }}>Rx Prescriptions / Notes</span>
                  <div style={{
                    marginTop: "8px",
                    padding: "20px",
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: "14.5px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-line",
                    color: "#060F2D",
                    minHeight: "150px",
                    textAlign: "left"
                  }}>
                    {printPrescriptionAppointment.prescription}
                  </div>
                </div>

                {/* Footer details */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#72849B", borderTop: "1px solid #F1F5F9", paddingTop: "20px" }}>
                  <span>Date: {new Date(printPrescriptionAppointment.appointmenttime).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                  <span style={{ color: "#3F59FF", fontWeight: "700" }}>Sri Sai Hospital Telehealth Verified</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AppointmentsTab;
