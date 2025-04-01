import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/DoctorEditPage.css";
import ClinicalSidebar from "../components/ClinicalSidebar";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:8070";

const DoctorEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    yearsOfExperience: "",
    medicalLicenseNumber: "",
    doctorFee: ""
  });

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/doctors/${id}`);
      const doctorData = response.data;
      
      setFormData({
        fullName: doctorData.fullName || "",
        email: doctorData.email || "",
        phoneNumber: doctorData.phoneNumber || "",
        specialization: doctorData.specialization || "",
        yearsOfExperience: doctorData.yearsOfExperience || "",
        medicalLicenseNumber: doctorData.medicalLicenseNumber || "",
        doctorFee: doctorData.doctorFee || ""
      });
      
      setError("");
    } catch (error) {
      console.error("Error fetching doctor details:", error.response?.data || error.message);
      setError("Failed to fetch doctor details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.put(`${API_BASE_URL}/api/users/doctors/${id}`, formData);
      toast.success("Doctor updated successfully");
      navigate(`/doctors/${id}`);
    } catch (error) {
      console.error("Error updating doctor:", error.response?.data || error.message);
      toast.error("Failed to update doctor. Please try again.");
      setError("Failed to update doctor. Please check your inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="doctor-edit-page">
        <ClinicalSidebar />
        <div className="doctor-edit-content">
          <div className="loading-spinner">Loading doctor details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-edit-page">
      <ClinicalSidebar />
      <div className="doctor-edit-content">
        <div className="doctor-edit-header">
          <h2>Edit Doctor</h2>
          <Link to={`/doctors/${id}`} className="back-btn">Back to Doctor</Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Information</h3>
            
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="yearsOfExperience">Years of Experience</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="medicalLicenseNumber">Medical License Number</label>
              <input
                type="text"
                id="medicalLicenseNumber"
                name="medicalLicenseNumber"
                value={formData.medicalLicenseNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="doctorFee">Doctor Fee (LKR)</label>
              <input
                type="number"
                id="doctorFee"
                name="doctorFee"
                value={formData.doctorFee}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(`/doctors/${id}`)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorEditPage;