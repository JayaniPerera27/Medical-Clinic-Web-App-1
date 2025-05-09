import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ClinicalSidebar from './ClinicalSidebar';
import '../styles/AppointmentDetails.css';

const API_BASE_URL = "https://medical-clinic-web-app-backend.vercel.app";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments/${id}`);
      setAppointment(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      setError('Failed to load appointment details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/appointments/${id}`);
        navigate('/appointments');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        setError('Failed to delete the appointment. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <ClinicalSidebar />
        <div className="details-content">
          <div className="loading-spinner">Loading appointment details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-page">
        <ClinicalSidebar />
        <div className="details-content">
          <div className="error-message">{error}</div>
          <Link to="/appointments" className="back-link">Back to Appointments</Link>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="appointments-page">
        <ClinicalSidebar />
        <div className="details-content">
          <div className="not-found-message">Appointment not found.</div>
          <Link to="/appointments" className="back-link">Back to Appointments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <ClinicalSidebar />
      <div className="details-content">
        <div className="details-header">
          <h2>Appointment Details</h2>
          <div className="header-actions">
            <Link to={`/appointments/edit/${id}`} className="edit-btn">Edit Appointment</Link>
            <button onClick={handleDeleteAppointment} className="delete-btn">Delete Appointment</button>
          </div>
        </div>

        <div className="appointment-card">
          <div className="card-section">
            <h3>Patient Information</h3>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{appointment.patientName || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{appointment.patientEmail || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{appointment.patientPhone || 'N/A'}</span>
            </div>
          </div>

          <div className="card-section">
            <h3>Appointment Details</h3>
            <div className="info-row">
              <span className="info-label">Doctor:</span>
              <span className="info-value">{appointment.doctorName || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">{appointment.date || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Time:</span>
              <span className="info-value">{appointment.time || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Reason:</span>
              <span className="info-value">{appointment.reason || 'N/A'}</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="card-section">
              <h3>Additional Notes</h3>
              <div className="notes-content">
                {appointment.notes}
              </div>
            </div>
          )}

          <div className="card-section">
            <h3>Status Information</h3>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className={`status-badge status-${appointment.status?.toLowerCase() || 'scheduled'}`}>
                {appointment.status || 'Scheduled'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Created:</span>
              <span className="info-value">
                {appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">
                {appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="details-footer">
          <Link to="/appointments" className="back-link">Back to Appointments</Link>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;