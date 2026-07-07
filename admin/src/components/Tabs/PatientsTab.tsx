import React from "react";
import { Users } from "lucide-react";

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

        <div style={{ position: "relative", width: "300px" }}>
          <input
            type="text"
            placeholder="🔍 Search patient registries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1.5px solid #cbd5e1",
              fontSize: "13.5px",
              outline: "none",
            }}
          />
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
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F2F3FE", color: "#616161", fontSize: "13px", fontWeight: "700" }}>
                <th style={{ padding: "16px 12px" }}>Patient Profile</th>
                <th style={{ padding: "16px 12px" }}>Email ID</th>
                <th style={{ padding: "16px 12px" }}>Mobile Number</th>
                <th style={{ padding: "16px 12px" }}>Blood Group</th>
                <th style={{ padding: "16px 12px" }}>Registration Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => {
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

export default PatientsTab;
