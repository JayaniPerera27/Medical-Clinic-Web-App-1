import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/ClinicalSidebar.css";
import OIP from "../assets/OIP.jpg";

function ClinicalSidebar({ handleLogout }) {
  const location = useLocation(); // Get the current pathname

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={OIP} alt="Logo" className="sidebar-logo" />
        <div className="sidebar-title">CarePlus</div>
      </div>

      {/* Sidebar Links */}
      <div className="sidebar-content">
        <ul className="clinical-sidebar-links">
          {[
            { path: "/clinical-home", label: "Billing System" },
            { path: "/bill-history", label: "Billing History" },
            { path: "/clinical-reports", label: "Reports" },
            { path: "/clinical-settings", label: "Settings" },

          ].map((link) => (
            <li key={link.path} className="clinical-sidebar-item">
              <NavLink
                to={link.path}
                className={`clinical-sidebar-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
              >
                <span className="link-label">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-label">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default ClinicalSidebar;
