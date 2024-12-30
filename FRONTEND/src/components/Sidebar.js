/*import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const preventNavigation = (e, targetPath) => {
  if (window.location.pathname === targetPath) {
    e.preventDefault(); // Prevent navigation if already on the target page
  }
};

const Sidebar = () => {
  const sidebarLinks = [
    { path: '/doctor-home', label: 'Dashboard' },
    { path: '/doctor-home/appointments', label: 'Appointments' },
    { path: '/doctor-home/patients', label: 'Patients' },
    { path: '/doctor-home/reports', label: 'Reports' },
    { path: '/doctor-home/prescriptions', label: 'Prescriptions' },
    { path: '/doctor-home/settings', label: 'Settings' },
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
              onClick={(e) => preventNavigation(e, link.path)}
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

export default Sidebar;








