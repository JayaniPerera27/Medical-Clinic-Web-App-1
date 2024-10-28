
/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorHome.css';

function DoctorHome() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/doctor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate('/');
          } else {
            throw new Error('Failed to fetch dashboard data');
          }
        } else {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, API_BASE_URL]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div className="doctor-home-container">
      <div className="sidebar">
        <h2>CarePlus</h2>
        <ul>
          <li onClick={() => handleNavigation('/doctor-home')}>Dashboard</li>
          <li onClick={() => handleNavigation('/appointments')}>Appointments</li>
          <li onClick={() => handleNavigation('/patients')}>Patients</li>
          <li onClick={() => handleNavigation('/reports')}>Reports</li>
          <li onClick={() => handleNavigation('/prescriptions')}>Prescriptions</li>
          <li onClick={() => handleNavigation('/settings')}>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <div className="dashboard-content">
        <h1>Welcome, Dr. Perera</h1>
        <p>Today is {today}</p>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div>
            <p className="error">{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="dashboard-stats">
            <div className="stat-box">
              <span>{dashboardData.totalAppointments}</span>
              <p>Total Appointments</p>
            </div>
            <div className="stat-box">
              <span>{dashboardData.totalPatients}</span>
              <p>Total Patients</p>
            </div>
            <div className="stat-box">
              <span>{dashboardData.totalReports}</span>
              <p>Total Reports</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorHome;*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorHome.css';
import doctorPhoto from '../assets/doctorphoto.jpeg'; // Import the doctor photo

function DoctorHome() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/doctor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate('/');
          } else {
            throw new Error('Failed to fetch dashboard data');
          }
        } else {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, API_BASE_URL]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div className="doctor-home-container">
      <div className="sidebar">
        <h2>CarePlus</h2>
        <ul>
          <li onClick={() => handleNavigation('/doctor-home')}>Dashboard</li>
          <li onClick={() => handleNavigation('/appointments')}>Appointments</li>
          <li onClick={() => handleNavigation('/patients')}>Patients</li>
          <li onClick={() => handleNavigation('/reports')}>Reports</li>
          <li onClick={() => handleNavigation('/prescriptions')}>Prescriptions</li>
          <li onClick={() => handleNavigation('/settings')}>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <div className="dashboard-content">
        <h1>Welcome, Dr. Perera</h1>
        <p>Today is {today}</p>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div>
            <p className="error">{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="dashboard-stats">
            <div className="stat-box">
              <span>{dashboardData.totalAppointments}</span>
              <p>Total Appointments</p>
            </div>
            <div className="stat-box">
              <span>{dashboardData.totalPatients}</span>
              <p>Total Patients</p>
            </div>
            <div className="stat-box">
              <span>{dashboardData.totalReports}</span>
              <p>Total Reports</p>
            </div>
          </div>
        )}
      </div>
      <div className="doctor-photo">
        <img src={doctorPhoto} alt="Doctor" />
      </div>
    </div>
  );
}

export default DoctorHome;






