import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/PatientsPage.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:8070";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/patients`);
      setPatients(response.data);
      setError("");
    } catch (error) {
      console.error("❌ Error fetching patients:", error.response?.data || error.message);
      setError("Failed to fetch patients. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/patients/${patientId}`);
        // Refresh the patients list after successful deletion
        fetchPatients();
        alert("Patient deleted successfully");
      } catch (error) {
        console.error("❌ Error deleting patient:", error.response?.data || error.message);
        alert("Failed to delete patient. Please try again.");
      }
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const fullname = patient.fullname || ""; 
    return fullname.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="patients-page">
      <ClinicalSidebar />
      <div className="patients-content">
        <div className="patients-header">
          <h2>Patients</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading patients...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="patients-table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>NIC</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.fullname || "N/A"}</td>
                      <td>{patient.email || "N/A"}</td>
                      <td>{patient.phone || "N/A"}</td>
                      <td>{patient.nic || "N/A"}</td>
                      <td>{patient.gender || "N/A"}</td>
                      <td>{patient.address || "N/A"}</td>
                      <td>
                        <Link to={`/patients/${patient._id}`} className="action-btn view-btn">
                          View
                        </Link>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeletePatient(patient._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No patients found.
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

export default PatientsPage;