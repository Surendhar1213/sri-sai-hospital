import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaCreditCard,
  FaFileAlt,
  FaHome,
  FaCheckCircle
} from "react-icons/fa";
import {
  OverviewTab,
  AppointmentsTab,
  PrescriptionsTab,
  PaymentsTab,
  ProfileSettingsTab
} from "./Profile/ProfileTabs";

interface Appointment {
  _id: string;
  status: string;
  speciality: string;
  appointmenttime: string;
  assignedDoctor?: { name: string };
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

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAge, setUserAge] = useState<number | string>("");
  const [userGender, setUserGender] = useState("");
  const [userBloodGroup, setUserBloodGroup] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userAlternatePhone, setUserAlternatePhone] = useState("");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAge, setEditAge] = useState<number | string>("");
  const [editGender, setEditGender] = useState("");
  const [editBloodGroup, setEditBloodGroup] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAlternatePhone, setEditAlternatePhone] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [selectedReceipt, setSelectedReceipt] = useState<Appointment | null>(null);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  useEffect(() => {
    // Check Auth
    const token = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("userInfo");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserId(user.id || user._id || "");
      setUserName(user.name || "User");
      setUserEmail(user.email || "");
      setUserPhone(user.phone || "");
      setUserAge(user.age || "");
      setUserGender(user.gender || "");
      setUserBloodGroup(user.bloodGroup || "");
      setUserAddress(user.address || "");
      setUserAlternatePhone(user.alternatePhone || "");

      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditAge(user.age || "");
      setEditGender(user.gender || "");
      setEditBloodGroup(user.bloodGroup || "");
      setEditAddress(user.address || "");
      setEditAlternatePhone(user.alternatePhone || "");
    }

    // Read URL query parameter for tab selection
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [navigate]);

  // Fetch latest profile details from server to keep sync
  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${backendUrl}/api/user/profile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.user) {
          setUserName(data.user.name || "User");
          setUserEmail(data.user.email || "");
          setUserPhone(data.user.phone || "");
          setUserAge(data.user.age || "");
          setUserGender(data.user.gender || "");
          setUserBloodGroup(data.user.bloodGroup || "");
          setUserAddress(data.user.address || "");
          setUserAlternatePhone(data.user.alternatePhone || "");

          setEditName(data.user.name || "");
          setEditPhone(data.user.phone || "");
          setEditAge(data.user.age || "");
          setEditGender(data.user.gender || "");
          setEditBloodGroup(data.user.bloodGroup || "");
          setEditAddress(data.user.address || "");
          setEditAlternatePhone(data.user.alternatePhone || "");

          // Update local cache
          localStorage.setItem("userInfo", JSON.stringify(data.user));
        } else if (response.status === 401) {
          handleLogout();
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Fetch appointments
  useEffect(() => {
    if (!userEmail) return;

    const fetchAppointments = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${backendUrl}/api/appointments?email=${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setAppointments(data || []);
        } else if (response.status === 401) {
          handleLogout();
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userEmail]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJoinMeeting = async (appointmentId: string) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/appointments/validate-meeting/${appointmentId}`);
      const data = await response.json();

      if (data.status === "active" && data.meetingLink) {
        setPopupType("success");
        setPopupMessage("Connecting to Google Meet consultation...");
        setTimeout(() => setPopupMessage(null), 2000);
        window.open(data.meetingLink, "_blank", "noopener,noreferrer");
      } else {
        setPopupType("error");
        setPopupMessage(data.message || "Failed to join meeting.");
        setTimeout(() => setPopupMessage(null), 4000);
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
      setPopupType("error");
      setPopupMessage("Unable to connect. Check your internet connection.");
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName || !editPhone || !editAge || !editGender) {
      setPopupType("error");
      setPopupMessage("Please fill all required fields");
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }
    setIsSaving(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("userToken");
      const response = await fetch(`${backendUrl}/api/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          age: Number(editAge),
          gender: editGender,
          bloodGroup: editBloodGroup,
          address: editAddress,
          alternatePhone: editAlternatePhone
        })
      });
      const data = await response.json();
      if (response.ok) {
        setUserName(data.user.name);
        setUserPhone(data.user.phone);
        setUserAge(data.user.age);
        setUserGender(data.user.gender);
        setUserBloodGroup(data.user.bloodGroup);
        setUserAddress(data.user.address || "");
        setUserAlternatePhone(data.user.alternatePhone || "");
        
        const userInfoObj = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const updatedUserInfo = {
          ...userInfoObj,
          name: data.user.name,
          phone: data.user.phone,
          age: data.user.age,
          gender: data.user.gender,
          bloodGroup: data.user.bloodGroup,
          address: data.user.address || "",
          alternatePhone: data.user.alternatePhone || ""
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setIsEditing(false);
        setPopupType("success");
        setPopupMessage("Profile updated successfully!");
        setTimeout(() => setPopupMessage(null), 3000);
      } else {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        setPopupType("error");
        setPopupMessage(data.message || "Failed to update profile");
        setTimeout(() => setPopupMessage(null), 3000);
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setPopupType("error");
      setPopupMessage("Failed to update profile due to a network error.");
      setTimeout(() => setPopupMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Find next upcoming appointment
  const upcomingAppointment = appointments
    .filter(app => app.status === "approved" && new Date(app.appointmenttime) > new Date())
    .sort((a, b) => new Date(a.appointmenttime).getTime() - new Date(b.appointmenttime).getTime())[0];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F4F7FC",
      fontFamily: "'Inter', sans-serif",
      color: "#4D5765",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1240px",
        margin: "0 auto"
      }}>
        {/* Top Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "36px",
          animation: "fadeInUp 0.4s ease"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4A65FF" }}></span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#4A65FF", letterSpacing: "1.2px", textTransform: "uppercase" }}>Sri Sai Subhramaniya Hospital</span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "700", color: "#0F2239", margin: 0, letterSpacing: "-0.3px" }}>Patient Dashboard</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="home-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 22px",
              borderRadius: "50px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              fontSize: "15px",
              fontWeight: "700",
              color: "#4A65FF",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <FaHome /> Back to Home
          </button>
        </div>

        {/* Dashboard Layout Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "310px 1fr",
          gap: "36px",
          alignItems: "start",
          animation: "fadeInUp 0.5s ease"
        }}>
          {/* Left Sidebar - Clean Pure White Container */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EBF1F9",
            padding: "28px 24px",
            boxShadow: "0 10px 30px rgba(77, 87, 101, 0.03)"
          }}>
            {/* User Info - Flex Row Layout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingBottom: "24px",
              borderBottom: "1px solid #F1F5F9",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4A65FF 0%, #31B0FF 100%)",
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(74, 101, 255, 0.1)",
                border: "2px solid #FFFFFF"
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F2239", margin: 0 }}>{userName}</h3>
                <p style={{ margin: "2px 0 0 0", color: "#72849B", fontSize: "14px", fontWeight: "600", wordBreak: "break-all" }}>{userEmail}</p>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { id: "overview", label: "Overview", icon: <FaHome /> },
                { id: "appointments", label: "My Appointments", icon: <FaCalendarAlt /> },
                { id: "prescriptions", label: "Prescriptions Slip", icon: <FaFileAlt /> },
                { id: "payments", label: "Payment Receipts", icon: <FaCreditCard /> },
                { id: "settings", label: "Patient Profile", icon: <FaUser /> }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      padding: "12px 18px",
                      border: "none",
                      borderRadius: "12px",
                      backgroundColor: isActive ? "rgba(74, 101, 255, 0.08)" : "transparent",
                      color: isActive ? "#4A65FF" : "#72849B",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "rgba(74, 101, 255, 0.03)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span style={{ fontSize: "18px", display: "flex" }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}

              {/* Need Help Card */}
              <div style={{
                backgroundColor: "#F0F5FF",
                borderRadius: "12px",
                padding: "16px",
                marginTop: "24px",
                border: "1px solid #E0EBFF",
                textAlign: "center"
              }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: "#0F2239" }}>Need Help?</h4>
                <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#72849B", fontWeight: "600" }}>Contact our support team</p>
                <a
                  href="https://wa.me/919488339399"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E0EBFF",
                    color: "#4A65FF",
                    fontWeight: "700",
                    fontSize: "13px",
                    textDecoration: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(74, 101, 255, 0.05)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#4A65FF";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.color = "#4A65FF";
                  }}
                >
                  Contact Support
                </a>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 18px",
                  border: "none",
                  borderRadius: "12px",
                  backgroundColor: "transparent",
                  color: "#EF4444",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  textAlign: "left",
                  marginTop: "16px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span style={{ fontSize: "18px", display: "flex" }}><FaSignOutAlt /></span>
                Log Out
              </button>
            </div>
          </div>

          {/* Right Detailed Panel */}
          <div style={activeTab === "overview" ? {
            minHeight: "540px",
          } : {
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #EBF1F9",
            padding: "36px",
            minHeight: "540px",
            boxShadow: "0 10px 30px rgba(77, 87, 101, 0.03)"
          }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="skeleton" style={{ height: "40px", width: "40%", borderRadius: "8px" }}></div>
                <div className="skeleton" style={{ height: "20px", width: "60%", borderRadius: "6px" }}></div>
                <div className="skeleton" style={{ height: "180px", width: "100%", borderRadius: "14px", marginTop: "16px" }}></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "16px" }}>
                  <div className="skeleton" style={{ height: "100px", borderRadius: "14px" }}></div>
                  <div className="skeleton" style={{ height: "100px", borderRadius: "14px" }}></div>
                  <div className="skeleton" style={{ height: "100px", borderRadius: "14px" }}></div>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <OverviewTab
                    userName={userName}
                    appointments={appointments}
                    upcomingAppointment={upcomingAppointment}
                    handleJoinMeeting={handleJoinMeeting}
                    setActiveTab={setActiveTab}
                  />
                )}

                {activeTab === "appointments" && (
                  <AppointmentsTab
                    appointments={appointments}
                    handleJoinMeeting={handleJoinMeeting}
                    setActiveTab={setActiveTab}
                  />
                )}

                {activeTab === "prescriptions" && (
                  <PrescriptionsTab
                    appointments={appointments}
                    userAge={userAge}
                    userGender={userGender}
                    userBloodGroup={userBloodGroup}
                  />
                )}

                {activeTab === "payments" && (
                  <PaymentsTab
                    appointments={appointments}
                    copiedId={copiedId}
                    copyToClipboard={copyToClipboard}
                    setSelectedReceipt={setSelectedReceipt}
                  />
                )}

                {activeTab === "settings" && (
                  <ProfileSettingsTab
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    userName={userName}
                    userEmail={userEmail}
                    userPhone={userPhone}
                    userAge={userAge}
                    userGender={userGender}
                    userBloodGroup={userBloodGroup}
                    userAddress={userAddress}
                    userAlternatePhone={userAlternatePhone}
                    editName={editName}
                    setEditName={setEditName}
                    editPhone={editPhone}
                    setEditPhone={setEditPhone}
                    editAge={editAge}
                    setEditAge={setEditAge}
                    editGender={editGender}
                    setEditGender={setEditGender}
                    editBloodGroup={editBloodGroup}
                    setEditBloodGroup={setEditBloodGroup}
                    editAddress={editAddress}
                    setEditAddress={setEditAddress}
                    editAlternatePhone={editAlternatePhone}
                    setEditAlternatePhone={setEditAlternatePhone}
                    handleSaveProfile={handleSaveProfile}
                    isSaving={isSaving}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Styles for dynamic animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .home-btn:hover {
          background-color: #4A65FF !important;
          color: #FFFFFF !important;
          border-color: #4A65FF !important;
        }
        .skeleton {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
        }
        @keyframes loading-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 992px) {
          div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      {popupMessage && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: popupType === "success" ? "#10B981" : "#EF4444",
          color: "#FFFFFF",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 1000,
          animation: "fadeInUp 0.3s ease",
          fontWeight: "700"
        }}>
          {popupType === "success" ? <FaCheckCircle size={20} /> : "⚠️"}
          <span>{popupMessage}</span>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
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
          onClick={() => setSelectedReceipt(null)}
        >
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-receipt-modal, #printable-receipt-modal * {
                visibility: visible !important;
              }
              #printable-receipt-modal {
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
            style={{
              width: "100%",
              maxWidth: "650px",
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header controls */}
            <div
              style={{
                background: "#060F2D",
                padding: "20px 32px",
                color: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              className="print-btn-no-print"
            >
              <span style={{ fontSize: "16px", fontWeight: "700" }}>Payment Receipt Preview</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: "#4A65FF",
                    border: "none",
                    color: "#FFFFFF",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
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

            {/* Receipt Sheet */}
            <div
              id="printable-receipt-modal"
              style={{
                padding: "48px",
                color: "#0F172A",
                display: "flex",
                flexDirection: "column",
                gap: "36px",
                backgroundColor: "#FFFFFF",
                textAlign: "left",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {/* Logo, Hospital Info & Invoice Meta */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}>
                {/* Left Side: Hospital Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "#060F2D",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "700" }}>🩺</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#060F2D", display: "block" }}>
                        SRISAI SUBHRAMANIYA
                      </span>
                      <span style={{ fontSize: "9.5px", color: "#64748B", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginTop: "-2px" }}>
                        Hospitals
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", maxWidth: "260px", marginTop: "4px" }}>
                    # 35,36, Masilamaneeswarar Nagar,<br />
                    Thirumullaivoyal, Chennai-600062<br />
                    Phone: +91 9840030402, +91 9444479090<br />
                    Email: srisaisubhramaniyahospitals@gmail.com
                  </div>
                </div>

                {/* Right Side: Invoice Info */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", textAlign: "right" }}>
                  <span style={{ fontSize: "24px", fontWeight: "800", color: "#060F2D", letterSpacing: "-1px" }}>PAYMENT RECEIPT</span>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
                    Invoice No: <strong style={{ color: "#0F172A" }}>#SSH-{selectedReceipt.paymentId?.substring(0, 8).toUpperCase() || "ONLINE"}</strong>
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
                    Date: <strong style={{ color: "#0F172A" }}>{new Date(selectedReceipt.createdAt || selectedReceipt.appointmenttime).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
                    Payment Mode: <strong style={{ color: "#0F172A" }}>Razorpay Online</strong>
                  </span>
                  <span style={{
                    marginTop: "6px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "800",
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    color: "#10B981"
                  }}>
                    PAID / VERIFIED
                  </span>
                </div>
              </div>

              {/* Bill To & Bill From */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", borderTop: "1.5px solid #F1F5F9", paddingTop: "24px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748B", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>Patient Details (Bill To)</span>
                  <strong style={{ fontSize: "15px", color: "#060F2D", display: "block" }}>{selectedReceipt.pasentname}</strong>
                  <span style={{ fontSize: "13px", color: "#475569", display: "block", marginTop: "4px" }}>Email: {selectedReceipt.pasentmail}</span>
                  <span style={{ fontSize: "13px", color: "#475569", display: "block", marginTop: "2px" }}>Phone: {selectedReceipt.pasentnumber}</span>
                  <span style={{ fontSize: "13px", color: "#475569", display: "block", marginTop: "2px" }}>Patient ID: PID-{selectedReceipt._id?.substring(0, 6).toUpperCase() || "NEW"}</span>
                </div>
                
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748B", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>Consulting Unit</span>
                  <strong style={{ fontSize: "15px", color: "#060F2D", display: "block" }}>{selectedReceipt.speciality}</strong>
                  <span style={{ fontSize: "13px", color: "#475569", display: "block", marginTop: "4px" }}>Sri Sai Subhramaniya Clinic</span>
                  <span style={{ fontSize: "13px", color: "#475569", display: "block", marginTop: "2px" }}>Service Category: Outpatient Consultation</span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #0F172A", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#0F172A", letterSpacing: "0.5px" }}>
                      <th style={{ padding: "10px 0" }}>Service Description</th>
                      <th style={{ padding: "10px 0", textAlign: "right" }}>Fee (INR)</th>
                      <th style={{ padding: "10px 0", textAlign: "right" }}>Discount</th>
                      <th style={{ padding: "10px 0", textAlign: "right" }}>Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1.5px solid #F1F5F9", fontSize: "13.5px", color: "#4D5765" }}>
                      <td style={{ padding: "16px 0" }}>
                        <strong style={{ color: "#060F2D", display: "block" }}>Clinical Consultation Charges</strong>
                        <span style={{ fontSize: "11.5px", color: "#64748B" }}>Standard consult under specialty: {selectedReceipt.speciality}</span>
                      </td>
                      <td style={{ padding: "16px 0", textAlign: "right" }}>₹ {(selectedReceipt.amount || 1000).toLocaleString()}</td>
                      <td style={{ padding: "16px 0", textAlign: "right" }}>₹ 0</td>
                      <td style={{ padding: "16px 0", textAlign: "right", fontWeight: "700", color: "#060F2D" }}>₹ {(selectedReceipt.amount || 1000).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Subtotal, tax & grand total */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                <div style={{ width: "260px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                    <span>Subtotal</span>
                    <span>₹ {(selectedReceipt.amount || 1000).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                    <span>Tax (GST 0%)</span>
                    <span>₹ 0</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", color: "#060F2D", borderTop: "2px solid #0F172A", paddingTop: "10px" }}>
                    <span>Total Paid</span>
                    <span>₹ {(selectedReceipt.amount || 1000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Disclaimer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "40px", borderTop: "1.5px solid #F1F5F9", paddingTop: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#10B981", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                    Computer Generated Receipt - No Signature Required
                  </span>
                  <span style={{ fontSize: "11px", color: "#94A3B8" }}>Thank you for choosing Sri Sai Hospital for your healthcare needs.</span>
                </div>
                
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{
                    width: "80px",
                    height: "35px",
                    border: "1.5px dashed rgba(74, 101, 255, 0.4)",
                    borderRadius: "8px",
                    color: "#4A65FF",
                    fontSize: "11px",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(-4deg)",
                    marginBottom: "4px"
                  }}>
                    PAID STAMP
                  </div>
                  <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#060F2D" }}>Sri Sai Hospital Hub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
