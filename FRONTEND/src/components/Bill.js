import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bill.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:8070";

const Bill = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [fees, setFees] = useState({});
  const [patientNames, setPatientNames] = useState({});
  const clinicalFee = 2000;

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prescriptions`);
      const prescriptionsData = response.data;
      setPrescriptions(prescriptionsData);

      await Promise.all([
        fetchDoctorFees(prescriptionsData),
        fetchPatientNames(prescriptionsData),
      ]);
    } catch (error) {
      console.error("❌ Error fetching prescriptions:", error.response?.data || error.message);
    }
  };

  const fetchDoctorFees = async (prescriptionsData) => {
    const updatedFees = {};

    await Promise.all(
      prescriptionsData.map(async (prescription) => {
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
          console.error(`❌ Error fetching doctor fee for ${prescription.doctorName}:`, error);
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
      })
    );

    setFees(updatedFees);
  };

  const fetchPatientNames = async (prescriptionsData) => {
    const updatedNames = {};

    await Promise.all(
      prescriptionsData.map(async (prescription) => {
        if (!prescription.patientUsername) return;

        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/get-patient-name/${encodeURIComponent(prescription.patientUsername)}`
          );
          updatedNames[prescription._id] = response.data.fullName || "Unknown";
        } catch (error) {
          console.error(`❌ Error fetching name for ${prescription.patientUsername}:`, error);
          updatedNames[prescription._id] = "Unknown";
        }
      })
    );

    setPatientNames(updatedNames);
  };

  const handleSaveFee = async (prescriptionId, doctorName) => {
    const patientName = patientNames[prescriptionId] || "Unknown Patient";
    const doctorFee = Number(fees[prescriptionId]?.doctorFee || 0);
    const reportFee = Number(fees[prescriptionId]?.reportFee || 0);
    const totalFee = doctorFee + clinicalFee + reportFee;

    const billData = {
      patientName,
      doctorName,
      doctorFee,
      clinicalFee,
      reportFee,
      totalFee,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/billing/save-fee`, billData);
      alert("✅ Bill generated successfully!");
    } catch (error) {
      console.error("❌ Error generating bill:", error.response?.data || error.message);
      alert("❌ Failed to generate bill.");
    }
  };

  return (
    <div className="bill-page">
      <ClinicalSidebar />
      <div className="bill-content">
        <div className="bill-header">
          <h2>Generate Bill</h2>
          <h3>Prescriptions & Billing</h3>
        </div>
        <div className="bill-table-container">
          <table className="bill-table">
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
                  <td>{clinicalFee}</td>
                  <td>{fees[prescription._id]?.reportFee || "-"}</td>
                  <td>
                    {(
                      (fees[prescription._id]?.doctorFee || 0) +
                      clinicalFee +
                      (fees[prescription._id]?.reportFee || 0)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button 
                      className="save-fee-btn"
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
      </div>
    </div>
  );
};

export default Bill;
