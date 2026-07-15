import React, { useState, useEffect } from "react";
import { Users, Download, X, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  createdAt: string;
}

interface PatientsTabProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isLoadingPatients: boolean;
  patientsError: string;
  filteredPatients: Patient[];
  fetchPatients: () => void;
}

const PatientsTab: React.FC<PatientsTabProps> = ({
  searchTerm,
  setSearchTerm,
  isLoadingPatients,
  patientsError,
  filteredPatients,
  fetchPatients,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const itemsPerPage = 7;

  // Reset to first page when filtering results
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

  const exportToCSV = () => {
    if (filteredPatients.length === 0) return;
    
    const headers = ["Patient ID", "Name", "Email", "Mobile Number", "Age", "Gender", "Blood Group", "Registration Date"];
    const rows = filteredPatients.map(patient => [
      patient._id,
      patient.name,
      patient.email,
      patient.phone,
      patient.age || "--",
      patient.gender || "--",
      patient.bloodGroup || "--",
      patient.createdAt ? new Date(patient.createdAt).toLocaleDateString("en-US") : "--"
    ]);
    
    // Add BOM for proper UTF-8 handling in Excel
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Patients_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
        border: "1px solid rgba(6, 15, 45, 0.04)",
        padding: "32px",
        position: "relative",
      }}
    >
      {/* Patients Search and Header */}
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
            Patients Registry Log
          </h3>
          <span style={{ fontSize: "12px", color: "#616161", display: "block", marginTop: "2px" }}>
            Live registry records containing active user metadata accounts.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* CSV Export Button */}
          <button
            onClick={exportToCSV}
            disabled={filteredPatients.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 18px",
              borderRadius: "10px",
              border: "1.5px solid #E2E8F0",
              backgroundColor: filteredPatients.length === 0 ? "#F8FAFC" : "#FFFFFF",
              color: filteredPatients.length === 0 ? "#94A3B8" : "#060F2D",
              fontSize: "13px",
              fontWeight: "700",
              cursor: filteredPatients.length === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          >
            <Download size={15} />
            Export CSV
          </button>

          {/* Search Box */}
          <div style={{ position: "relative", width: "280px" }}>
            <input
              type="text"
              placeholder="Search patient registries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 40px 11px 16px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "13.5px",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={16} />
              </button>
            ) : (
              <span
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                  pointerEvents: "none",
                  fontSize: "14px",
                }}
              >
                🔍
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Patients Table */}
      {isLoadingPatients ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div className="admin-spinner" style={{ margin: "0 auto" }}></div>
          <p style={{ marginTop: "16px", color: "#616161", fontSize: "14px" }}>Retrieving registered data...</p>
        </div>
      ) : patientsError ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#EF4444" }}>
          <p style={{ fontSize: "14.5px", fontWeight: "600" }}>{patientsError}</p>
          <button
            onClick={fetchPatients}
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
      ) : filteredPatients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#616161" }}>
          <Users size={40} color="#3F59FF" style={{ marginBottom: "12px" }} />
          <p style={{ fontWeight: "600", color: "#060F2D" }}>No registered patient accounts found.</p>
          <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Sign-ups from client applications will map here.</span>
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F2F3FE", color: "#616161", fontSize: "13px", fontWeight: "700" }}>
                  <th style={{ padding: "16px 12px" }}>Patient Profile</th>
                  <th style={{ padding: "16px 12px" }}>Email ID</th>
                  <th style={{ padding: "16px 12px" }}>Mobile Number</th>
                  <th style={{ padding: "16px 12px" }}>Age / Gender</th>
                  <th style={{ padding: "16px 12px" }}>Blood Group</th>
                  <th style={{ padding: "16px 12px" }}>Registration Timestamp</th>
                  <th style={{ padding: "16px 12px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((patient) => {
                  const formattedDate = patient.createdAt
                    ? new Date(patient.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "--";

                  return (
                    <tr
                      key={patient._id}
                      style={{
                        borderBottom: "1px solid #F2F3FE",
                        fontSize: "14px",
                        color: "#060F2D",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onClick={() => setSelectedPatient(patient)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#F8FAFC";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
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
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{patient.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "18px 12px" }}>{patient.email}</td>
                      <td style={{ padding: "18px 12px" }}>{patient.phone}</td>
                      <td style={{ padding: "18px 12px" }}>
                        {patient.age ? `${patient.age} Yrs` : "--"} / <span style={{ textTransform: "capitalize" }}>{patient.gender || "--"}</span>
                      </td>
                      <td style={{ padding: "18px 12px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(239, 68, 68, 0.08)",
                            color: "#EF4444",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", backgroundColor: "#EF4444", borderRadius: "50%" }}></span>
                          {patient.bloodGroup || "Unknown"}
                        </span>
                      </td>
                      <td style={{ padding: "18px 12px", color: "#616161" }}>{formattedDate}</td>
                      <td style={{ padding: "18px 12px", textAlign: "center" }}>
                        <button
                          style={{
                            border: "none",
                            background: "rgba(63, 89, 255, 0.05)",
                            color: "#3F59FF",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                          }}
                        >
                          <Eye size={13} />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Premium Pagination Bar */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "24px",
                borderTop: "1.5px solid #F1F5F9",
                paddingTop: "20px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>
                Showing <strong style={{ color: "#0F172A" }}>{indexOfFirstItem + 1}</strong> to{" "}
                <strong style={{ color: "#0F172A" }}>
                  {Math.min(indexOfLastItem, filteredPatients.length)}
                </strong>{" "}
                of <strong style={{ color: "#0F172A" }}>{filteredPatients.length}</strong> patients
              </span>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1.5px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    color: currentPage === 1 ? "#cbd5e1" : "#64748B",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

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
                        borderRadius: "8px",
                        border: isActive ? "1.5px solid #3F59FF" : "1.5px solid #E2E8F0",
                        backgroundColor: isActive ? "#3F59FF" : "#FFFFFF",
                        color: isActive ? "#FFFFFF" : "#0F172A",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "1.5px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    color: currentPage === totalPages ? "#cbd5e1" : "#64748B",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Patient Detailed Profile Modal View */}
      {selectedPatient && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px",
          }}
          onClick={() => setSelectedPatient(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              width: "100%",
              maxWidth: "500px",
              overflow: "hidden",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #060F2D 0%, #1E293B 100%)",
                padding: "32px",
                color: "#FFFFFF",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setSelectedPatient(null)}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
              >
                <X size={16} />
              </button>

              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  fontSize: "28px",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {selectedPatient.name.charAt(0).toUpperCase()}
              </div>

              <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>{selectedPatient.name}</h4>
              <span style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>
                Patient ID: {selectedPatient._id}
              </span>
            </div>

            {/* Modal Info Content */}
            <div style={{ padding: "32px" }}>
              <h5 style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "800" }}>
                Registry Information
              </h5>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Email Address */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #F1F5F9", paddingBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "600" }}>Email ID</span>
                  <span style={{ fontSize: "14.5px", color: "#0F172A", fontWeight: "700" }}>{selectedPatient.email}</span>
                </div>

                {/* Mobile Phone */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #F1F5F9", paddingBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "600" }}>Mobile Number</span>
                  <span style={{ fontSize: "14.5px", color: "#0F172A", fontWeight: "700" }}>{selectedPatient.phone}</span>
                </div>

                {/* Age & Gender Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #F1F5F9", paddingBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "600" }}>Age / Gender</span>
                  <span style={{ fontSize: "14.5px", color: "#0F172A", fontWeight: "700" }}>
                    {selectedPatient.age ? `${selectedPatient.age} Years` : "--"} / <span style={{ textTransform: "capitalize" }}>{selectedPatient.gender || "--"}</span>
                  </span>
                </div>

                {/* Blood Group Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #F1F5F9", paddingBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "600" }}>Blood Group</span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(239, 68, 68, 0.08)",
                      color: "#EF4444",
                      fontSize: "12.5px",
                      fontWeight: "800",
                    }}
                  >
                    {selectedPatient.bloodGroup || "Unknown"}
                  </span>
                </div>

                {/* Registered Timestamp */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "600" }}>Registered On</span>
                  <span style={{ fontSize: "14.5px", color: "#0F172A", fontWeight: "700" }}>
                    {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }) : "--"}
                  </span>
                </div>
              </div>

              {/* Close Button Action */}
              <button
                onClick={() => setSelectedPatient(null)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  backgroundColor: "#3F59FF",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "32px",
                  transition: "background 0.2s ease",
                  boxShadow: "0 4px 12px rgba(63, 89, 255, 0.15)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2B44E3")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3F59FF")}
              >
                Close Profile Registry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsTab;
