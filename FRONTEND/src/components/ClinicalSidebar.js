import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/ClinicalSidebar.css";

const ClinicalSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userName, setUserName] = useState("Admin User");
  const [userRole, setUserRole] = useState("Clinic Administrator");
  const location = useLocation();
  
  useEffect(() => {
    // Check if user info exists in localStorage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const userInfo = JSON.parse(storedUser);
      setUserName(userInfo.name || "Admin User");
      setUserRole(userInfo.role || "Clinic Administrator");
    }
    
    // Handle responsive behavior
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button>
      
      <div className={`clinical-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">C</div>
          <h1 className="sidebar-title">Clinical System</h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/dashboard" className={getNavLinkClass("/dashboard")}>
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/appointments" className={getNavLinkClass("/appointments")}>
                <span className="nav-icon">📅</span>
                Appointments
              </Link>
            </li> */}
            <li className="nav-item">
              <Link to="/patients" className={getNavLinkClass("/patients")}>
                <span className="nav-icon">👥</span>
                Patients
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/doctors" className={getNavLinkClass("/doctors")}>
                <span className="nav-icon">👨‍⚕️</span>
                Doctors
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/bill" className={getNavLinkClass("/bill")}>
                <span className="nav-icon">💰</span>
                Billing
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/billing-history" className={getNavLinkClass("/reports")}>
                <span className="nav-icon">📈</span>
                Billing History
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clinical-settings" className={getNavLinkClass("/clinical-settings")}>
                <span className="nav-icon">⚙️</span>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {userName.charAt(0)}
            </div>
            <div className="user-details">
              <p className="user-name">{userName}</p>
              <p className="user-role">{userRole}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ClinicalSidebar;