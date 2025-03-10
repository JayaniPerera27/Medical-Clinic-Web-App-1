import React, { useEffect, useState } from "react";
import axios from "axios";
import ClinicalSidebar from "./ClinicalSidebar";
import "../styles/ClinicalReports.css";

function ClinicalReports() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");

  // Fetch prescriptions from the reports collection
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("http://localhost:8070/api/reports");
        console.log("📄 Fetched Prescriptions:", response.data);
        setPrescriptions(response.data);
      } catch (err) {
        console.error("❌ Error fetching prescriptions:", err);
        setError("Failed to load prescriptions.");
        window.alert("❌ Failed to load prescriptions. Please try again.");
      }
    };

    fetchPrescriptions();
  }, []);

  // Send report and save it to MongoDB
  const sendReport = async (id) => {
    try {
      const response = await axios.post(`http://localhost:8070/api/reports/send-report/${id}`);
      window.alert("✅ Report sent and saved successfully!");
    } catch (err) {
      console.error("❌ Failed to send report:", err);
      setError("Failed to send report.");
      window.alert("❌ Failed to send report. Please try again.");
    }
  };

  return (
    <div className="clinical-reports-container">
      <ClinicalSidebar />
      <div className="reports-content">
        <h2>Patient Reports</h2>

        {error && <p className="error-message">{error}</p>}

        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Prescriptions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <tr key={prescription._id}>
                  <td>{prescription.patientName}</td>
                  <td>{prescription.doctorName}</td>
                  <td>{new Date(prescription.date).toLocaleDateString()}</td>
                  <td>
                    {prescription.medicines.map((med, index) => (
                      <div key={index}>
                        {med.name} - {med.dosage} ({med.instructions} times)
                      </div>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => sendReport(prescription._id)}>Send Report</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No prescriptions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClinicalReports;
