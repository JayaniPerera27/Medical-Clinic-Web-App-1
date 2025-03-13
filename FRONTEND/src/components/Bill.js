import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bill.css";

const API_BASE_URL = "http://localhost:8070";

const Bill = () => {
  const [doctors, setDoctors] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [fees, setFees] = useState({});
  const clinicalFee = 2000;

  useEffect(() => {
    // Fetch doctors who have prescribed medicines
    axios.get(`${API_BASE_URL}/api/users/prescribing-doctors`)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching prescribing doctors:", error));

    // Fetch prescriptions and initialize fees
    axios.get(`${API_BASE_URL}/api/prescriptions`)
      .then((response) => {
        setPrescriptions(response.data);
        const initialFees = {};
        response.data.forEach((prescription) => {
          initialFees[prescription._id] = {
            doctorFee: 0,
            reportFee: prescription.medicines.some(med => med.instructions.toLowerCase().includes("get reports")) ? 1500 : 0,
            clinicFee: clinicalFee,
          };
        });
        setFees(initialFees);
      })
      .catch((error) => console.error("Error fetching prescriptions:", error));
  }, []);

  // Fetch doctor fee by doctor name
  const handleDoctorFeeFetch = async (doctorName, prescriptionId) => {
    try {
      const encodedDoctorName = encodeURIComponent(doctorName.trim());
      const response = await axios.get(`${API_BASE_URL}/api/users/doctor-fee/${encodedDoctorName}`);
  
      setFees((prevFees) => ({
        ...prevFees,
        [prescriptionId]: {
          ...prevFees[prescriptionId],
          doctorFee: response.data.doctorFee || 0,
        },
      }));
    } catch (error) {
      console.error("Error fetching doctor fee:", error.response?.data || error.message);
    }
  };
  
  

  // Save billing data
  const handleSaveFee = async (prescriptionId, patientName, doctorName) => {
    const billData = {
      patientName,
      doctorName,
      doctorFee: fees[prescriptionId]?.doctorFee || 0,
      clinicalFee: fees[prescriptionId]?.clinicFee || clinicalFee,
      reportFee: fees[prescriptionId]?.reportFee || 0,
      totalFee:
        (parseFloat(fees[prescriptionId]?.doctorFee) || 0) +
        (parseFloat(fees[prescriptionId]?.clinicFee) || clinicalFee) +
        (parseFloat(fees[prescriptionId]?.reportFee) || 0),
    };

    try {
      await axios.post(`${API_BASE_URL}/api/billing/create`, billData);
      alert("✅ Bill generated successfully!");
    } catch (error) {
      console.error("❌ Error generating bill:", error.response?.data || error.message);
      alert("❌ Failed to generate bill.");
    }
  };

  return (
    <div className="bill-container">
      <h2>Generate Bill</h2>
      <h3>Prescriptions & Billing</h3>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Doctor</th>
            <th>Doctor Fee</th>
            <th>Clinic Fee</th>
            <th>Report Fee</th>
            <th>Total Fee</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription._id}>
              <td>{prescription.patientName}</td>
              <td>{prescription.doctorName}</td>
              <td>
                {fees[prescription._id]?.doctorFee || "-"} 
                <button onClick={() => handleDoctorFeeFetch(prescription.doctorName, prescription._id)}>
                  Fetch Fee
                </button>
              </td>
              <td>{fees[prescription._id]?.clinicFee || clinicalFee}</td>
              <td>{fees[prescription._id]?.reportFee || "-"}</td>
              <td>
                {(parseFloat(fees[prescription._id]?.doctorFee) || 0) +
                  (parseFloat(fees[prescription._id]?.clinicFee) || clinicalFee) +
                  (parseFloat(fees[prescription._id]?.reportFee) || 0)}
              </td>
              <td>
                <button onClick={() => handleSaveFee(prescription._id, prescription.patientName, prescription.doctorName)}>
                  Save Fee
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bill;
