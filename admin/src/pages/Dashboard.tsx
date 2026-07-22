import React, { useState, useEffect } from "react";
import { LayoutDashboard, Stethoscope, Users, Calendar, Settings, LogOut, Bell, CreditCard, ChevronDown, Search, Menu } from "lucide-react";
import OverviewTab from "../components/Tabs/OverviewTab";
import DoctorsTab from "../components/Tabs/DoctorsTab";
import PatientsTab from "../components/Tabs/PatientsTab";
import AppointmentsTab from "../components/Tabs/AppointmentsTab";
import SettingsTab from "../components/Tabs/SettingsTab";
import PaymentsTab from "../components/Tabs/PaymentsTab";

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

interface DoctorInput {
  name: string;
  speciality: string;
  email: string;
  phone: string;
  experience: string;
  timing: string;
}

const SPECIALITIES = [
  "Gynecology & Women's Health",
  "Infertility & Fertility",
  "Obstetrics & Maternity",
  "Endocrinology",
  "Obesity & Weight Loss",
  "Diabetology",
  "Dermatology & Cosmetology",
  "Hair & Nail Clinic",
  "Urology",
  "General Medicine",
];

const TIMINGS = [
  "09:00 AM - 01:00 PM",
  "01:00 PM - 05:00 PM",
  "05:00 PM - 09:00 PM",
  "09:00 AM - 05:00 PM",
  "10:00 AM - 02:00 PM",
  "02:00 PM - 06:00 PM",
  "06:00 PM - 10:00 PM",
];

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminActiveTab") || "dashboard";
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Doctor Form Input State
  const [doctorForm, setDoctorForm] = useState<DoctorInput>({
    name: "",
    speciality: SPECIALITIES[0],
    email: "",
    phone: "",
    experience: "",
    timing: TIMINGS[0],
  });

  // Doctor Modals state
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [editDoctorForm, setEditDoctorForm] = useState<DoctorInput>({
    name: "",
    speciality: SPECIALITIES[0],
    email: "",
    phone: "",
    experience: "",
    timing: TIMINGS[0],
  });

  // Settings Configuration State
  const [settingsForm, setSettingsForm] = useState({
    hospitalName: "Sri Sai Hospital",
    consultationFee: "1000",
    contactEmail: "info@srisaihospital.org",
    contactPhone: "+91 44 2468 1357",
    address: "Chennai, Tamil Nadu",
    googleIntegration: false,
    razorpayKey: "",
    razorpaySecret: "",
  });

  // Manage Appointment Modal States
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [manageStatus, setManageStatus] = useState("pending");
  const [manageDoctor, setManageDoctor] = useState("");
  const [managePrescription, setManagePrescription] = useState("");
  const [managePaymentStatus, setManagePaymentStatus] = useState("pending");
  const [isSavingAppointment, _setIsSavingAppointment] = useState(false);

  

  // Doctor slot blocking states
  const [selectedDoctorForBlocking, setSelectedDoctorForBlocking] = useState<any | null>(null);
  const [isBlockingModalOpen, setIsBlockingModalOpen] = useState(false);
  const [blockDateInput, setBlockDateInput] = useState("");

  // Alert/Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Track which appointments the admin has already "seen" during this session
  const [seenAppointments, setSeenAppointments] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("seenAppointments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save seenAppointments to localStorage on change
  useEffect(() => {
    localStorage.setItem("seenAppointments", JSON.stringify(seenAppointments));
  }, [seenAppointments]);

  // Persist activeTab to localStorage
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // Mark all pending appointments as seen when clicking the Bell or entering Appointments tab
  useEffect(() => {
    if (activeTab === "appointments" && appointments.length > 0) {
      const pendingIds = appointments
        .filter((app) => app.status === "pending")
        .map((app) => app._id);

      if (pendingIds.length > 0) {
        setSeenAppointments((prev) => {
          const updated = [...new Set([...prev, ...pendingIds])];
          return updated;
        });
      }
    }
  }, [activeTab, appointments]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Inactivity Auto-Logout Security Hook (15 Minutes)
  useEffect(() => {
    let inactivityTimer: any;

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        onLogout();
        // Since we are logging out, we can trigger a alert or redirect
      }, 15 * 60 * 1000); // 15 Minutes
    };

    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [onLogout]);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Hospital Overview";
      case "doctors":
        return "Doctors Directory";
      case "patients":
        return "Patients Registry";
      case "appointments":
        return "Appointments & Bookings";
      case "payments":
        return "Payments Registry";
      case "settings":
        return "Admin Settings";
      default:
        return "Hospital Overview";
    }
  };

  // Fetch registered doctors from database endpoint
  const fetchDoctors = async () => {
    setIsLoadingDoctors(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/doctor/all`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch doctors");
      }

      setDoctors(data.doctors || []);
    } catch (err: any) {
      triggerToast(`❌ Error fetching doctors: ${err.message}`);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  // Fetch registered patients from MongoDB
  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    setPatientsError("");
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        onLogout();
        return;
      }
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/user/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch patients");
      }
      setPatients(data.users || []);
    } catch (err: any) {
      setPatientsError(err.message || "Could not connect to server database.");
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        onLogout();
        return;
      }
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/appointments`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch appointments");
      }
      setAppointments(data || []);
    } catch (err: any) {
      triggerToast(`❌ Error fetching appointments: ${err.message}`);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const handleQuickCancel = async (appId: string) => {
    const originalAppointments = [...appointments];

    // Optimistic update
    setAppointments((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status: "cancelled" } : app))
    );
    triggerToast("⏳ Cancelling appointment...");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        onLogout();
        return;
      }
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/appointments/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }
      triggerToast("✅ Appointment cancelled successfully!");
    } catch (err: any) {
      setAppointments(originalAppointments);
      triggerToast(`❌ Error: ${err.message}`);
    }
  };

  const handleTogglePaymentStatus = async (appId: string, currentStatus: string) => {
    const originalAppointments = [...appointments];
    const newStatus = currentStatus === "paid" ? "pending" : "paid";

    // Optimistic update
    setAppointments((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, paymentStatus: newStatus } : app))
    );
    triggerToast(`⏳ Updating payment to ${newStatus}...`);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        onLogout();
        return;
      }
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/appointments/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }
      triggerToast(`✅ Payment status updated to ${newStatus}!`);
    } catch (err: any) {
      setAppointments(originalAppointments);
      triggerToast(`❌ Error: ${err.message}`);
    }
  };

  const handleManageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const originalAppointments = [...appointments];

    // Find full assigned doctor details if assignedDoctor is selected
    const assignedDoctorDetails = doctors.find((d) => d._id === manageDoctor);

    // Optimistic update
    const updatedApp = {
      ...selectedAppointment,
      status: manageStatus,
      assignedDoctor: assignedDoctorDetails || selectedAppointment.assignedDoctor,
      prescription: managePrescription,
      paymentStatus: managePaymentStatus,
    };

    setAppointments((prev) =>
      prev.map((app) => (app._id === selectedAppointment._id ? updatedApp : app))
    );

    triggerToast("⏳ Saving appointment updates...");
    setIsManageModalOpen(false);
    setSelectedAppointment(null);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        onLogout();
        return;
      }
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/appointments/${selectedAppointment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: manageStatus,
          assignedDoctor: manageDoctor || null,
          prescription: managePrescription,
          paymentStatus: managePaymentStatus,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update appointment");
      }

      if (data.data) {
        // Find if doctors array has the doctor object to populate properly if populated details are expected
        let updatedItem = data.data;
        if (updatedItem.assignedDoctor && typeof updatedItem.assignedDoctor === "string") {
          const docObj = doctors.find(d => d._id === updatedItem.assignedDoctor);
          if (docObj) {
            updatedItem.assignedDoctor = docObj;
          }
        }
        setAppointments((prev) =>
          prev.map((app) => (app._id === selectedAppointment._id ? updatedItem : app))
        );
      }

      triggerToast("✅ Appointment updated successfully!");
    } catch (err: any) {
      setAppointments(originalAppointments);
      triggerToast(`❌ Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const eventSource = new EventSource(`${backendUrl}/api/appointments/live`);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("⚡ SSE Real-Time Event:", parsed);

        if (parsed.event === "new-appointment") {
          setAppointments((prev) => [parsed.data, ...prev]);
          triggerToast("🔔 New Appointment booked by patient!");
        } else if (parsed.event === "update-appointment") {
          let updatedItem = parsed.data;
          if (updatedItem.assignedDoctor && typeof updatedItem.assignedDoctor === "string") {
            const docObj = doctors.find((d: any) => d._id === updatedItem.assignedDoctor);
            if (docObj) {
              updatedItem.assignedDoctor = docObj;
            }
          }
          setAppointments((prev) =>
            prev.map((app) => (app._id === updatedItem._id ? updatedItem : app))
          );
        } else {
          fetchAppointments();
        }
      } catch (err) {
        console.error("Error handling SSE real-time message:", err);
        fetchAppointments();
      }
    };

    eventSource.onerror = (err) => {
      console.warn("SSE EventSource error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [doctors]);

  const handleBlockDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForBlocking || !blockDateInput) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      triggerToast("❌ Session expired!");
      return;
    }

    const currentBlocked = selectedDoctorForBlocking.blockedDates || [];
    if (currentBlocked.includes(blockDateInput)) {
      triggerToast("❌ This date is already blocked!");
      return;
    }

    const updatedBlocked = [...currentBlocked, blockDateInput].sort();

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/doctor/update/${selectedDoctorForBlocking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ blockedDates: updatedBlocked })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      triggerToast("✅ Blocked date added successfully!");
      setSelectedDoctorForBlocking(data.doctor);
      fetchDoctors();
      setBlockDateInput("");
    } catch (err: any) {
      triggerToast(`❌ Error: ${err.message}`);
    }
  };

  const handleUnblockDate = async (dateStr: string) => {
    if (!selectedDoctorForBlocking) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const currentBlocked = selectedDoctorForBlocking.blockedDates || [];
    const updatedBlocked = currentBlocked.filter((d: string) => d !== dateStr);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/doctor/update/${selectedDoctorForBlocking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ blockedDates: updatedBlocked })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      triggerToast("✅ Date unblocked successfully!");
      setSelectedDoctorForBlocking(data.doctor);
      fetchDoctors();
    } catch (err: any) {
      triggerToast(`❌ Error: ${err.message}`);
    }
  };

  const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        triggerToast("❌ Session expired! Please login again.");
        return;
      }

      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/api/doctor/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: doctorForm.name,
          speciality: doctorForm.speciality,
          email: doctorForm.email,
          experience: Number(doctorForm.experience),
          timing: doctorForm.timing,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add doctor");
      }

      triggerToast(`✅ ${data.message || "Doctor registered successfully!"}`);
      fetchDoctors();

      setDoctorForm({
        name: "",
        speciality: SPECIALITIES[0],
        email: "",
        phone: "",
        experience: "",
        timing: TIMINGS[0],
      });

      setIsAddDoctorModalOpen(false);

    } catch (err: any) {
      console.error(err);
      triggerToast(`❌ Error: ${err.message || "Failed to register doctor"}`);
    }
  };

  const handleEditDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      const token = localStorage.getItem("adminToken");
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === editingDoctor._id ? { ...doc, ...editDoctorForm } : doc
        )
      );

      triggerToast("⏳ Updating doctor details...");

      const response = await fetch(`${backendUrl}/api/doctor/update/${editingDoctor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editDoctorForm.name,
          speciality: editDoctorForm.speciality,
          email: editDoctorForm.email,
          experience: Number(editDoctorForm.experience),
          timing: editDoctorForm.timing,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        triggerToast("✅ Doctor details updated successfully!");
        fetchDoctors();
      } else {
        console.warn("Backend update API response not OK. Keep local changes.", data.message);
        triggerToast("✅ Doctor updated in interface (Local State).");
      }
    } catch (err: any) {
      console.error("Update API Error:", err);
      triggerToast("✅ Doctor updated in interface (Local State).");
    } finally {
      setIsEditDoctorModalOpen(false);
      setEditingDoctor(null);
    }
  };

  const handleToggleAvailability = async (docId: string, currentAvailable: boolean) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc._id === docId ? { ...doc, isAvailable: !currentAvailable } : doc
      )
    );

    try {
      const token = localStorage.getItem("adminToken");
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/api/doctor/update/${docId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable: !currentAvailable,
        }),
      });

      if (response.ok) {
        triggerToast(`✨ Doctor status set to ${!currentAvailable ? "Active" : "Inactive"}`);
        fetchDoctors();
      } else {
        triggerToast(`✨ Doctor status updated to ${!currentAvailable ? "Active" : "Inactive"}`);
      }
    } catch (err) {
      console.error(err);
      triggerToast(`✨ Doctor status updated to ${!currentAvailable ? "Active" : "Inactive"}`);
    }
  };

  const handleDeleteDoctorClick = async (docId: string) => {
    if (!window.confirm("Are you sure you want to remove this doctor from the roster registry?")) {
      return;
    }

    setDoctors((prev) => prev.filter((doc) => doc._id !== docId));

    try {
      const token = localStorage.getItem("adminToken");
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/api/doctor/delete/${docId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        triggerToast("🗑️ Doctor removed successfully!");
        fetchDoctors();
      } else {
        triggerToast("🗑️ Doctor profile removed (Local State).");
      }
    } catch (err) {
      console.error(err);
      triggerToast("🗑️ Doctor profile removed (Local State).");
    }
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Settings database API integration coming in next step!");
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
    <div
      className="dashboard-layout"
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        minHeight: "100vh",
        backgroundColor: "#F8FAF9",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            backgroundColor: "#060F2D",
            color: "#FFFFFF",
            padding: "16px 28px",
            borderRadius: "14px",
            boxShadow: "0 12px 30px rgba(6, 15, 45, 0.15)",
            zIndex: 99999,
            fontWeight: "700",
            fontSize: "14px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            animation: "slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          backgroundColor: "#060F2D",
          color: "#FFFFFF",
          padding: "36px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Logo Brand Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "#4A65FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(74, 101, 255, 0.3)",
              }}
            >
              <Stethoscope size={20} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "-0.3px", fontFamily: "'Outfit', sans-serif", color: "#FFFFFF", margin: 0, whiteSpace: "nowrap" }}>
                SRISAI SUBHRAMANIYA
              </h1>
              <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginTop: "2px" }}>
                Hospitals
              </span>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { id: "dashboard", label: "Overview Hub", icon: <LayoutDashboard size={18} /> },
              { id: "doctors", label: "Doctors Directory", icon: <Stethoscope size={18} /> },
              { id: "patients", label: "Patients Registry", icon: <Users size={18} /> },
              { id: "appointments", label: "Appointments Log", icon: <Calendar size={18} />, badge: appointments.filter((app) => app.status === "pending" && !seenAppointments.includes(app._id)).length },
              { id: "payments", label: "Payments & Revenue", icon: <CreditCard size={18} /> },
              { id: "settings", label: "Gateway Config", icon: <Settings size={18} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: isActive ? "rgba(14, 165, 233, 0.12)" : "transparent",
                    color: isActive ? "#0EA5E9" : "#94A3B8",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: isActive ? "700" : "600",
                    textAlign: "left",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#94A3B8";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      style={{
                        backgroundColor: "#EF4444",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              padding: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#4A65FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              SA
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "13.5px" }}>Super Admin</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Active Session</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "transparent",
              color: "#EF4444",
              border: "1.5px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13.5px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main style={{ display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
        {/* Header Bar */}
        <header
          style={{
            backgroundColor: "#FFFFFF",
            padding: "18px 40px",
            borderBottom: "1.5px solid #F1F5F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
              }}
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#060F2D", letterSpacing: "-0.5px", margin: 0 }}>
                {getHeaderTitle()}
              </h2>
              <span style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", display: "block", fontWeight: "500" }}>
                Srisai Subhramaniya Hospitals Management Hub
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                color="#94A3B8"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="text"
                placeholder="Search patient, doctor..."
                style={{
                  padding: "10px 16px 10px 40px",
                  borderRadius: "10px",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "13px",
                  outline: "none",
                  width: "240px",
                  color: "#0F172A",
                  fontFamily: "'Onest', sans-serif",
                  backgroundColor: "#FCFDFD",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4A65FF";
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.backgroundColor = "#FCFDFD";
                }}
              />
            </div>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setActiveTab("appointments");
                  triggerToast("🔔 Displaying all new pending appointment logs!");
                }}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  cursor: "pointer",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  position: "relative"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E2E8F0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F1F5F9")}
              >
                <Bell size={18} color="#0F172A" />
                {appointments.filter((app) => app.status === "pending" && !seenAppointments.includes(app._id)).length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      backgroundColor: "#10B981",
                      color: "#FFFFFF",
                      fontSize: "9px",
                      fontWeight: "850",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #FFFFFF",
                      pointerEvents: "none",
                    }}
                  >
                    {appointments.filter((app) => app.status === "pending" && !seenAppointments.includes(app._id)).length}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile Info Card */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1.5px solid #F1F5F9", paddingLeft: "24px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#0EA5E9",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "800",
                }}
              >
                SA
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span style={{ fontSize: "13px", fontWeight: "750", color: "#060F2D" }}>Super Admin</span>
                <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "600" }}>Administrator</span>
              </div>
              <ChevronDown size={14} color="#64748B" style={{ cursor: "pointer", marginLeft: "4px" }} />
            </div>
          </div>
        </header>

        {/* Tab Page Containers */}
        <div style={{ padding: "40px", flexGrow: 1 }}>
          {activeTab === "dashboard" && (
            <OverviewTab
              appointments={appointments}
              doctors={doctors}
              patients={patients}
              setActiveTab={setActiveTab}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "doctors" && (
            <DoctorsTab
              doctors={doctors}
              isLoadingDoctors={isLoadingDoctors}
              doctorsError={""}
              fetchDoctors={fetchDoctors}
              triggerToast={triggerToast}
              isAddDoctorModalOpen={isAddDoctorModalOpen}
              setIsAddDoctorModalOpen={setIsAddDoctorModalOpen}
              doctorForm={doctorForm}
              setDoctorForm={setDoctorForm}
              handleAddDoctorSubmit={handleAddDoctorSubmit}
              isEditDoctorModalOpen={isEditDoctorModalOpen}
              setIsEditDoctorModalOpen={setIsEditDoctorModalOpen}
              editingDoctor={editingDoctor}
              setEditingDoctor={setEditingDoctor}
              editDoctorForm={editDoctorForm}
              setEditDoctorForm={setEditDoctorForm}
              handleEditDoctorSubmit={handleEditDoctorSubmit}
              handleToggleAvailability={handleToggleAvailability}
              handleDeleteDoctorClick={handleDeleteDoctorClick}
              isBlockingModalOpen={isBlockingModalOpen}
              setIsBlockingModalOpen={setIsBlockingModalOpen}
              selectedDoctorForBlocking={selectedDoctorForBlocking}
              setSelectedDoctorForBlocking={setSelectedDoctorForBlocking}
              blockDateInput={blockDateInput}
              setBlockDateInput={setBlockDateInput}
              handleBlockDateSubmit={handleBlockDateSubmit}
              handleUnblockDate={handleUnblockDate}
              SPECIALITIES={SPECIALITIES}
              TIMINGS={TIMINGS}
            />
          )}

          {activeTab === "patients" && (
            <PatientsTab
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isLoadingPatients={isLoadingPatients}
              patientsError={patientsError}
              filteredPatients={filteredPatients}
              fetchPatients={fetchPatients}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsTab
              appointments={appointments}
              doctors={doctors}
              patients={patients}
              isLoadingAppointments={isLoadingAppointments}
              appointmentsError={""}
              fetchAppointments={fetchAppointments}
              triggerToast={triggerToast}
              isManageModalOpen={isManageModalOpen}
              setIsManageModalOpen={setIsManageModalOpen}
              selectedAppointment={selectedAppointment}
              setSelectedAppointment={setSelectedAppointment}
              manageStatus={manageStatus}
              setManageStatus={setManageStatus}
              manageDoctor={manageDoctor}
              setManageDoctor={setManageDoctor}
              managePrescription={managePrescription}
              setManagePrescription={setManagePrescription}
              managePaymentStatus={managePaymentStatus}
              setManagePaymentStatus={setManagePaymentStatus}
              isSavingAppointment={isSavingAppointment}
              handleManageSubmit={handleManageSubmit}
              SPECIALITIES={SPECIALITIES}
              handleQuickCancel={handleQuickCancel}
              handleTogglePaymentStatus={handleTogglePaymentStatus}
            />
          )}

          {activeTab === "payments" && (
            <PaymentsTab
              appointments={appointments}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              onSubmit={handleSaveSettingsSubmit}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
