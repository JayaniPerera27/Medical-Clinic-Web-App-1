import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/NewPrescription.css";

const NewPrescriptionPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [doctorName, setDoctorName] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // Success message state
    const [prescription, setPrescription] = useState({
        patientUsername: username,
        doctorName: "",
        date: new Date().toISOString().split("T")[0],
        medicines: [{ name: "", dosage: "", instructions: "" }],
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            setDoctorName(decodedToken.name);
            setPrescription((prev) => ({ ...prev, doctorName: decodedToken.name }));
        }
    }, [username]);

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...prescription.medicines];
        updatedMedicines[index][field] = value;
        setPrescription({ ...prescription, medicines: updatedMedicines });
    };

    const addMedicine = () => {
        setPrescription({
            ...prescription,
            medicines: [...prescription.medicines, { name: "", dosage: "", instructions: "" }],
        });
    };

    const removeMedicine = (index) => {
        const updatedMedicines = prescription.medicines.filter((_, i) => i !== index);
        setPrescription({ ...prescription, medicines: updatedMedicines });
    };

    const savePrescription = async () => {
        try {
            const response = await axios.post("http://localhost:3001/api/prescriptions/add", prescription, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            console.log("API Response:", response.data); // Debugging

            if (response.data.success) {
                setSuccessMessage("✅ Successfully saved prescription!");
                console.log("Success message set"); // Debugging

                // Keep the success message for 3 seconds
                setTimeout(() => {
                    setSuccessMessage(""); 
                    navigate("/prescriptions");
                }, 3000);
            } else {
                console.log("Success condition failed"); // Debugging
            }
        } catch (error) {
            alert("Error saving prescription!");
            console.error("Error details:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="prescriptions-page">
            <div className="prescriptions-container">
                <h2>New Prescription</h2>

                {successMessage && <p className="success-message">{successMessage}</p>} {/* Message should now display */}

                <div className="prescription-form">
                    <p><strong>Username:</strong> {prescription.patientUsername}</p>
                    <p><strong>Doctor:</strong> {doctorName}</p>
                    <p><strong>Date:</strong> {prescription.date}</p>

                    <div className="medicines-list">
                        {prescription.medicines.map((medicine, index) => (
                            <div key={index} className="medicine-item">
                                <input type="text" placeholder="Medicine Name" value={medicine.name} onChange={(e) => handleMedicineChange(index, "name", e.target.value)} />
                                <input type="text" placeholder="Dosage" value={medicine.dosage} onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} />
                                <input type="text" placeholder="Instructions" value={medicine.instructions} onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)} />
                                <button onClick={() => removeMedicine(index)}>🗑</button>
                            </div>
                        ))}
                    </div>

                    <button onClick={addMedicine} className="add-medicine-btn">+ Add Medicine</button>
                    <button onClick={savePrescription}>Save Prescription</button>
                </div>
                <button onClick={() => navigate("/prescriptions")}>← Back</button>
            </div>
        </div>
    );
};

export default NewPrescriptionPage;
