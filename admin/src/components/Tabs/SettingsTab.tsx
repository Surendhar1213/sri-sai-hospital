import React from "react";

interface SettingsForm {
  hospitalName: string;
  consultationFee: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  googleIntegration: boolean;
  razorpayKey: string;
  razorpaySecret: string;
}

interface SettingsTabProps {
  settingsForm: SettingsForm;
  setSettingsForm: React.Dispatch<React.SetStateAction<SettingsForm>>;
  onSubmit: (e: React.FormEvent) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  settingsForm,
  setSettingsForm,
  onSubmit,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(6, 15, 45, 0.02)",
        border: "1px solid rgba(6, 15, 45, 0.04)",
        padding: "40px",
        maxWidth: "850px",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#060F2D" }}>
          Hospital Configurations & Gateway setup
        </h3>
        <span style={{ fontSize: "12px", color: "#616161", display: "block", marginTop: "2px" }}>
          Manage hospital billing charges, Virtual consultation setups, and Payment APIs.
        </span>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
              Hospital Display Name
            </label>
            <input
              type="text"
              value={settingsForm.hospitalName}
              onChange={(e) => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#060F2D", display: "block", marginBottom: "8px" }}>
              Default Consultation Fee (INR)
            </label>
            <input
              type="number"
              value={settingsForm.consultationFee}
              onChange={(e) => setSettingsForm({ ...settingsForm, consultationFee: e.target.value })}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Google Sync Block */}
        <div
          style={{
            padding: "24px",
            backgroundColor: "#F2F3FE",
            borderRadius: "14px",
            border: "1.5px solid rgba(74, 101, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#060F2D" }}>
              Google Calendar & Virtual Meet Integration
            </h4>
            <p style={{ fontSize: "12px", color: "#616161", marginTop: "4px", lineHeight: "1.4" }}>
              Enable automatic Calendar sync and Google Meet url links creation upon success payment bookings.
            </p>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px" }}>
            <input
              type="checkbox"
              checked={settingsForm.googleIntegration}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, googleIntegration: e.target.checked })
              }
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settingsForm.googleIntegration ? "#4A65FF" : "#cbd5e1",
                borderRadius: "34px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  height: "18px",
                  width: "18px",
                  left: settingsForm.googleIntegration ? "26px" : "4px",
                  bottom: "4px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  transition: "0.3s",
                }}
              ></span>
            </span>
          </label>
        </div>

        {/* Razorpay gateway settings */}
        <div
          style={{
            padding: "24px",
            backgroundColor: "#F2F3FE",
            borderRadius: "14px",
            border: "1.5px solid rgba(74, 101, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#060F2D" }}>
            Razorpay Checkout Integration Setup
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#616161", display: "block", marginBottom: "6px" }}>
                Razorpay API Key ID
              </label>
              <input
                type="text"
                placeholder="rzp_test_..."
                value={settingsForm.razorpayKey}
                onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKey: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#616161", display: "block", marginBottom: "6px" }}>
                Razorpay Key Secret
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={settingsForm.razorpaySecret}
                onChange={(e) => setSettingsForm({ ...settingsForm, razorpaySecret: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: "fit-content",
            padding: "14px 36px",
            backgroundColor: "#4A65FF",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "14.5px",
            boxShadow: "0 6px 20px rgba(74, 101, 255, 0.2)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Save Settings Setup
        </button>
      </form>
    </div>
  );
};

export default SettingsTab;
