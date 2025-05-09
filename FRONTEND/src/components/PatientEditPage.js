import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/PatientEditPage.css"; // You'll need to create this CSS file
import ClinicalSidebar from "./ClinicalSidebar";

//const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://medical-clinic-web-app-backend.vercel.app";

const PatientEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Patient form data
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    nic: "",
    gender: "",
    address: ""
  });

  // Debug the ID parameter
  console.log("Patient ID from URL for edit:", id);

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      console.log("Attempting to fetch patient with ID:", id);
      
      // First try the direct endpoint
      try {
        const response = await axios.get(`${API_BASE_URL}/api/patients/${id}`);
        console.log("Direct patient fetch successful:", response.data);
        populateFormData(response.data);
        setError("");
        setLoading(false);
        return;
      } catch (directError) {
        console.log("Direct patient fetch failed, trying alternative approach");
        
        // If direct endpoint fails, fetch all patients and filter
        const allPatientsResponse = await axios.get(`${API_BASE_URL}/api/patients`);
        const patientData = allPatientsResponse.data.find(p => p._id === id);
        
        if (patientData) {
          console.log("Found patient in list:", patientData);
          populateFormData(patientData);
          setError("");
        } else {
          console.error("Patient not found in patients list");
          setError("Patient not found. Please check the patient ID.");
        }
      }
    } catch (error) {
      console.error("❌ Error fetching patient details:", error.response?.data || error.message);
      setError("Failed to fetch patient details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (patient) => {
    setFormData({
      fullname: patient.fullname || "",
      email: patient.email || "",
      phone: patient.phone || "",
      nic: patient.nic || "",
      gender: patient.gender || "",
      address: patient.address || ""
      // Add any other fields that your patient model has
    });
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
    setSaving(true);
    
    try {
      console.log("Updating patient with data:", formData);
      
      // First try direct update endpoint
      try {
        await axios.put(`${API_BASE_URL}/api/patients/${id}`, formData);
        alert("Patient updated successfully");
        navigate(`/patients/${id}`); // Redirect to patient view page
      } catch (directError) {
        console.error("Direct update failed, trying alternative approach:", directError);
        
        // If your API doesn't support PUT, you might try PATCH
        try {
          await axios.patch(`${API_BASE_URL}/api/patients/${id}`, formData);
          alert("Patient updated successfully");
          navigate(`/patients/${id}`); // Redirect to patient view page
        } catch (patchError) {
          console.error("Patch method also failed:", patchError);
          alert("Update operation failed. The API endpoint may not be properly configured.");
        }
      }
    } catch (error) {
      console.error("❌ Error updating patient:", error.response?.data || error.message);
      alert("Failed to update patient. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="patient-edit-page">
        <ClinicalSidebar />
        <div className="patient-edit-content">
          <div className="loading-spinner">Loading patient details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-edit-page">
        <ClinicalSidebar />
        <div className="patient-edit-content">
          <div className="error-message">
            {error}
            <p className="api-debug-info">
              Attempted to fetch: {`${API_BASE_URL}/api/patients/${id}`}
            </p>
          </div>
          <Link to="/patients" className="back-btn">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-edit-page">
      <ClinicalSidebar />
      <div className="patient-edit-content">
        <div className="patient-edit-header">
          <h2>Edit Patient Information</h2>
          <div className="patient-actions">
            <Link to={`/patients/${id}`} className="back-btn">
              Cancel
            </Link>
          </div>
        </div>

        <div className="patient-edit-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nic">NIC</label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate(`/patients/${id}`)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientEditPage;