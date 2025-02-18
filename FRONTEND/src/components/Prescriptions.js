import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/Prescriptions.css";

const Prescriptions = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescription, setPrescription] = useState({
        patientName: "",
        patientUsername: "",
        doctorName: "", // Initially empty, will be set after login
        date: new Date().toISOString().split("T")[0],
        medicines: [{ name: "", dosage: "", instructions: "" }],
    });
    const [doctorName, setDoctorName] = useState("");

    // Fetch patients from backend
    useEffect(() => {
        // Get the logged-in doctor's name from the JWT token
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            setDoctorName(decodedToken.name); // Assuming the doctor's name is stored in the token
        }

        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:8070/api/doctors/patients", {
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
    }, []);

    // Filter patients based on search input
    const filteredPatients = patients.filter((patient) =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle patient selection
    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setPrescription({
            ...prescription,
            patientName: patient.fullName,
            patientUsername: patient.username, // ✅ Set patientUsername correctly
            doctorName: doctorName, // Set doctor name dynamically
            date: new Date().toISOString().split("T")[0],
        });

        // Fetch previous prescriptions using patientUsername
        axios
            .get(`http://localhost:8070/api/doctors/prescriptions/${patient.username}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                if (response.data.success && response.data.prescriptions.length > 0) {
                    setPrescription(response.data.prescriptions[0]); // Load first prescription
                }
            })
            .catch((error) => {
                console.log("No previous prescription found:", error);
            });
    };

    // Handle medicine input change
    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...prescription.medicines];
        updatedMedicines[index][field] = value;
        setPrescription({ ...prescription, medicines: updatedMedicines });
    };

    // Add new medicine field
    const addMedicine = () => {
        setPrescription({
            ...prescription,
            medicines: [...prescription.medicines, { name: "", dosage: "", instructions: "" }],
        });
    };

    // Remove a medicine field
    const removeMedicine = (index) => {
        const updatedMedicines = prescription.medicines.filter((_, i) => i !== index);
        setPrescription({ ...prescription, medicines: updatedMedicines });
    };

    // Save prescription to database
    const savePrescription = async () => {
        try {
            const response = await axios.post("http://localhost:8070/api/prescriptions/add", prescription, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.data.success) {
                alert("Prescription saved successfully!");
                setPrescription({
                    patientName: "",
                    patientUsername: "",
                    doctorName: doctorName, // Reset doctor name
                    date: new Date().toISOString().split("T")[0],
                    medicines: [{ name: "", dosage: "", instructions: "" }],
                }); // Reset form after save
            }
        } catch (error) {
            console.error("Error saving prescription:", error);
        }
    };

    // Update prescription
    const updatePrescription = async () => {
        try {
            const response = await axios.put(`http://localhost:8070/api/prescriptions/${prescription._id}`, prescription, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.data.success) {
                alert("Prescription updated successfully!");
            }
        } catch (error) {
            console.error("Error updating prescription:", error);
        }
    };

    // Delete prescription
    const deletePrescription = async () => {
        try {
            const response = await axios.delete(`http://localhost:8070/api/prescriptions/${prescription._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.data.success) {
                alert("Prescription deleted successfully!");
                setPrescription({
                    patientName: selectedPatient.fullName,
                    patientUsername: selectedPatient.username, // Use the correct username here
                    date: "",
                    medicines: [],
                }); // Reset form after deletion
            }
        } catch (error) {
            console.error("Error deleting prescription:", error);
        }
    };

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

                {/* Patients List */}
                <div className="patients-list">
                    {filteredPatients.map((patient) => (
                        <div key={patient.username} className="patient-card" onClick={() => selectPatient(patient)}>
                            <h4>{patient.fullName}</h4>
                            <p>Username: {patient.username}</p>
                            <p>{patient.email}</p>
                        </div>
                    ))}
                </div>

                {/* Prescription Form */}
                {selectedPatient && (
                    <div className="prescription-form">
                        <h3>Prescription for {prescription.patientName}</h3>
                        <p><strong>Username:</strong> {prescription.patientUsername}</p> {/* Display username */}
                        <p><strong>Doctor:</strong> {prescription.doctorName}</p>
                        <p><strong>Date:</strong> {prescription.date}</p>

                        {/* Medicines Section */}
                        <div className="medicines-list">
                            {prescription.medicines.map((medicine, index) => (
                                <div key={index} className="medicine-item">
                                    <input
                                        type="text"
                                        placeholder="Medicine Name"
                                        value={medicine.name}
                                        onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dosage"
                                        value={medicine.dosage}
                                        onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Instructions"
                                        value={medicine.instructions}
                                        onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                                    />
                                    <button onClick={() => removeMedicine(index)}>🗑</button>
                                </div>
                            ))}
                        </div>

                        {/* Add Medicine Button */}
                        <button onClick={addMedicine} className="add-medicine-btn">+ Add Medicine</button>

                        {/* Buttons */}
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
