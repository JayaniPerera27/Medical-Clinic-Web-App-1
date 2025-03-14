import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
<<<<<<< HEAD
  FaHome, FaCalendarAlt,  
=======
  FaHome,FaClock, FaCalendarAlt,  
>>>>>>> f7e57e764d6f620bc3b99a73dbf28cd960ccae6c
   FaPrescriptionBottle, FaCog, FaSignOutAlt 
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const sidebarLinks = [
    { path: "/doctor-home", label: "Dashboard", icon: <FaHome /> },
<<<<<<< HEAD
=======
    { path: "/availability", label: "Availability", icon: <FaClock /> },
>>>>>>> f7e57e764d6f620bc3b99a73dbf28cd960ccae6c
    { path: "/doctor-appointments", label: "Appointments", icon: <FaCalendarAlt /> },
    // { path: "/patients", label: "Patients", icon: <FaUser /> },
    //{ path: "/reports", label: "Reports", icon: <FaFileAlt /> },
    { path: "/prescriptions", label: "Prescriptions", icon: <FaPrescriptionBottle /> },
    { path: "/settings", label: "Settings", icon: <FaCog /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">CarePlus</h2>
      <ul>
        {sidebarLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
