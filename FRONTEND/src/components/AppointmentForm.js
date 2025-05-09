import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClinicalSidebar from '../components/ClinicalSidebar';
import '../styles/AppointmentForm.css';

const API_BASE_URL = "https://medical-clinic-web-app-backend.vercel.app";

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  // Check if editing an existing appointment
  const isEditMode = !!id;

  // Fetch doctors list on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors list');
      }
    };

    fetchDoctors();

    // If in edit mode, fetch the appointment details
    if (isEditMode) {
      fetchAppointmentDetails();
    }
  }, [id]);

  const fetchAppointmentDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments/${id}`);
      const appointmentData = response.data;
      
      // Format date if needed (assuming API returns ISO date string)
      const date = appointmentData.date ? new Date(appointmentData.date).toISOString().split('T')[0] : '';
      
      setFormData({
        patientName: appointmentData.patientName || '',
        patientEmail: appointmentData.patientEmail || '',
        patientPhone: appointmentData.patientPhone || '',
        doctorId: appointmentData.doctorId || '',
        date: date,
        time: appointmentData.time || '',
        reason: appointmentData.reason || '',
        notes: appointmentData.notes || ''
      });
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      setError('Failed to load appointment details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isEditMode) {
        // Update existing appointment
        await axios.put(`${API_BASE_URL}/api/appointments/${id}`, formData);
      } else {
        // Create new appointment
        await axios.post(`${API_BASE_URL}/api/appointments`, formData);
      }
      
      // Redirect to appointments list on success
      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error.response?.data || error.message);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} appointment. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="appointments-page">
        <ClinicalSidebar />
        <div className="form-content">
          <div className="loading-spinner">Loading appointment details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <ClinicalSidebar />
      <div className="form-content">
        <div className="form-header">
          <h2>{isEditMode ? 'Edit Appointment' : 'Create New Appointment'}</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="patientName">Patient Name*</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="patientEmail">Patient Email*</label>
            <input
              type="email"
              id="patientEmail"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="patientPhone">Patient Phone*</label>
            <input
              type="tel"
              id="patientPhone"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="doctorId">Doctor*</label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} ({doctor.specialty})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Time*</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reason">Reason for Visit*</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/appointments')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditMode ? 'Update Appointment' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;