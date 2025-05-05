import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../styles/ClinicalHome.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:8070";

const ClinicalHome = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    clinicalStaff: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    profileImage: null
  });

  useEffect(() => {
    fetchDashboardData();
    fetchRecentPatients();
    fetchUpcomingAppointments();
    fetchNotifications();
    fetchUserProfile();
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/clinical-staff/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUserProfile({
        fullName: response.data.fullName || "Clinical Staff",
        profileImage: response.data.profileImage || null
      });
    } catch (error) {
      console.error("Error fetching user profile:", error.response?.data || error.message);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch number of patients
      const patientsResponse = await axios.get(`${API_BASE_URL}/api/patients/count`);
      const patientsCount = patientsResponse.data.count;

      // Fetch number of doctors
      const doctorsResponse = await axios.get(`${API_BASE_URL}/api/users/count-doctors`);
      const doctorsCount = doctorsResponse.data.count;

      // Fetch number of clinical staff
      const clinicalStaffResponse = await axios.get(`${API_BASE_URL}/api/users/count-clinical-staff`);
      const clinicalStaffCount = clinicalStaffResponse.data.count;

      // Update stats
      setStats({
        patients: patientsCount,
        doctors: doctorsCount,
        clinicalStaff: clinicalStaffCount,
      });
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
    // Navigation functions
    const navigateToNotifications = () => {
      navigate('/notifications');
    };
  
    const navigateToPatients = () => {
      navigate('/patients');
    };
  
    const navigateToAppointments = () => {
      navigate('/appointments');
    };

    const navigateToSettings = () => {
      navigate('/clinical-settings');
    };

  // Mock data functions (replace with actual API calls)
  const fetchRecentPatients = async () => {
    try {
      // Replace with actual API call when available
      // const response = await axios.get(`${API_BASE_URL}/api/patients/recent`);
      // setRecentPatients(response.data);
      
      // Mock data for demonstration
      setRecentPatients([
        { id: 1, name: "John Smith", age: 45, lastVisit: "2025-03-18", status: "Follow-up" },
        { id: 2, name: "Emma Johnson", age: 32, lastVisit: "2025-03-17", status: "New" },
        { id: 3, name: "Michael Brown", age: 58, lastVisit: "2025-03-16", status: "Chronic" },
      ]);
    } catch (error) {
      console.error("Error fetching recent patients:", error);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      // Replace with actual API call when available
      // const response = await axios.get(`${API_BASE_URL}/api/appointments/upcoming`);
      // setUpcomingAppointments(response.data);
      
      // Mock data for demonstration
      setUpcomingAppointments([
        { id: 1, patientName: "Sarah Wilson", time: "09:30 AM", doctor: "Dr. Roberts", type: "Check-up" },
        { id: 2, patientName: "David Lee", time: "11:00 AM", doctor: "Dr. Johnson", type: "Consultation" },
        { id: 3, patientName: "Linda Garcia", time: "02:15 PM", doctor: "Dr. Patel", type: "Follow-up" },
      ]);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Replace with actual API call when available
      // const response = await axios.get(`${API_BASE_URL}/api/notifications`);
      // setNotifications(response.data);
      
      // Mock data for demonstration
      setNotifications([
        { id: 1, message: "Lab results ready for patient #1242", time: "10 min ago", type: "lab" },
        { id: 2, message: "Medication review required for Sarah Wilson", time: "30 min ago", type: "medication" },
        { id: 3, message: "New referral received from Dr. Thompson", time: "1 hour ago", type: "referral" },
      ]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Format current date and time
  const formattedDateTime = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lab': return '🧪';
      case 'medication': return '💊';
      case 'referral': return '📋';
      default: return '🔔';
    }
  };

  return (
    <div className="clinical-home-page">
      <ClinicalSidebar />
      <div className="clinical-home-content">
        <div className="dashboard-header">
          <div className="header-title-section">
            <h2>Clinical Dashboard</h2>
            <h3>Welcome to the Clinical Management System</h3>
            <p className="current-datetime">{formattedDateTime}</p>
          </div>
          <div className="header-actions">
            <div className="user-profile-section" onClick={navigateToSettings}>
              <div className="user-profile-img">
                {userProfile.profileImage ? (
                  <img src={userProfile.profileImage} alt="Profile" />
                ) : (
                  <div className="profile-placeholder">👤</div>
                )}
              </div>
              <div className="user-name">
                {userProfile.fullName}
              </div>
            </div>
            <button className="action-button refresh-button" onClick={fetchDashboardData}>
              <span className="button-icon">🔄</span> Refresh Data
            </button>
            {/* <button className="action-button help-button">
              <span className="button-icon">❓</span> Help
            </button> */}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon patients-icon">👥</div>
                <div className="stat-details">
                  <h3>{stats.patients}</h3>
                  <p>Total Patients</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon doctors-icon">👨‍⚕️</div>
                <div className="stat-details">
                  <h3>{stats.doctors}</h3>
                  <p>Doctors</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon clinical-staff-icon">👩‍⚕️</div>
                <div className="stat-details">
                  <h3>{stats.clinicalStaff}</h3>
                  <p>Clinical Staff</p>
                </div>
              </div>
              {/* <div className="stat-card">
                <div className="stat-icon appointments-icon">📅</div>
                <div className="stat-details">
                  <h3>{upcomingAppointments.length}</h3>
                  <p>Appointments</p>
                </div>
              </div> */}
            </div>

            <div className="dashboard-content">
              <div className="dashboard-section">
                <h3 className="section-title">Recent Patients</h3>
                <div className="patients-list">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Last Visit</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.map(patient => (
                        <tr key={patient.id}>
                          <td>{patient.name}</td>
                          <td>{patient.age}</td>
                          <td>{patient.lastVisit}</td>
                          <td>
                            <span className={`status-badge status-${patient.status.toLowerCase()}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td>
                            <button className="view-button">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="view-all-link">
                    <a href="/patients">View All Patients →</a>
                  </div>
                </div>
              </div>
{/* 
              <div className="dashboard-section">
                <h3 className="section-title">Upcoming Appointments</h3>
                <div className="appointments-list">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-time">{appointment.time}</div>
                      <div className="appointment-details">
                        <h4>{appointment.patientName}</h4>
                        <p>{appointment.doctor}</p>
                        <span className="appointment-type">{appointment.type}</span>
                      </div>
                      <div className="appointment-actions">
                        <button className="action-button">Details</button>
                      </div>
                    </div>
                  ))}
                  <div className="view-all-link">
                    <a href="/appointments">Manage Appointments →</a>
                  </div>
                </div>
              </div> */}

              {/* <div className="dashboard-section">
                <h3 className="section-title">Notifications</h3>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                  <div className="view-all-link">
                    <a href="/notifications">View All Notifications →</a>
                  </div>
                </div>
              </div> */}
            </div>

            {/* <div className="quick-actions">
              <h3 className="section-title">Quick Actions</h3>
              <div className="quick-action-buttons">
                <button className="quick-action-button">
                  <span className="button-icon">➕</span>
                  <span>Add Patient</span>
                </button>
                <button className="quick-action-button">
                  <span className="button-icon">📅</span>
                  <span>Schedule Appointment</span>
                </button>
                <button className="quick-action-button">
                  <span className="button-icon">🗒️</span>
                  <span>Patient Records</span>
                </button>
                <button className="quick-action-button">
                  <span className="button-icon">📊</span>
                  <span>Reports</span>
                </button>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default ClinicalHome;