import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ClinicalHome.css";
import axios from "axios";
import Bill from "./Bill";
import ClinicalSidebar from "./ClinicalSidebar";

function ClinicalHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clinicalStaffName, setClinicalStaffName] = useState("");
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    setClinicalStaffName(tokenPayload.name);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="clinical-home-container">
      <ClinicalSidebar handleLogout={handleLogout} location={location} />
      
      <main className="main-content">
        <header className="header">
          <div className="header-title">Billing System</div>
          
          <div className="profile">
            <div className="notification-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {notifications > 0 && (
                <span className="notification-badge">
                  {notifications}
                </span>
              )}
            </div>
            
            <div className="profile-container">
              <div className="profile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="profile-name">{clinicalStaffName || "Clinical Staff"}</span>
            </div>
            
            <button className="logout-button" onClick={handleLogout}>
              <svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </header>
        
        <div className="content-card">
          <Bill />
        </div>
      </main>
    </div>
  );
}

export default ClinicalHome;