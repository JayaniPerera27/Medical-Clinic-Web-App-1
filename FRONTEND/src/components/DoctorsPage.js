import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/DoctorsPage.css"; // Create this CSS file for styling
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:8070";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/doctors`);
      setDoctors(response.data);
      setError("");
    } catch (error) {
      console.error("❌ Error fetching doctors:", error.response?.data || error.message);
      setError("Failed to fetch doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = doctor.fullName || ""; // Use the correct field name: fullName
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="doctors-page">
      <ClinicalSidebar />
      <div className="doctors-content">
        <div className="doctors-header">
          <h2>Doctors</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Link to="/doctors/new" className="add-doctor-btn">
            Add New Doctor
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading doctors...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="doctors-table-container">
            <table className="doctors-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Specialization</th>
                  <th>Years of Experience</th>
                  <th>Medical License Number</th>
                  <th>Doctor Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>{doctor.fullName || "N/A"}</td>
                      <td>{doctor.email || "N/A"}</td>
                      <td>{doctor.phoneNumber || "N/A"}</td>
                      <td>{doctor.specialization || "N/A"}</td>
                      <td>{doctor.yearsOfExperience || "N/A"}</td>
                      <td>{doctor.medicalLicenseNumber || "N/A"}</td>
                      <td>{doctor.doctorFee ? `$${doctor.doctorFee}` : "N/A"}</td>
                      <td>
                        <Link to={`/doctors/${doctor._id}`} className="action-btn view-btn">
                          View
                        </Link>
                        <Link to={`/doctors/edit/${doctor._id}`} className="action-btn edit-btn">
                          Edit
                        </Link>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteDoctor(doctor._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No doctors found.
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

export default DoctorsPage;