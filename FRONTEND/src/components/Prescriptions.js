import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/Prescriptions.css";

const Prescriptions = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Fetch patients from backend
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchPatients = async () => {
                try {
                    const response = await axios.get("http://localhost:3001/api/doctors/patients", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.data.success) {
                        setPatients(response.data.patients);
                    }
                } catch (error) {
                    console.error("Error fetching patients:", error);
                }
            };

            fetchPatients();
        }
    }, []);

    // Filter patients based on search input
    const filteredPatients = patients.filter((patient) =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="prescriptions-page">
            <Sidebar />
            <div className="prescriptions-container">
                <h2>Prescriptions</h2>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search patients by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />

                {/* Patients Table */}
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>Patient Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>New Prescription</th>
                            <th>Old Prescriptions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.username}>
                                <td>{patient.username}</td>
                                <td>{patient.fullName}</td>
                                <td>{patient.email}</td>
                                <td>
                                    <button onClick={() => navigate(`/new-prescription/${patient.username}`)}>New Prescription</button>
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/old-prescriptions/${patient.username}`)}>Old Prescriptions</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Prescriptions;