import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/ClinicalSidebar.css";
import OIP from "../assets/OIP.jpg";

function ClinicalSidebar({ handleLogout }) {
  const navItems = [
    { 
      path: "/clinical-home", 
      label: "Billing System",
      icon: <span className="icon">💳</span> 
    },
    { 
      path: "/bill-history", 
      label: "Billing History",
      icon: <span className="icon">📜</span> 
    },
    { 
      path: "/clinical-settings", 
      label: "Settings",
      icon: <span className="icon">⚙️</span> 
    },
  ];

  return (
    <aside className="clinical-sidebar">
      <div className="clinical-sidebar-header">
        
        <div className="sidebar-title">CarePlus</div>
      </div>

      <nav>
        <ul className="clinical-sidebar-menu">
          {navItems.map((item) => (
            <li key={item.path} className="clinical-sidebar-item">
              <NavLink to={item.path} className="clinical-sidebar-link">
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        🚪 Log Out
      </button>
    </aside>
  );
}

export default ClinicalSidebar;
