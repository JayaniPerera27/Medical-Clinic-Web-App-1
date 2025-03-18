import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClinicalSidebar from "../components/ClinicalSidebar";
import "../styles/ClinicalSettings.css";

function ClinicalSettings() {
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8070/api/clinical-staff/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaffData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load clinical staff data.");
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    setStaffData({ ...staffData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8070/api/clinical-staff/settings/update", staffData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.alert("✅ Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile.");
      window.alert("❌ Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8070/api/clinical-staff/settings/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setError("Failed to update password.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="clinical-settings-container">
      <ClinicalSidebar handleLogout={handleLogout} />

      <div className="settings-content">
        <h2>Clinical Staff Settings</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="clinicalsettings-section">
          <h3>Profile Information</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={staffData.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={staffData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phoneNumber" value={staffData.phoneNumber} onChange={handleChange} />
            </div>
            <button type="submit">Update Profile</button>
          </form>
        </div>

        <div className="clinicalsettings-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              />
            </div>
            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClinicalSettings;