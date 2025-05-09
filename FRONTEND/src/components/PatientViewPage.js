import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PatientViewPage.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

//const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://medical-clinic-web-app-backend.vercel.app";

const PatientViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Debug the ID parameter
  console.log("Patient ID from URL:", id);

  // Modified to fetch from patients list if single patient endpoint fails
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
        setPatient(response.data);
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
          setPatient(patientData);
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

  const generatePatientReport = () => {
    setGeneratingReport(true);
    try {
      // This would be your API endpoint to generate a report
      // For now, we'll simulate it by creating a structured report from the patient data
      const patientReport = {
        patientDetails: patient,
        generatedAt: new Date().toLocaleString(),
        summary: `Medical summary for ${patient.fullname}`,
        // You would typically fetch more data like appointments, medical history, etc.
      };
      
      setReportData(patientReport);
    } catch (error) {
      console.error("❌ Error generating report:", error);
      alert("Failed to generate patient report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDeletePatient = async () => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        // First try direct delete endpoint
        try {
          await axios.delete(`${API_BASE_URL}/api/patients/${id}`);
          alert("Patient deleted successfully");
          navigate("/patients"); // Redirect to patients list
        } catch (directError) {
          console.error("Direct delete failed, check your API:", directError);
          alert("Delete operation failed. The API endpoint may not be properly configured.");
        }
      } catch (error) {
        console.error("❌ Error deleting patient:", error.response?.data || error.message);
        alert("Failed to delete patient. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="patient-view-page">
        <ClinicalSidebar />
        <div className="patient-view-content">
          <div className="loading-spinner">Loading patient details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-view-page">
        <ClinicalSidebar />
        <div className="patient-view-content">
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

  if (!patient) {
    return (
      <div className="patient-view-page">
        <ClinicalSidebar />
        <div className="patient-view-content">
          <div className="error-message">
            Patient not found
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
    <div className="patient-view-page">
      <ClinicalSidebar />
      <div className="patient-view-content">
        <div className="patient-view-header">
          <h2>Patient Information</h2>
          <div className="patient-actions">
            <Link to={`/patients/edit/${id}`} className="edit-patient-btn">
              Edit Patient
            </Link>
            <button 
              className="delete-patient-btn"
              onClick={handleDeletePatient}
            >
              Delete Patient
            </button>
            <button 
              className="generate-report-btn"
              onClick={generatePatientReport}
              disabled={generatingReport}
            >
              {generatingReport ? "Generating..." : "Generate Report"}
            </button>
            <Link to="/patients" className="back-btn">
              Back to Patients
            </Link>
          </div>
        </div>

        <div className="patient-details-card">
          <h3>{patient.fullname || "N/A"}</h3>
          <div className="patient-details-grid">
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{patient.email || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{patient.phone || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">NIC:</span>
              <span className="detail-value">{patient.nic || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{patient.gender || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{patient.address || "N/A"}</span>
            </div>
            {/* Add additional patient details here as needed */}
          </div>
        </div>

        {reportData && (
          <div className="patient-report-section">
            <h3>Patient Report</h3>
            <div className="report-generated-time">
              Generated: {reportData.generatedAt}
            </div>
            <div className="report-content">
              <h4>Patient Summary</h4>
              <p>{reportData.summary}</p>
              
              <h4>Personal Information</h4>
              <div className="report-details">
                <div className="report-detail-item">
                  <span className="report-detail-label">Full Name:</span>
                  <span className="report-detail-value">{patient.fullname || "N/A"}</span>
                </div>
                <div className="report-detail-item">
                  <span className="report-detail-label">Email:</span>
                  <span className="report-detail-value">{patient.email || "N/A"}</span>
                </div>
                <div className="report-detail-item">
                  <span className="report-detail-label">Phone:</span>
                  <span className="report-detail-value">{patient.phone || "N/A"}</span>
                </div>
                <div className="report-detail-item">
                  <span className="report-detail-label">NIC:</span>
                  <span className="report-detail-value">{patient.nic || "N/A"}</span>
                </div>
                <div className="report-detail-item">
                  <span className="report-detail-label">Gender:</span>
                  <span className="report-detail-value">{patient.gender || "N/A"}</span>
                </div>
                <div className="report-detail-item">
                  <span className="report-detail-label">Address:</span>
                  <span className="report-detail-value">{patient.address || "N/A"}</span>
                </div>
              </div>
              
              <div className="report-actions">
                <button className="print-report-btn" onClick={() => window.print()}>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientViewPage;