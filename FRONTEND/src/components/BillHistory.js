import React, { useEffect, useState } from "react";
import axios from "axios";
import ClinicalSidebar from "../components/ClinicalSidebar"; // ✅ Import Sidebar
import "../styles/BillHistory.css";

function BillHistory() {
  const [billHistories, setBillHistories] = useState({}); // ✅ Initialize as an object
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

  useEffect(() => {
    const fetchBillHistory = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/bills/history`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            console.log("Billing History API Response:", response.data); // ✅ Log response
            setBillHistories(response.data);
        } catch (error) {
            console.error("Error fetching billing history:", error);
        }
    };

    fetchBillHistory();
}, []);

  return (
    <div className="main-container">
    {/* ✅ Sidebar Added */}
    <ClinicalSidebar />
    <div className="bill-history-container">
      <h2>Billing History</h2>
      {Object.keys(billHistories).length === 0 ? (
        <p>No billing history found.</p>
      ) : (
        <div className="billing-history">
          {Object.keys(billHistories).map((patientName) => (
            <div key={patientName} className="patient-section">
              <h3>{patientName}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Doctor Fee</th>
                    <th>Report Fee</th>
                    <th>Clinic Fee</th>
                    <th>Total Fee</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {billHistories[patientName].map((bill) => (
                    <tr key={bill.billId}>
                      <td>{bill.doctorName || "Test Doctor"}</td>
                      <td>{bill.doctorFee}</td>
                      <td>{bill.reportFee}</td>
                      <td>{bill.clinicFee}</td>
                      <td>{bill.totalFee}</td>
                      <td>{new Date(bill.date).toLocaleString()}</td> {/* ✅ Proper date formatting */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
} 

export default BillHistory;