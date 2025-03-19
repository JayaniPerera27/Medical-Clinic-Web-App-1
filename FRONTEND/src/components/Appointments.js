import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Appointments.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:8070";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    status: "Scheduled"
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments`);
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err.response?.data || err.message);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/doctors`);
      setDoctors(response.data);
    } catch (err) {
      console.error("❌ Error fetching doctors:", err.response?.data || err.message);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/patients`);
      setPatients(response.data);
    } catch (err) {
      console.error("❌ Error fetching patients:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: value
    });
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    
    try {
      // Find selected doctor and patient objects
      const selectedDoctor = doctors.find(doctor => doctor._id === newAppointment.doctorId);
      const selectedPatient = patients.find(patient => patient._id === newAppointment.patientId);
      
      // Create appointment with names
      const appointmentData = {
        ...newAppointment,
        doctorName: selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : "Unknown Doctor",
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "Unknown Patient",
        patientUsername: selectedPatient ? selectedPatient.username : ""
      };
      
      await axios.post(`${API_BASE_URL}/api/appointments`, appointmentData);
      fetchAppointments();
      setShowAddModal(false);
      
      // Reset form
      setNewAppointment({
        patientId: "",
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        status: "Scheduled"
      });
      
    } catch (err) {
      console.error("❌ Error adding appointment:", err.response?.data || err.message);
      alert("Failed to create appointment. Please try again.");
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, { status: newStatus });
      
      // Update local state to reflect the change
      setAppointments(appointments.map(appointment => 
        appointment._id === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      ));
      
    } catch (err) {
      console.error("❌ Error updating appointment status:", err.response?.data || err.message);
      alert("Failed to update appointment status. Please try again.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/appointments/${appointmentId}`);
        setAppointments(appointments.filter(appointment => appointment._id !== appointmentId));
      } catch (err) {
        console.error("❌ Error deleting appointment:", err.response?.data || err.message);
        alert("Failed to delete appointment. Please try again.");
      }
    }
  };

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === "all" || appointment.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="appointments-page">
      <ClinicalSidebar />
      <div className="appointments-content">
        <div className="appointments-header">
          <h2>Appointments Management</h2>
          <button className="add-appointment-btn" onClick={() => setShowAddModal(true)}>
            New Appointment
          </button>
        </div>

        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search patients, doctors, or reasons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filter">
            <label>Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading appointments...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="appointments-table-container">
            {filteredAppointments.length > 0 ? (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.doctorName}</td>
                      <td>{formatDate(appointment.date)}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.reason}</td>
                      <td>
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                          className={`status-select status-${appointment.status.toLowerCase().replace(' ', '-')}`}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="No Show">No Show</option>
                        </select>
                      </td>
                      <td className="action-buttons">
                        {appointment.status !== "Completed" && appointment.status !== "Cancelled" && (
                          <Link 
                            to={`/new-prescription/${appointment.patientUsername}`} 
                            className="prescription-btn"
                            title="Create Prescription"
                          >
                            📝
                          </Link>
                        )}
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteAppointment(appointment._id)}
                          title="Delete Appointment"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-appointments">
                <p>No appointments found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Add Appointment Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="appointment-modal">
              <div className="modal-header">
                <h3>Schedule New Appointment</h3>
                <button className="close-modal" onClick={() => setShowAddModal(false)}>✕</button>
              </div>
              <form onSubmit={handleAddAppointment}>
                <div className="form-group">
                  <label>Patient:</label>
                  <select 
                    name="patientId"
                    value={newAppointment.patientId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Doctor:</label>
                  <select 
                    name="doctorId"
                    value={newAppointment.doctorId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={newAppointment.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Time:</label>
                  <input
                    type="time"
                    name="time"
                    value={newAppointment.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Reason for Visit:</label>
                  <textarea
                    name="reason"
                    value={newAppointment.reason}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;