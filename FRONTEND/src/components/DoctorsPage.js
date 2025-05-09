import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/DoctorsPage.css"; 
import ClinicalSidebar from "../components/ClinicalSidebar";
import { toast } from "react-toastify"; // You'll need to install this package

//const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://medical-clinic-web-app-backend.vercel.app";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const handleDeleteDoctor = async (doctorId) => {
    // Set the ID of the doctor to delete for confirmation
    setDeleteConfirm(doctorId);
  };

  const confirmDeleteDoctor = async () => {
    if (!deleteConfirm) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/users/doctors/${deleteConfirm}`);
      toast.success("Doctor deleted successfully");
      // Refresh the doctor list
      fetchDoctors();
      // Close the confirmation dialog
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting doctor:", error.response?.data || error.message);
      toast.error("Failed to delete doctor. Please try again.");
    }
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = doctor.fullName || ""; 
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
          {/* <Link to="/doctors/new" className="add-doctor-btn">
            Add New Doctor
          </Link> */}
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
                      <td>{doctor.doctorFee ? `LKR${doctor.doctorFee}` : "N/A"}</td>
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this doctor? This action cannot be undone.</p>
              <div className="delete-modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setDeleteConfirm(null)}
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

export default DoctorsPage;