import React, { useState, useEffect } from "react";
import { 
  CreditCard, Search, Download, 
  Calendar, Filter, ChevronLeft, ChevronRight, Copy, Check, 
  TrendingUp, Activity, Printer, X, Stethoscope 
} from "lucide-react";

interface PaymentsTabProps {
  appointments: any[];
  triggerToast: (msg: string) => void;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ appointments, triggerToast }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCardFilter, setSelectedCardFilter] = useState("all"); // 'all', 'today', 'week', 'month'
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom Date Range States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Reset pagination to first page when any filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, specialityFilter, statusFilter, selectedCardFilter, startDate, endDate, rowsPerPage]);

  // Extract paid or failed appointments list
  const paidAppointments = appointments.filter((app: any) => app.paymentStatus === "paid" || app.paymentStatus === "failed");

  // Get distinct specialities for filter dropdown
  const specialities = Array.from(new Set(appointments.map((app: any) => app.speciality)));

  // Copy to clipboard helper
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    triggerToast("📋 Transaction ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Filter by Speciality, Search, & Date Range (This serves as the base for card stats & final table filtering)
  const baseFilteredAppointments = paidAppointments.filter((app: any) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = app.pasentname?.toLowerCase().includes(searchLower);
    const emailMatch = app.pasentmail?.toLowerCase().includes(searchLower);
    const txIdMatch = app.paymentId?.toLowerCase().includes(searchLower);
    const matchesSearch = nameMatch || emailMatch || txIdMatch;

    const matchesSpeciality = specialityFilter === "all" || app.speciality === specialityFilter;

    // Custom Date range check
    let matchesDateRange = true;
    const appDate = new Date(app.createdAt || app.appointmenttime);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (appDate < start) matchesDateRange = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (appDate > end) matchesDateRange = false;
    }

    return matchesSearch && matchesSpeciality && matchesDateRange;
  });

  // 2. Compute dynamic stats from the base filtered list
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const currentDay = now.getDay();
  const dist = currentDay === 0 ? 6 : currentDay - 1;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dist);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let todayRevenue = 0;
  let todayCount = 0;
  let weekRevenue = 0;
  let weekCount = 0;
  let monthRevenue = 0;
  let monthCount = 0;
  let totalRevenue = 0;
  let totalCount = 0;

  // Track revenue per specialty for the visual breakdown chart
  const specialtyRevenueMap: { [key: string]: number } = {};

  baseFilteredAppointments.forEach((app: any) => {
    const isPaid = app.paymentStatus === "paid";
    if (isPaid) {
      const amount = app.amount || 1000;
      const appDate = new Date(app.createdAt || app.appointmenttime);

      totalRevenue += amount;
      totalCount += 1;

      // Accumulate specialty revenue
      if (app.speciality) {
        specialtyRevenueMap[app.speciality] = (specialtyRevenueMap[app.speciality] || 0) + amount;
      }

      if (appDate >= startOfToday) {
        todayRevenue += amount;
        todayCount += 1;
      }
      if (appDate >= startOfWeek) {
        weekRevenue += amount;
        weekCount += 1;
      }
      if (appDate >= startOfMonth) {
        monthRevenue += amount;
        monthCount += 1;
      }
    }
  });

  // Convert specialty revenue to array for breakdown bar
  const specialtyShare = Object.keys(specialtyRevenueMap).map((spec) => ({
    name: spec,
    revenue: specialtyRevenueMap[spec],
    percentage: totalRevenue > 0 ? (specialtyRevenueMap[spec] / totalRevenue) * 100 : 0
  })).sort((a, b) => b.revenue - a.revenue);

  // Helper to color code specialties
  const getSpecialtyColor = (spec: string) => {
    const hash = spec.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      { text: "#3F59FF", bg: "rgba(63, 89, 255, 0.08)" }, // Blue
      { text: "#10B981", bg: "rgba(16, 185, 129, 0.08)" }, // Green
      { text: "#D97706", bg: "rgba(217, 119, 6, 0.08)" }, // Amber
      { text: "#7C3AED", bg: "rgba(124, 58, 237, 0.08)" }, // Purple
      { text: "#EC4899", bg: "rgba(236, 72, 153, 0.08)" }, // Pink
      { text: "#06B6D4", bg: "rgba(6, 182, 212, 0.08)" }, // Cyan
    ];
    return colors[hash % colors.length];
  };

  const getStatusStyles = (status: string) => {
    const normalized = (status || "").toLowerCase().trim();
    switch (normalized) {
      case "paid":
      case "approved":
        return { color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" };
      case "failed":
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

  // 3. Further filter the list by the selected top card filter
  const finalPayments = baseFilteredAppointments.filter((app: any) => {
    // Check card filter first
    let matchesCard = true;
    const appDate = new Date(app.createdAt || app.appointmenttime);
    if (selectedCardFilter === "today") {
      matchesCard = appDate >= startOfToday;
    } else if (selectedCardFilter === "week") {
      matchesCard = appDate >= startOfWeek;
    } else if (selectedCardFilter === "month") {
      matchesCard = appDate >= startOfMonth;
    }

    // Check payment status filter
    const matchesStatus = statusFilter === "all" || app.paymentStatus === statusFilter;

    return matchesCard && matchesStatus;
  });

  // 4. Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = finalPayments.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(finalPayments.length / rowsPerPage) || 1;

  // Export payments to CSV format
  const handleExportCSV = () => {
    if (finalPayments.length === 0) {
      triggerToast("⚠️ No payment records to export.");
      return;
    }

    const headers = ["Transaction ID", "Patient Name", "Email", "Phone", "Specialty", "Paid Date", "Amount (INR)", "Status"];
    const rows = finalPayments.map((app: any) => [
      app.paymentId || "N/A",
      app.pasentname || "N/A",
      app.pasentmail || "N/A",
      app.pasentnumber || "N/A",
      app.speciality || "N/A",
      new Date(app.createdAt || app.appointmenttime).toLocaleString(),
      app.amount || 1000,
      app.paymentStatus.toUpperCase()
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sri_Sai_Hospital_Payments_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("✅ CSV report downloaded successfully!");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSpecialityFilter("all");
    setStatusFilter("all");
    setSelectedCardFilter("all");
    setStartDate("");
    setEndDate("");
    triggerToast("🔄 Filters reset to default.");
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Prepare chart details dynamically
  const getTrendData = () => {
    const datesMap: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      datesMap[key] = 0;
    }

    baseFilteredAppointments.forEach((app: any) => {
      const isPaid = app.paymentStatus === "paid";
      if (isPaid) {
        const appDate = new Date(app.createdAt || app.appointmenttime);
        const key = appDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        if (datesMap[key] !== undefined) {
          datesMap[key] += app.amount || 1000;
        }
      }
    });

    return Object.keys(datesMap).map(key => ({ date: key, amount: datesMap[key] }));
  };

  const trendData = getTrendData();
  const maxTrendVal = Math.max(...trendData.map(d => d.amount), 1000);

  // Generate SVG points
  const svgWidth = 500;
  const svgHeight = 140;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const points = trendData.map((d, index) => {
    const x = paddingLeft + (index / (trendData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.amount / maxTrendVal) * chartHeight;
    return { x, y, date: d.date, amount: d.amount };
  });

  const areaPath = points.length > 0 
    ? `M ${points[0].x} ${paddingTop + chartHeight} ` + points.map(p => `L ${p.x} ${p.y}`).join(" ") + ` L ${points[points.length - 1].x} ${paddingTop + chartHeight} Z`
    : "";

  const linePath = points.length > 0
    ? points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ")
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "'Inter', sans-serif" }}>

      {/* Dynamic Summary Cards (Clickable) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
        {[
          {
            id: "today",
            title: "Today's Collection",
            amount: `₹ ${todayRevenue.toLocaleString()}`,
            count: `${todayCount} successful payments`,
            icon: <Calendar size={18} color="#060F2D" />,
            color: "#060F2D",
            borderActive: "1.5px solid #060F2D",
            borderInactive: "1.5px solid rgba(6, 15, 45, 0.08)",
            badge: { text: "Today's Filter", bg: "rgba(6, 15, 45, 0.05)", color: "#060F2D" }
          },
          {
            id: "week",
            title: "This Week's Revenue",
            amount: `₹ ${weekRevenue.toLocaleString()}`,
            count: `${weekCount} successful payments`,
            icon: <TrendingUp size={18} color="#060F2D" />,
            color: "#060F2D",
            borderActive: "1.5px solid #060F2D",
            borderInactive: "1.5px solid rgba(6, 15, 45, 0.08)",
            badge: { text: "Weekly Filter", bg: "rgba(6, 15, 45, 0.05)", color: "#060F2D" }
          },
          {
            id: "month",
            title: "This Month's Revenue",
            amount: `₹ ${monthRevenue.toLocaleString()}`,
            count: `${monthCount} successful payments`,
            icon: <Activity size={18} color="#060F2D" />,
            color: "#060F2D",
            borderActive: "1.5px solid #060F2D",
            borderInactive: "1.5px solid rgba(6, 15, 45, 0.08)",
            badge: { text: "Monthly Filter", bg: "rgba(6, 15, 45, 0.05)", color: "#060F2D" }
          },
          {
            id: "all",
            title: "Total Revenue Logged",
            amount: `₹ ${totalRevenue.toLocaleString()}`,
            count: `${totalCount} total payments`,
            icon: <CreditCard size={18} color="#060F2D" />,
            color: "#060F2D",
            borderActive: "1.5px solid #060F2D",
            borderInactive: "1.5px solid rgba(6, 15, 45, 0.08)",
            badge: { text: "Show All", bg: "rgba(6, 15, 45, 0.05)", color: "#060F2D" }
          }
        ].map((card) => {
          const isActive = selectedCardFilter === card.id;
          return (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCardFilter(card.id);
                triggerToast(`🔍 Filtered table to ${card.title}`);
              }}
              style={{
                background: "#FFFFFF",
                border: isActive ? card.borderActive : card.borderInactive,
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                cursor: "pointer",
                transform: isActive ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isActive ? `0 16px 36px rgba(6, 15, 45, 0.08)` : "0 8px 24px rgba(6, 15, 45, 0.01)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(6, 15, 45, 0.03)";
                  e.currentTarget.style.borderColor = card.color;
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(6, 15, 45, 0.01)";
                  e.currentTarget.style.borderColor = "rgba(6, 15, 45, 0.08)";
                }
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "600" }}>{card.title}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      color: isActive ? "#FFFFFF" : card.badge.color,
                      backgroundColor: isActive ? card.color : card.badge.bg,
                      padding: "2px 8px",
                      borderRadius: "8px",
                      alignSelf: "flex-start",
                      marginTop: "4px",
                      transition: "all 0.2s"
                    }}
                  >
                    {isActive ? "Active Filter" : card.badge.text}
                  </span>
                </div>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "rgba(6, 15, 45, 0.05)" : "rgba(6, 15, 45, 0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}>
                  {card.icon}
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#060F2D", letterSpacing: "-1px", margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  {card.amount}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
                    {card.count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px" }}>
        
        {/* Trend Area Chart */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6, 15, 45, 0.04)", boxShadow: "0 8px 24px rgba(6, 15, 45, 0.01)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", margin: 0, fontFamily: "'Outfit', sans-serif" }}>Revenue Collection Trend</h4>
              <span style={{ fontSize: "11px", color: "#64748B" }}>Daily collection rate for last 7 days</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", color: "#3F59FF" }}>
              <TrendingUp size={14} />
              <span>₹{totalRevenue.toLocaleString()} Total</span>
            </div>
          </div>
          
          <div style={{ width: "100%", height: "140px" }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3F59FF" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#3F59FF" stopOpacity="0.00"/>
                </linearGradient>
              </defs>
              
              {/* Y Axis Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = paddingTop + ratio * chartHeight;
                return (
                  <line 
                    key={idx} 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={svgWidth - paddingRight} 
                    y2={y} 
                    stroke="#F1F5F9" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area path */}
              {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}
              
              {/* Line path */}
              {linePath && <path d={linePath} fill="none" stroke="#3F59FF" strokeWidth="2.5" strokeLinecap="round" />}
              
              {/* Markers & Labels */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#3F59FF" strokeWidth="2" />
                  {p.amount > 0 && (
                    <text 
                      x={p.x} 
                      y={p.y - 8} 
                      textAnchor="middle" 
                      fontSize="9px" 
                      fontWeight="700" 
                      fill="#060F2D"
                    >
                      ₹{p.amount}
                    </text>
                  )}
                  <text 
                    x={p.x} 
                    y={paddingTop + chartHeight + 16} 
                    textAnchor="middle" 
                    fontSize="9.5px" 
                    fontWeight="600" 
                    fill="#64748B"
                  >
                    {p.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Specialty Breakdown List (Premium 2-column Scrollable Grid) */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6, 15, 45, 0.04)", boxShadow: "0 8px 24px rgba(6, 15, 45, 0.01)" }}>
          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#060F2D", marginBottom: "16px", fontFamily: "'Outfit', sans-serif" }}>Specialty Revenue Share</h4>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", 
            gap: "16px", 
            maxHeight: "140px", 
            overflowY: "auto", 
            paddingRight: "6px" 
          }}>
            {specialtyShare.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "30px", color: "#64748B", fontSize: "13px" }}>
                No specialty share statistics to display.
              </div>
            ) : (
              specialtyShare.map((spec, idx) => {
                const colorDetails = getSpecialtyColor(spec.name);
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px", backgroundColor: "#F8FAFC", padding: "10px", borderRadius: "12px", border: "1px solid rgba(6, 15, 45, 0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", fontWeight: "700" }}>
                      <span style={{ color: "#0F172A", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "120px" }} title={spec.name}>{spec.name}</span>
                      <span style={{ color: colorDetails.text }}>
                        ₹{spec.revenue.toLocaleString()}
                      </span>
                    </div>
                    {/* Visual bar & info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ flexGrow: 1, height: "4px", backgroundColor: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                        <div 
                          style={{ 
                            width: `${spec.percentage}%`, 
                            height: "100%", 
                            backgroundColor: colorDetails.text, 
                            borderRadius: "2px"
                          }} 
                        />
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748B" }}>
                        {spec.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Main Filter & Logs Section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 8px 24px rgba(6, 15, 45, 0.01)",
          border: "1px solid rgba(6, 15, 45, 0.04)"
        }}
      >
        {/* Title, Search and Filter Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#060F2D", letterSpacing: "-0.3px", margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                Transactions & Collections Log
              </h3>
              <span style={{ fontSize: "12.5px", color: "#64748B", display: "block", marginTop: "2px" }}>
                Auditing <strong style={{ color: "#3F59FF" }}>{finalPayments.length}</strong> payments under current filters
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {(searchTerm || specialityFilter !== "all" || statusFilter !== "all" || selectedCardFilter !== "all" || startDate || endDate) && (
                <button
                  onClick={clearFilters}
                  style={{
                    backgroundColor: "#F1F5F9",
                    color: "#475569",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "12px",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#E2E8F0"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#F1F5F9"}
                >
                  Clear Filters
                </button>
              )}

              <button
                onClick={handleExportCSV}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#060F2D",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
              >
                <Download size={15} />
                <span>Export Report (CSV)</span>
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search Box */}
            <div style={{ position: "relative", flexGrow: 1, minWidth: "240px" }}>
              <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search patient, email, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "12px",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "13.5px",
                  color: "#0F172A",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#060F2D";
                  e.target.style.boxShadow = "0 0 0 3px rgba(6, 15, 45, 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E2E8F0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Date Range Inputs */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#FFFFFF", border: "1.5px solid #E2E8F0", padding: "2px 8px", borderRadius: "12px" }}>
              <Calendar size={14} color="#64748B" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                style={{ border: "none", outline: "none", fontSize: "13px", color: "#0F172A", cursor: "pointer", padding: "8px" }} 
              />
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                style={{ border: "none", outline: "none", fontSize: "13px", color: "#0F172A", cursor: "pointer", padding: "8px" }} 
              />
            </div>

            {/* Speciality Dropdown Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={14} color="#64748B" />
              <select
                value={specialityFilter}
                onChange={(e) => setSpecialityFilter(e.target.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  color: "#0F172A",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="all">All Specialities</option>
                {specialities.map((spec: any, idx) => (
                  <option key={idx} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status Dropdown Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={14} color="#64748B" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  color: "#0F172A",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table Log */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F1F5F9", color: "#64748B", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.75px" }}>
                <th style={{ padding: "14px 12px" }}>Patient & Details</th>
                <th style={{ padding: "14px 12px" }}>Speciality</th>
                <th style={{ padding: "14px 12px" }}>Date & Time</th>
                <th style={{ padding: "14px 12px" }}>Transaction ID</th>
                <th style={{ padding: "14px 12px", textAlign: "right" }}>Amount</th>
                <th style={{ padding: "14px 12px", textAlign: "center" }}>Status</th>
                <th style={{ padding: "14px 12px", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#64748B", fontSize: "14px" }}>
                    No payment records found matching selected filters.
                  </td>
                </tr>
              ) : (
                currentRows.map((app: any, idx: number) => {
                  const specStyle = getSpecialtyColor(app.speciality || "");
                  
                  return (
                    <tr
                      key={app._id || idx}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        fontSize: "14px",
                        color: "#0F172A",
                        transition: "background-color 0.15s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F8FAFC"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <td style={{ padding: "16px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {/* Circular Initials Avatar */}
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #060F2D 0%, #1A2E69 100%)",
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "700"
                            }}
                          >
                            {getInitials(app.pasentname)}
                          </div>
                          <div>
                            <div style={{ fontWeight: "600", color: "#060F2D" }}>{app.pasentname}</div>
                            <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: "1px" }}>
                              {app.pasentmail} • {app.pasentnumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: specStyle.text,
                            backgroundColor: specStyle.bg,
                            display: "inline-block"
                          }}
                        >
                          {app.speciality}
                        </span>
                      </td>
                      <td style={{ padding: "16px 12px", color: "#64748B" }}>
                        {new Date(app.createdAt || app.appointmenttime).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <code style={{ fontSize: "11.5px", backgroundColor: "#F1F5F9", padding: "4px 8px", borderRadius: "6px", color: "#334155", fontFamily: "monospace", fontWeight: "600" }}>
                            {app.paymentId || "manual_verify"}
                          </code>
                          {app.paymentId && (
                            <button
                              onClick={() => handleCopyId(app.paymentId)}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#94A3B8",
                                borderRadius: "4px",
                                transition: "all 0.2s"
                              }}
                              onMouseOver={(e) => e.currentTarget.style.color = "#060F2D"}
                              onMouseOut={(e) => e.currentTarget.style.color = "#94A3B8"}
                              title="Copy transaction ID"
                            >
                              {copiedId === app.paymentId ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "16px 12px", textAlign: "right", fontWeight: "700", color: "#060F2D", fontFamily: "'Outfit', sans-serif", fontSize: "15px" }}>
                        ₹ {(app.amount || 1000).toLocaleString()}
                      </td>
                      <td style={{ padding: "16px 12px", textAlign: "center" }}>
                        {(() => {
                          const statusStyle = getStatusStyles(app.paymentStatus || "pending");
                          return (
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: "700",
                                color: statusStyle.color,
                                backgroundColor: statusStyle.bg,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                textTransform: "capitalize"
                              }}
                            >
                              <span
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: statusStyle.color,
                                  display: "inline-block",
                                  boxShadow: `0 0 8px ${statusStyle.color}`,
                                  animation: app.paymentStatus === "paid" ? "pulse 1.8s infinite" : "none"
                                }}
                              />
                              {app.paymentStatus || "pending"}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ padding: "16px 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <button
                            onClick={() => setSelectedReceipt(app)}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "rgba(63, 89, 255, 0.08)",
                              color: "#3F59FF",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#3F59FF";
                              e.currentTarget.style.color = "#FFFFFF";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(63, 89, 255, 0.08)";
                              e.currentTarget.style.color = "#3F59FF";
                            }}
                            title="Print Paid Receipt"
                          >
                            <Printer size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {finalPayments.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1.5px solid #F1F5F9",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            {/* Left side: Rows limit dropdown & count */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "600" }}>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0F172A",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span style={{ fontSize: "13px", color: "#64748B", fontWeight: "600" }}>
                Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, finalPayments.length)} of {finalPayments.length} entries
              </span>
            </div>

            {/* Right side: Page navigation buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: currentPage === 1 ? "#F8FAFC" : "#FFFFFF",
                  color: currentPage === 1 ? "#94A3B8" : "#0F172A",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  if (currentPage !== 1) e.currentTarget.style.borderColor = "#3F59FF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                const isCurrent = currentPage === pg;
                return (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      border: isCurrent ? "1.5px solid #3F59FF" : "1.5px solid #E2E8F0",
                      backgroundColor: isCurrent ? "#3F59FF" : "#FFFFFF",
                      color: isCurrent ? "#FFFFFF" : "#0F172A",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      if (!isCurrent) e.currentTarget.style.borderColor = "#3F59FF";
                    }}
                    onMouseOut={(e) => {
                      if (!isCurrent) e.currentTarget.style.borderColor = "#E2E8F0";
                    }}
                  >
                    {pg}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: currentPage === totalPages ? "#F8FAFC" : "#FFFFFF",
                  color: currentPage === totalPages ? "#94A3B8" : "#0F172A",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  if (currentPage !== totalPages) e.currentTarget.style.borderColor = "#3F59FF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Pulse Keyframes Style block & Printable Styles */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        /* Printable Receipt Rules */
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt-modal, #printable-receipt-modal * {
            visibility: visible;
          }
          #printable-receipt-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Invoice / Receipt Modal Overlay */}
      {selectedReceipt && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(6, 15, 45, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          zIndex: 1000,
          overflowY: "auto",
          padding: "40px 16px"
        }}
        onClick={() => setSelectedReceipt(null)}
        className="no-print"
        >
          {/* Modal Container */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "750px",
            boxShadow: "0 24px 60px rgba(6, 15, 45, 0.15)",
            border: "1px solid rgba(6, 15, 45, 0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Actions inside Modal */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 32px",
              borderBottom: "1.5px solid #F1F5F9",
              backgroundColor: "#F8FAFC"
            }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#060F2D" }}>Patient Payment Receipt</span>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#3F59FF",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "#E2E8F0",
                    color: "#64748B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#CBD5E1"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#E2E8F0"}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper Sheet */}
            <div 
              id="printable-receipt-modal"
              style={{
                padding: "48px",
                color: "#0F172A",
                display: "flex",
                flexDirection: "column",
                gap: "36px",
                backgroundColor: "#FFFFFF",
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
                      <Stethoscope size={18} color="#FFFFFF" />
                    </div>
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#060F2D", fontFamily: "'Outfit', sans-serif", display: "block" }}>
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
                  <span style={{ fontSize: "26px", fontWeight: "800", color: "#060F2D", letterSpacing: "-1px", fontFamily: "'Outfit', sans-serif" }}>PAYMENT RECEIPT</span>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
                    Invoice No: <strong style={{ color: "#0F172A" }}>#SSH-{selectedReceipt.paymentId?.substring(0, 8).toUpperCase() || "MANUAL"}</strong>
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

              {/* Bill To & Bill From (Left & Right alignment) */}
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
                    <tr style={{ borderBottom: "1.5px solid #F1F5F9", fontSize: "13.5px" }}>
                      <td style={{ padding: "16px 0" }}>
                        <strong style={{ color: "#060F2D", display: "block" }}>Clinical Consultation Charges</strong>
                        <span style={{ fontSize: "11.5px", color: "#64748B" }}>Standard consult under specialty: {selectedReceipt.speciality}</span>
                      </td>
                      <td style={{ padding: "16px 0", textAlign: "right" }}>₹ {(selectedReceipt.amount || 1000).toLocaleString()}</td>
                      <td style={{ padding: "16px 0", textAlign: "right" }}>₹ 0</td>
                      <td style={{ padding: "16px 0", textAlign: "right", fontWeight: "700" }}>₹ {(selectedReceipt.amount || 1000).toLocaleString()}</td>
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
                    border: "1.5px dashed rgba(63, 89, 255, 0.4)",
                    borderRadius: "8px",
                    color: "#3F59FF",
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

export default PaymentsTab;
