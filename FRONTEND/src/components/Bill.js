import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bill.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

const API_BASE_URL = "http://localhost:8070";

const Bill = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [fees, setFees] = useState({});
  const clinicalFee = 2000;

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prescriptions`);
      const prescriptionsData = response.data;
      setPrescriptions(prescriptionsData);

      // Fetch doctor fees
      await fetchDoctorFees(prescriptionsData);
    } catch (error) {
      console.error("❌ Error fetching prescriptions:", error.response?.data || error.message);
    }
  };

  // ✅ Fetch doctor fees from users collection
  const fetchDoctorFees = async (prescriptionsData) => {
    const updatedFees = {};

    await Promise.all(
      prescriptionsData.map(async (prescription) => {
        try {
          // Try the first endpoint format
          let response;
          try {
            response = await axios.get(
              `${API_BASE_URL}/api/users/get-doctor-fee/${encodeURIComponent(prescription.doctorName.trim())}`
            );
          } catch (e) {
            // If first endpoint fails, try the alternative endpoint
            response = await axios.get(
              `${API_BASE_URL}/api/users/doctor-fee/${encodeURIComponent(prescription.doctorName.trim())}`
            );
          }

          updatedFees[prescription._id] = {
            doctorFee: response.data?.doctorFee || 0,
            clinicFee: clinicalFee,
          };
        } catch (error) {
          console.error(`❌ Error fetching doctor fee for ${prescription.doctorName}:`, error);
          updatedFees[prescription._id] = {
            doctorFee: 0,
            clinicFee: clinicalFee,
          };
        }
      })
    );

    setFees(updatedFees);
  };

  const handleSaveFee = async (prescriptionId, doctorName) => {
    const prescription = prescriptions.find((p) => p._id === prescriptionId);
    const patientName = prescription.patientName || "Unknown Patient";
    const doctorFee = Number(fees[prescriptionId]?.doctorFee || 0);
    const totalFee = doctorFee + clinicalFee;

    const billData = {
      patientName,
      doctorName,
      doctorFee,
      clinicalFee,
      totalFee,
    };

    console.log("📤 Sending bill data:", billData); // Debugging log

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
                <th>Total Fee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription._id}>
                  <td>{prescription.patientName || "Unknown"}</td>
                  <td>{prescription.doctorName}</td>
                  <td>{fees[prescription._id]?.doctorFee || "-"}</td>
                  <td>{clinicalFee}</td>
                  <td>
                    {(
                      (fees[prescription._id]?.doctorFee || 0) +
                      clinicalFee
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