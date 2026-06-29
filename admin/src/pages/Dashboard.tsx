import React, { useState, useEffect } from "react";

interface DashboardProps {
  onLogout: () => void;
}

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

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch patients whenever patients tab is active
  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    setPatientsError("");
    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/all`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch patients");
      }
      
      setPatients(data.users || []);
    } catch (err: any) {
      setPatientsError(err.message || "Could not load patients list. Please ensure backend server is running.");
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    if (activeTab === "patients") {
      fetchPatients();
    }
  }, [activeTab]);

  // Get dynamic header title based on active tab
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Hospital Overview";
      case "doctors":
        return "Doctors Directory";
      case "patients":
        return "Patients Registry";
      case "settings":
        return "Admin Settings";
      default:
        return "Hospital Overview";
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const query = searchTerm.toLowerCase();
    return (
      (patient.name && patient.name.toLowerCase().includes(query)) ||
      (patient.email && patient.email.toLowerCase().includes(query)) ||
      (patient.phone && patient.phone.includes(query))
    );
  });

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="sidebar-brand-name">Sri Sai Admin</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <div 
              className={`sidebar-item-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              <span>Dashboard</span>
            </div>
          </li>
          <li>
            <div 
              className={`sidebar-item-link ${activeTab === "doctors" ? "active" : ""}`}
              onClick={() => setActiveTab("doctors")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Doctors Info</span>
            </div>
          </li>
          <li>
            <div 
              className={`sidebar-item-link ${activeTab === "patients" ? "active" : ""}`}
              onClick={() => setActiveTab("patients")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span>Patients Info</span>
            </div>
          </li>
          <li>
            <div 
              className={`sidebar-item-link ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.5 1z" />
              </svg>
              <span>Settings</span>
            </div>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">SA</div>
            <div className="sidebar-user-info">
              <span className="sidebar-username">Admin User</span>
              <span className="sidebar-user-role">Super Admin</span>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2 className="dashboard-header-title">{getHeaderTitle()}</h2>
          <div className="dashboard-header-right">
            <button className="notification-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="dashboard-container">
          
          {/* ───────────────── TAB 1: OVERVIEW ───────────────── */}
          {activeTab === "dashboard" && (
            <>
              {/* Welcome Banner */}
              <section className="welcome-hero">
                <div className="welcome-hero-blob"></div>
                <div className="welcome-hero-content">
                  <span className="welcome-hero-tag">Active Portal</span>
                  <h1 className="welcome-hero-title">Welcome to Sri Sai Hospital Panel</h1>
                  <p className="welcome-hero-desc">
                    A unified control room to configure and monitor hospital resources. Review specialists availability, active patient occupancy, and optimize department settings quickly.
                  </p>
                </div>
              </section>

              {/* Core Visual Metrics (Uncluttered) */}
              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-blue">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="stat-label">Active Doctors</span>
                  <span className="stat-number">28</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-cyan">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="stat-label">Registered Patients</span>
                  <span className="stat-number">{patients.length || "1,420"}</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-green">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span className="stat-label">ICU Beds Occupied</span>
                  <span className="stat-number">85%</span>
                </div>
              </section>

              {/* Quick Actions and Department Capacity */}
              <div className="dashboard-grid">
                <section className="panel-card">
                  <h3 className="panel-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    Core Admin Shortcuts
                  </h3>
                  <div className="actions-grid">
                    <div className="action-button-card" onClick={() => setActiveTab("doctors")}>
                      <span className="action-card-icon">➕</span>
                      <span className="action-card-title">Doctors Roster</span>
                      <span className="action-card-desc">View active list</span>
                    </div>
                    <div className="action-button-card" onClick={() => setActiveTab("patients")}>
                      <span className="action-card-icon">👤</span>
                      <span className="action-card-title">Patients Registry</span>
                      <span className="action-card-desc">Log new entry</span>
                    </div>
                    <div className="action-button-card" onClick={() => setActiveTab("settings")}>
                      <span className="action-card-icon">⚙️</span>
                      <span className="action-card-title">System Settings</span>
                      <span className="action-card-desc">Edit variables</span>
                    </div>
                  </div>
                </section>

                <section className="panel-card">
                  <h3 className="panel-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    Department Capacity
                  </h3>
                  <div className="analytics-chart-placeholder">
                    <div className="chart-bar-container">
                      <div className="chart-bar-label-wrapper">
                        <span>OPD Load</span>
                        <span>90%</span>
                      </div>
                      <div className="chart-bar-outer">
                        <div className="chart-bar-inner" style={{ width: "90%" }}></div>
                      </div>
                    </div>

                    <div className="chart-bar-container">
                      <div className="chart-bar-label-wrapper">
                        <span>General Wards</span>
                        <span>65%</span>
                      </div>
                      <div className="chart-bar-outer">
                        <div className="chart-bar-inner success" style={{ width: "65%" }}></div>
                      </div>
                    </div>

                    <div className="chart-bar-container">
                      <div className="chart-bar-label-wrapper">
                        <span>Emergency Wing</span>
                        <span>40%</span>
                      </div>
                      <div className="chart-bar-outer">
                        <div className="chart-bar-inner purple" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* ───────────────── TAB 2: DOCTORS INFO ───────────────── */}
          {activeTab === "doctors" && (
            <div className="panel-card animated-fade">
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "50px", marginBottom: "15px" }}>🩺</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--dark-navy)", marginBottom: "8px" }}>Doctors Roster</h3>
                <p style={{ color: "var(--slate-500)", maxWidth: "450px", margin: "0 auto 20px", fontSize: "14.5px" }}>
                  The doctors directory database integration is currently in progress. Soon you'll be able to manage specialists, verify schedules, and assign rosters.
                </p>
                <button className="btn-back-tab" onClick={() => setActiveTab("dashboard")} style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "var(--slate-100)",
                  color: "var(--slate-700)",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* ───────────────── TAB 3: PATIENTS INFO ───────────────── */}
          {activeTab === "patients" && (
            <div className="patients-container animated-fade">
              <div className="patients-header-section">
                <div>
                  <h3 className="patients-section-title">Patients Registry</h3>
                  <p className="patients-section-subtitle">
                    List of patients registered through the Sri Sai Hospital patient portal.
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="admin-search-wrapper">
                  <span className="admin-search-icon">🔍</span>
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search patients by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button className="clear-search-btn" onClick={() => setSearchTerm("")}>✕</button>
                  )}
                </div>
              </div>

              {/* Table Card */}
              <div className="panel-card" style={{ padding: "0px", overflow: "hidden", border: "1px solid var(--slate-200)" }}>
                {isLoadingPatients ? (
                  <div className="table-status-message">
                    <span className="admin-spinner"></span>
                    <p style={{ marginTop: "12px", color: "var(--slate-500)" }}>Fetching registered patients...</p>
                  </div>
                ) : patientsError ? (
                  <div className="table-status-message error">
                    <div style={{ fontSize: "36px" }}>⚠️</div>
                    <p style={{ margin: "10px 0 15px", fontWeight: "500" }}>{patientsError}</p>
                    <button className="retry-fetch-btn" onClick={fetchPatients}>
                      🔄 Retry Connection
                    </button>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="table-status-message">
                    <div style={{ fontSize: "40px" }}>👥</div>
                    <p style={{ margin: "10px 0", fontWeight: "600", color: "var(--dark-navy)" }}>
                      {patients.length === 0 ? "No patients registered yet" : "No matching patients found"}
                    </p>
                    <p style={{ color: "var(--slate-400)", fontSize: "13.5px" }}>
                      {patients.length === 0 
                        ? "Registered patient accounts will appear here automatically." 
                        : "Try checking the spelling or query parameters."}
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Patient Name</th>
                          <th>Contact Details</th>
                          <th>Demographics</th>
                          <th>Blood Group</th>
                          <th>Registration Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient) => {
                          const patientInitial = patient.name ? patient.name.charAt(0).toUpperCase() : "?";
                          const formattedDate = patient.createdAt
                            ? new Date(patient.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A";

                          return (
                            <tr key={patient._id}>
                              <td>
                                <div className="patient-name-container">
                                  <div className="patient-avatar-circle">
                                    {patientInitial}
                                  </div>
                                  <div>
                                    <span className="patient-table-name">{patient.name || "Unnamed Patient"}</span>
                                    <span className="patient-table-role">Role: Patient</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="patient-table-contact">
                                  <span className="contact-email">📧 {patient.email || "N/A"}</span>
                                  <span className="contact-phone">📞 {patient.phone || "N/A"}</span>
                                </div>
                              </td>
                              <td>
                                <div className="patient-demographic">
                                  <span className="demographic-age">{patient.age ? `${patient.age} Yrs` : "N/A"}</span>
                                  <span className={`gender-badge ${patient.gender ? patient.gender.toLowerCase() : ""}`}>
                                    {patient.gender || "Unknown"}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className={`blood-badge ${patient.bloodGroup ? patient.bloodGroup.replace("+", "-pos").replace("-", "-neg").toLowerCase() : "unknown"}`}>
                                  🩸 {patient.bloodGroup || "Unknown"}
                                </span>
                              </td>
                              <td>
                                <span className="reg-date-cell">{formattedDate}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ───────────────── TAB 4: SETTINGS ───────────────── */}
          {activeTab === "settings" && (
            <div className="panel-card animated-fade">
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "50px", marginBottom: "15px" }}>⚙️</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--dark-navy)", marginBottom: "8px" }}>Admin Panel Settings</h3>
                <p style={{ color: "var(--slate-500)", maxWidth: "450px", margin: "0 auto 20px", fontSize: "14.5px" }}>
                  Configuration variables, doctor shifts, schedule updates and developer setup toggles can be managed here. Currently operating in default read-only mode.
                </p>
                <button className="btn-back-tab" onClick={() => setActiveTab("dashboard")} style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "var(--slate-100)",
                  color: "var(--slate-700)",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
