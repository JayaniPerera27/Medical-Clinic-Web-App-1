import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ClinicalHome.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:8070";

const ClinicalHome = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    clinicalStaff: 0, // Add clinical staff count
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  return (
    <div className="clinical-home-page">
      <ClinicalSidebar />
      <div className="clinical-home-content">
        <div className="dashboard-header">
          <h2>Clinical Dashboard</h2>
          <h3>Welcome to the Clinical Management System</h3>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading dashboard data...</div>
        ) : (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalHome;