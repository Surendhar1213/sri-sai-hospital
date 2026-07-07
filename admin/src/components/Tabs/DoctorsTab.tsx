import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Search,
  Stethoscope,
} from "lucide-react";

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  email: string;
  phone?: string;
  experience: number;
  timing: string;
  isAvailable: boolean;
  blockedDates?: string[];
}

interface DoctorsTabProps {
  doctors: Doctor[];
  isLoadingDoctors: boolean;
  doctorsError: string;
  fetchDoctors: () => void;
  triggerToast: (msg: string) => void;

  // Add Doctor Props
  isAddDoctorModalOpen: boolean;
  setIsAddDoctorModalOpen: (open: boolean) => void;
  doctorForm: any;
  setDoctorForm: any;
  handleAddDoctorSubmit: (e: React.FormEvent) => void;

  // Edit Doctor Props
  isEditDoctorModalOpen: boolean;
  setIsEditDoctorModalOpen: (open: boolean) => void;
  editingDoctor: Doctor | null;
  setEditingDoctor: (doc: Doctor | null) => void;
  editDoctorForm: any;
  setEditDoctorForm: any;
  handleEditDoctorSubmit: (e: React.FormEvent) => void;

  // Delete & Availability Props
  handleToggleAvailability: (docId: string, currentAvailable: boolean) => void;
  handleDeleteDoctorClick: (docId: string) => void;

  // Block Slots Props
  isBlockingModalOpen: boolean;
  setIsBlockingModalOpen: (open: boolean) => void;
  selectedDoctorForBlocking: Doctor | null;
  setSelectedDoctorForBlocking: (doc: Doctor | null) => void;
  blockDateInput: string;
  setBlockDateInput: (val: string) => void;
  handleBlockDateSubmit: (e: React.FormEvent) => void;
  handleUnblockDate: (dateStr: string) => void;

  // Constants
  SPECIALITIES: string[];
  TIMINGS: string[];
}

const DoctorsTab: React.FC<DoctorsTabProps> = ({
  doctors,
  isLoadingDoctors,
  doctorsError,
  fetchDoctors,
  triggerToast,

  isAddDoctorModalOpen,
  setIsAddDoctorModalOpen,
  doctorForm,
  setDoctorForm,
  handleAddDoctorSubmit,

  isEditDoctorModalOpen,
  setIsEditDoctorModalOpen,
  editingDoctor,
  setEditingDoctor,
  editDoctorForm,
  setEditDoctorForm,
  handleEditDoctorSubmit,

  handleToggleAvailability,
  handleDeleteDoctorClick,

  isBlockingModalOpen,
  setIsBlockingModalOpen,
  selectedDoctorForBlocking,
  setSelectedDoctorForBlocking,
  blockDateInput,
  setBlockDateInput,
  handleBlockDateSubmit,
  handleUnblockDate,

  SPECIALITIES,
  TIMINGS,
}) => {
  // Local search/filter/pagination states
  const [doctorSearchText, setDoctorSearchText] = useState("");
  const [doctorSpecialityFilter, setDoctorSpecialityFilter] = useState("All");
  const [doctorStatusFilter, setDoctorStatusFilter] = useState("All");
  const [doctorCurrentPage, setDoctorCurrentPage] = useState(1);
  const doctorsPerPage = 6;

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

      {/* Main Content (Doctors List or Loading/Error States) */}
      <div style={{ flexGrow: 1 }}>
        {isLoadingDoctors ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="admin-spinner" style={{ margin: "0 auto 16px" }}></div>
            <p style={{ color: "#64748B", fontSize: "14px" }}>Synchronizing doctor records...</p>
          </div>
        ) : doctorsError ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#EF4444" }}>
            <p style={{ fontSize: "15px", fontWeight: "600" }}>{doctorsError}</p>
            <button
              onClick={fetchDoctors}
              style={{
                marginTop: "16px",
                padding: "10px 24px",
                backgroundColor: "#3F59FF",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Retry Sync
            </button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1.5px dashed #cbd5e1"
            }}
          >
            <Stethoscope size={40} color="#3F59FF" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>No matches found</h3>
            <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
              Try adjusting your filters or search query to find matching doctor profiles.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px"
              }}
            >
              {currentDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="doctor-card"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1.5px solid #E2E8F0",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative"
                  }}
                >
                  <div>
                    {/* Header: Name and Availability Toggle */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "16.5px", fontWeight: "700", color: "#0F172A" }}>{doc.name}</h3>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: "#3F59FF",
                            backgroundColor: "rgba(63, 89, 255, 0.08)",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            display: "inline-block",
                            marginTop: "4px",
                            textTransform: "uppercase"
                          }}
                        >
                          {doc.speciality}
                        </span>
                      </div>

                      {/* Switch Toggle availability */}
                      <label style={{ position: "relative", display: "inline-block", width: "42px", height: "22px" }}>
                        <input
                          type="checkbox"
                          checked={doc.isAvailable}
                          onChange={() => handleToggleAvailability(doc._id, doc.isAvailable)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: doc.isAvailable ? "#10B981" : "#cbd5e1",
                            borderRadius: "34px",
                            cursor: "pointer",
                            transition: "0.2s"
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              height: "14px",
                              width: "14px",
                              left: doc.isAvailable ? "24px" : "4px",
                              bottom: "4px",
                              backgroundColor: "#FFFFFF",
                              borderRadius: "50%",
                              transition: "0.2s"
                            }}
                          ></span>
                        </span>
                      </label>
                    </div>

                    {/* Middle details */}
                    <div style={{ borderTop: "1.5px solid #F1F5F9", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#475569" }}>
                      <div>
                        <strong>Email:</strong> <span style={{ color: "#334155" }}>{doc.email}</span>
                      </div>
                      <div>
                        <strong>Experience:</strong> <span style={{ color: "#334155" }}>{doc.experience} Years</span>
                      </div>
                      <div>
                        <strong>Timings:</strong> <span style={{ color: "#3F59FF", fontWeight: "600" }}>{doc.timing}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div
                    style={{
                      borderTop: "1.5px solid #F1F5F9",
                      marginTop: "18px",
                      paddingTop: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    {/* Block Slots Button */}
                    <button
                      onClick={() => {
                        setSelectedDoctorForBlocking(doc);
                        setBlockDateInput("");
                        setIsBlockingModalOpen(true);
                      }}
                      className="action-btn"
                      style={{
                        backgroundColor: "#3F59FF",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "11.5px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 3px 8px rgba(63, 89, 255, 0.15)"
                      }}
                    >
                      <Calendar size={13} />
                      <span>Block Slots</span>
                    </button>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => {
                          setEditingDoctor(doc);
                          setEditDoctorForm({
                            name: doc.name,
                            speciality: doc.speciality,
                            email: doc.email,
                            experience: doc.experience.toString(),
                            timing: doc.timing,
                          });
                          setIsEditDoctorModalOpen(true);
                        }}
                        className="action-btn"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: "#F1F5F9",
                          color: "#475569",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteDoctorClick(doc._id)}
                        className="action-btn"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(239, 68, 68, 0.08)",
                          color: "#EF4444",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
                Modify Doctor Profile
              </h3>
              <span style={{ fontSize: "14px", color: "#616161", marginTop: "4px", display: "block" }}>
                Update directory records and specialists settings.
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
                  }}
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
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────── DOCTOR SLOT BLOCKING MODAL ───────────────── */}
      {isBlockingModalOpen && selectedDoctorForBlocking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(6, 15, 45, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.25s ease"
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "36px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 50px rgba(6, 15, 45, 0.15)",
              border: "1px solid rgba(6, 15, 45, 0.05)",
              position: "relative",
              animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          >
            <button
              onClick={() => {
                setIsBlockingModalOpen(false);
                setSelectedDoctorForBlocking(null);
              }}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94A3B8"
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#060F2D", marginBottom: "8px" }}>
              Block Slots / Leave Manager
            </h3>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>
              Manage off-days and block slots for <strong>{selectedDoctorForBlocking.name}</strong> ({selectedDoctorForBlocking.speciality}).
            </p>

            {/* Block new date form */}
            <form onSubmit={handleBlockDateSubmit} style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              <input
                type="date"
                required
                value={blockDateInput}
                onChange={(e) => setBlockDateInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#3F59FF",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "13.5px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(63, 89, 255, 0.2)"
                }}
              >
                Block Date
              </button>
            </form>

            {/* Currently blocked dates list */}
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "12px" }}>
              Currently Blocked Dates
            </h4>
            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {(!selectedDoctorForBlocking.blockedDates || selectedDoctorForBlocking.blockedDates.length === 0) ? (
                <span style={{ fontSize: "13px", color: "#94A3B8", fontStyle: "italic" }}>No dates blocked yet. All slots are active.</span>
              ) : (
                selectedDoctorForBlocking.blockedDates.map((dateStr: string) => (
                  <div
                    key={dateStr}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 16px",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0"
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                      {new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => handleUnblockDate(dateStr)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#EF4444",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsTab;
