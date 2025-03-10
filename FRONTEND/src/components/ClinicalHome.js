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
            <span className="profile-name">{clinicalStaffName || "Clinical Staff"}</span>
          </div>
        </header>
        <Bill />
      </main>
    </div>
  );
}

export default ClinicalHome;