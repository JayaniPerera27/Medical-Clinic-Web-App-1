import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorHome.css';
import doctorPhoto from '../assets/doctorphoto.jpeg';
import Sidebar from './Sidebar';

function DoctorHome() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalReports: 0,
  });
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        setDoctorName(tokenPayload.name);

        const response = await fetch(`${API_BASE_URL}/api/doctor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
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
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, API_BASE_URL]);

  return (
    <div className="doctor-home-container">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Welcome, Dr. {doctorName || 'Doctor'}</h1>
        <p>Today is {new Date().toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric'
        })}</p>

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

export default DoctorHome;
