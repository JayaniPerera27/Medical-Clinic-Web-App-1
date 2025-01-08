/*import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const sidebarLinks = [
    { path: '/doctor-home', label: 'Dashboard' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/patients', label: 'Patients' },
    { path: '/reports', label: 'Reports' },
    { path: '/prescriptions', label: 'Prescriptions' },
    { path: '/settings', label: 'Settings' },
  ];

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
      </ul>
    </div>
  );
};

export default Sidebar;*/

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const sidebarLinks = [
    { path: '/doctor-home', label: 'Dashboard' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/patients', label: 'Patients' },
    { path: '/reports', label: 'Reports' },
    { path: '/prescriptions', label: 'Prescriptions' },
    { path: '/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    // Clear any user-related data (e.g., tokens, user info)
    localStorage.removeItem('userToken'); // Example: clearing stored token
    // Redirect to login page
    navigate('/login');
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
      </ul>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;









