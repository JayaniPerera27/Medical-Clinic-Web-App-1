import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bill.css";

const API_BASE_URL = "http://localhost:8070";

const Bill = () => {
  const [doctors, setDoctors] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [fees, setFees] = useState({});
  const [patientNames, setPatientNames] = useState({}); // Store actual patient names
  const clinicalFee = 2000;

  useEffect(() => {
    // Fetch doctors who have prescribed medicines
    axios
      .get(`${API_BASE_URL}/api/users/prescribing-doctors`)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching prescribing doctors:", error));

    // Fetch prescriptions and fetch doctor fees & patient names
    axios
      .get(`${API_BASE_URL}/api/prescriptions`)
      .then(async (response) => {
        setPrescriptions(response.data);
        fetchDoctorFees(response.data);
        fetchPatientNames(response.data);
      })
      .catch((error) => console.error("Error fetching prescriptions:", error));
  }, []);

  // Fetch doctor fees for all prescriptions
  const fetchDoctorFees = async (prescriptionsData) => {
    const updatedFees = {};

    for (const prescription of prescriptionsData) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/doctor-fee/${encodeURIComponent(prescription.doctorName.trim())}`
        );
        updatedFees[prescription._id] = {
          doctorFee: response.data.doctorFee || 0,
          reportFee: prescription.medicines.some((med) =>
            med.instructions.toLowerCase().includes("get reports")
          )
            ? 1500
            : 0,
          clinicFee: clinicalFee,
        };
      } catch (error) {
        console.error(
          `❌ Error fetching doctor fee for ${prescription.doctorName}:`,
          error.response?.data || error.message
        );
        updatedFees[prescription._id] = {
          doctorFee: 0,
          reportFee: prescription.medicines.some((med) =>
            med.instructions.toLowerCase().includes("get reports")
          )
            ? 1500
            : 0,
          clinicFee: clinicalFee,
        };
      }
    }

    setFees(updatedFees);
  };

  // Fetch patient names for all prescriptions
  const fetchPatientNames = async (prescriptionsData) => {
    const updatedNames = {};

    for (const prescription of prescriptionsData) {
      if (!prescription.patientUsername) continue; // Skip if no username

      try {
        const response = await axios.get(`${API_BASE_URL}/api/get-patient-name/${encodeURIComponent(prescription.patientUsername)}`);
        updatedNames[prescription._id] = response.data.fullName; // Store patient name
      } catch (error) {
        console.error(`❌ Error fetching name for ${prescription.patientUsername}:`, error);
        updatedNames[prescription._id] = "Unknown"; // Fallback if name fetching fails
      }
    }

    setPatientNames(updatedNames);
  };

  // Save billing data
  const handleSaveFee = async (prescriptionId, doctorName) => {
    const patientName = patientNames[prescriptionId] || "Unknown Patient";

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
              <td>{patientNames[prescription._id] || "Loading..."}</td>
              <td>{prescription.doctorName}</td>
              <td>{fees[prescription._id]?.doctorFee || "-"}</td>
              <td>{fees[prescription._id]?.clinicFee || clinicalFee}</td>
              <td>{fees[prescription._id]?.reportFee || "-"}</td>
              <td>
                {(parseFloat(fees[prescription._id]?.doctorFee) || 0) +
                  (parseFloat(fees[prescription._id]?.clinicFee) || clinicalFee) +
                  (parseFloat(fees[prescription._id]?.reportFee) || 0)}
              </td>
              <td>
                <button
                  onClick={() => handleSaveFee(prescription._id, prescription.doctorName)}
                >
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
