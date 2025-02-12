import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';


const Sidebar = () => {
  const navigate = useNavigate();

  const sidebarLinks = [
    { path: '/doctor-home', label: 'Dashboard' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/patients', label: 'Patients' },
    { path: '/reports', label: 'Reports' },
    { path: '/prescriptions', label: 'Prescriptions' },
    { path: '/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Clear stored token or other user data
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="sidebar">
      <ul>
        {sidebarLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;








