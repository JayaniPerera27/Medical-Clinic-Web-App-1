import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClinicalSidebar from "../components/ClinicalSidebar";
import "../styles/ClinicalSettings.css";
import { FaUser, FaEnvelope, FaPhone, FaKey, FaCamera } from "react-icons/fa";

function ClinicalSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://medical-clinic-web-app-backend.vercel.app/api/clinical-staff/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaffData(response.data);
        if (response.data.profileImage) {
          setPreviewImage(response.data.profileImage);
        }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for form submission
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      // Use FormData to handle file upload properly
      const formData = new FormData();
      formData.append("fullName", staffData.fullName);
      formData.append("email", staffData.email);
      formData.append("phoneNumber", staffData.phoneNumber);
      
      // Only append the image file if one was selected
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      // Make sure to set the correct headers for FormData
      await axios.put(
        "http://medical-clinic-web-app-backend.vercel.app/api/clinical-staff/settings/update", 
        formData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. " + (error.response?.data?.message || ""));
      setTimeout(() => setError(""), 5000);
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
      await axios.put("http://medical-clinic-web-app-backend.vercel.app/api/clinical-staff/settings/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError("Failed to update password: " + (error.response?.data?.message || ""));
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your profile...</p>
    </div>
  );

  return (
    <div className="clinical-settings-container">
      <ClinicalSidebar handleLogout={handleLogout} />

      <div className="settings-content">
        <h2>My Profile Settings</h2>

        {message && <div className="success-message"><p>{message}</p></div>}
        {error && <div className="error-message"><p>{error}</p></div>}

        <div className="profile-header">
          <div className="profile-image-container">
            <div className="profile-image">
              {previewImage ? (
                <img src={previewImage} alt="Profile" />
              ) : (
                <div className="profile-placeholder">
                  <FaUser />
                </div>
              )}
              <div className="image-upload-overlay" onClick={triggerFileInput}>
                <FaCamera />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            <p className="profile-name">{staffData.fullName || "Clinical Staff"}</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <h3>Profile Information</h3>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <div className="input-icon">
                <FaUser />
              </div>
              <input 
                type="text" 
                name="fullName" 
                placeholder="Full Name"
                value={staffData.fullName} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address"
                value={staffData.email} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <div className="input-icon">
                <FaPhone />
              </div>
              <input 
                type="text" 
                name="phoneNumber" 
                placeholder="Phone Number"
                value={staffData.phoneNumber} 
                onChange={handleChange} 
              />
            </div>
            <button type="submit" className="update-btn">Update Profile</button>
          </form>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <h3>Security</h3>
          </div>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <div className="input-icon">
                <FaKey />
              </div>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <div className="input-icon">
                <FaKey />
              </div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <div className="input-icon">
                <FaKey />
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              />
            </div>
            <button type="submit" className="update-btn">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClinicalSettings;
