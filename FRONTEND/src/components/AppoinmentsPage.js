import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AppointmentsPage.css"; // Create this CSS file for styling
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:3001";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments`);
      setAppointments(response.data);
      setError("");
    } catch (error) {
      console.error("❌ Error fetching appointments:", error.response?.data || error.message);
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = appointment.patientName || "";
    const doctorName = appointment.doctorName || "";
    const date = appointment.date || "";
    const time = appointment.time || "";

    return (
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      time.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="appointments-page">
      <ClinicalSidebar />
      <div className="appointments-content">
        <div className="appointments-header">
          <h2>Appointments</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by patient name, doctor name, date, or time..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Link to="/appointments/new" className="add-appointment-btn">
            Add New Appointment
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading appointments...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Patient Email</th>
                  <th>Patient Phone</th>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patientName || "N/A"}</td>
                      <td>{appointment.patientEmail || "N/A"}</td>
                      <td>{appointment.patientPhone || "N/A"}</td>
                      <td>{appointment.doctorName || "N/A"}</td>
                      <td>{appointment.date || "N/A"}</td>
                      <td>{appointment.time || "N/A"}</td>
                      <td>
                        <Link to={`/appointments/${appointment._id}`} className="action-btn view-btn">
                          View
                        </Link>
                        <Link to={`/appointments/edit/${appointment._id}`} className="action-btn edit-btn">
                          Edit
                        </Link>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteAppointment(appointment._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;