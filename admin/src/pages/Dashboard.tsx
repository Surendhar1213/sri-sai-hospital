import React, { useState } from "react";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <h2 className="dashboard-header-title">Hospital Overview</h2>
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
          {/* Welcome Banner */}
          <section className="welcome-hero">
            <div className="welcome-hero-blob"></div>
            <div className="welcome-hero-content">
              <span className="welcome-hero-tag">Active Portal</span>
              <h1 className="welcome-hero-title">Welcome to Sri Sai Hospital Panel</h1>
              <p className="welcome-hero-desc">
                An unified control room to configure and monitor hospital resources. Review specialists availability, active patient occupancy, and optimize department settings quickly.
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
              <span className="stat-label">Admitted Patients</span>
              <span className="stat-number">1,420</span>
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
                <div className="action-button-card">
                  <span className="action-card-icon">➕</span>
                  <span className="action-card-title">Add Specialist</span>
                  <span className="action-card-desc">Create new profile</span>
                </div>
                <div className="action-button-card">
                  <span className="action-card-icon">👤</span>
                  <span className="action-card-title">Admit Patient</span>
                  <span className="action-card-desc">Log new entry</span>
                </div>
                <div className="action-button-card">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
