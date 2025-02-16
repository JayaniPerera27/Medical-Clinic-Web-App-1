import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; // Import Sidebar
import "../styles/Prescriptions.css";

const Prescriptions = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescription, setPrescription] = useState({
        patientName: "",
        date: new Date().toISOString().split("T")[0],
        medicines: "",
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:8070/api/doctors/patients", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
    
                console.log("API Response:", response.data); // Check the response
    
                if (response.data.success) {
                    console.log("Patients Data:", response.data.patients); // Verify the data being set
                    setPatients(response.data.patients);
                }
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
    
        fetchPatients();
    }, []);
    
    

    // Filter patients based on search input
    const filteredPatients = patients.filter((patient) =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Fix: Use fullName
    );

    // Handle patient selection
    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setPrescription({
            ...prescription,
            patientName: patient.fullName, // ✅ Fix: Use fullName
            date: new Date().toISOString().split("T")[0],
        });

        // Fetch previous prescriptions
        axios
            .get(`http://localhost:8070/api/doctors/prescriptions/${patient.fullName}`, { // ✅ Fix: Use fullName
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                if (response.data.success) {
                    setPrescription({ ...response.data.prescriptions[0] }); // Load first prescription
                }
            })
            .catch((error) => {
                console.log("No previous prescription found:", error);
            });
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setPrescription({ ...prescription, [e.target.name]: e.target.value });
    };

    // Save prescription to database
    const savePrescription = async () => {
        try {
            await axios.post("http://localhost:8070/api/doctors/prescriptions/add", prescription, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Prescription saved successfully!");
        } catch (error) {
            console.error("Error saving prescription:", error);
        }
    };

    // Update prescription
    const updatePrescription = async () => {
        try {
            await axios.put(`http://localhost:8070/api/doctors/prescriptions/${prescription._id}`, prescription, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Prescription updated successfully!");
        } catch (error) {
            console.error("Error updating prescription:", error);
        }
    };

    // Delete prescription
    const deletePrescription = async () => {
        try {
            await axios.delete(`http://localhost:8070/api/doctors/prescriptions/${prescription._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Prescription deleted successfully!");
            setPrescription({ patientName: selectedPatient.fullName, date: "", medicines: "" }); // ✅ Fix: Use fullName
        } catch (error) {
            console.error("Error deleting prescription:", error);
        }
    };

    return (
        <div className="prescriptions-page">
            <Sidebar /> {/* Add Sidebar */}
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

                {/* Patients List */}
                <div className="patients-list">
                    {filteredPatients.map((patient) => (
                        <div key={patient.email} className="patient-card" onClick={() => selectPatient(patient)}>
                            <h4>{patient.fullName}</h4> {/* ✅ Fix: Use fullName */}
                            <p>{patient.email}</p>
                        </div>
                    ))}
                </div>

                {/* Prescription Form */}
                {selectedPatient && (
                    <div className="prescription-form">
                        <h3>Prescription for {prescription.patientName}</h3>
                        <p>Date: {prescription.date}</p>
                        <textarea
                            name="medicines"
                            value={prescription.medicines}
                            onChange={handleInputChange}
                            placeholder="Enter prescribed medicines..."
                        ></textarea>

                        <div className="button-group">
                            <button onClick={savePrescription}>Save</button>
                            <button onClick={updatePrescription}>Update</button>
                            <button onClick={deletePrescription} className="delete-btn">Delete</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescriptions;
