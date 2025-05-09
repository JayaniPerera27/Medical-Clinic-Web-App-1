import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DoctorViewPage.css";
import ClinicalSidebar from "../components/ClinicalSidebar";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3001";

const DoctorViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/doctors/${id}`);
      setDoctor(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching doctor details:", error.response?.data || error.message);
      setError("Failed to fetch doctor details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = () => {
    setDeleteConfirm(true);
  };

  const confirmDeleteDoctor = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/doctors/${id}`);
      toast.success("Doctor deleted successfully");
      navigate("/doctors");
    } catch (error) {
      console.error("Error deleting doctor:", error.response?.data || error.message);
      toast.error("Failed to delete doctor. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="doctor-view-page">
        <ClinicalSidebar />
        <div className="doctor-view-content">
          <div className="loading-spinner">Loading doctor details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-view-page">
        <ClinicalSidebar />
        <div className="doctor-view-content">
          <div className="error-message">{error}</div>
          <Link to="/doctors" className="back-btn">Back to Doctors</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-view-page">
      <ClinicalSidebar />
      <div className="doctor-view-content">
        <div className="doctor-view-header">
          <h2>Doctor Details</h2>
          <div className="doctor-actions">
            <Link to="/doctors" className="back-btn">Back to Doctors</Link>
            <Link to={`/doctors/edit/${id}`} className="edit-btn">Edit Doctor</Link>
            <button className="delete-btn" onClick={handleDeleteDoctor}>
              Delete Doctor
            </button>
          </div>
        </div>

        {doctor && (
          <div className="doctor-details">
            <div className="doctor-info-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">{doctor.fullName || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{doctor.email || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number:</span>
                  <span className="info-value">{doctor.phoneNumber || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="doctor-info-section">
              <h3>Professional Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Specialization:</span>
                  <span className="info-value">{doctor.specialization || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Years of Experience:</span>
                  <span className="info-value">{doctor.yearsOfExperience || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Medical License Number:</span>
                  <span className="info-value">{doctor.medicalLicenseNumber || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Doctor Fee:</span>
                  <span className="info-value">{doctor.doctorFee ? `LKR${doctor.doctorFee}` : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this doctor? This action cannot be undone.</p>
              <div className="delete-modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn" 
                  onClick={confirmDeleteDoctor}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorViewPage;