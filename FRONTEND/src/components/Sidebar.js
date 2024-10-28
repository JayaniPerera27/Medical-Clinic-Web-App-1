import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li>
                    <NavLink to="/doctor-home" activeClassName="active">Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/doctor-home/appointments" activeClassName="active">Appointments</NavLink>
                </li>
                <li>
                    <NavLink to="/doctor-home/patients" activeClassName="active">Patients</NavLink>
                </li>
                <li>
                    <NavLink to="/doctor-home/reports" activeClassName="active">Reports</NavLink>
                </li>
                <li>
                    <NavLink to="/doctor-home/prescriptions" activeClassName="active">Prescriptions</NavLink>
                </li>
                <li>
                    <NavLink to="/doctor-home/settings" activeClassName="active">Settings</NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

