import React, { useEffect, useState } from "react";
import axios from "axios";
import ClinicalSidebar from "../components/ClinicalSidebar";
import "../styles/BillHistory.css"; // Import the CSS file

function BillHistory() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchBillHistory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bills/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Billing History API Response:", response.data);

        if (Array.isArray(response.data)) {
          setBills(response.data);
        } else {
          setBills([]);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setError("Failed to load billing history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillHistory();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bill-history-container">
      <div className="clinicalsidebar-container">
        <ClinicalSidebar />
      </div>
      <div className="bill-history-content">
        <h1 className="bill-history-title">Billing History</h1>
        {isLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : bills.length === 0 ? (
          <div className="text-center text-gray-500">No billing records found.</div>
        ) : (
          <div className="bill-history-table-container">
            <table className="bill-history-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Doctor Fee</th>
                  <th>Report Fee</th>
                  <th>Clinic Fee</th>
                  <th>Total Fee</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr key={bill._id || index}>
                    <td>{bill.patientName || "Unknown Patient"}</td>
                    <td>{bill.doctorId?.fullName || "Unknown Doctor"}</td>
                    <td>{formatCurrency(bill.doctorFee || 0)}</td>
                    <td>{formatCurrency(bill.reportFee || 0)}</td>
                    <td>{formatCurrency(bill.clinicFee || 0)}</td>
                    <td className="font-semibold">{formatCurrency(bill.totalFee || 0)}</td>
                    <td>{bill.createdAt ? new Date(bill.createdAt).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BillHistory;