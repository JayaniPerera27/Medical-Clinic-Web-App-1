import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/OldPrescriptions.css';

const OldPrescriptionsPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [patientName, setPatientName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/api/patients/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    setPatientName(response.data.patient.fullName);
                }
            } catch (error) {
                console.error("Error fetching patient details:", error);
            }
        };

        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/api/prescriptions/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPrescriptions(response.data.prescriptions);
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            }
        };

        fetchPatientDetails();
        fetchPrescriptions();
    }, [username]);

    const deletePrescription = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/api/prescriptions/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setPrescriptions(prescriptions.filter((prescription) => prescription._id !== id));
            alert("Prescription deleted successfully!");
        } catch (error) {
            console.error("Error deleting prescription:", error);
        }
    };

    return (
        <div className="prescriptions-page">
            <div className="prescriptions-container">
                
                <h2>Old Prescriptions </h2>

                {prescriptions.map((prescription) => (
                    <div key={prescription._id} className="prescription-form">
                        <p><strong>Username:</strong> {prescription.patientUsername}</p>
                        <p><strong>Doctor:</strong> {prescription.doctorName}</p>
                        <p><strong>Date:</strong> {prescription.date}</p>

                        <div className="medicines-list">
                            {prescription.medicines.map((medicine, index) => (
                                <div key={index} className="medicine-item">
                                    <input type="text" placeholder="Medicine Name" value={medicine.name} readOnly />
                                    <input type="text" placeholder="Dosage" value={medicine.dosage} readOnly />
                                    <input type="text" placeholder="Instructions" value={medicine.instructions} readOnly />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => deletePrescription(prescription._id)} className="delete-prescription-btn">Delete Prescription</button>
                    </div>
                    
                ))}
                <button onClick={() => navigate("/prescriptions")}>← Back</button>
            </div>
        </div>
    );
};

export default OldPrescriptionsPage;