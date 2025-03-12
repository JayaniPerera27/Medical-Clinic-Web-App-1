import React, { useEffect, useState } from "react";
import axios from "axios";
import ClinicalSidebar from "../components/ClinicalSidebar";

function BillHistory() {
  const [billHistories, setBillHistories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

  useEffect(() => {
    const fetchBillHistory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bills/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Billing History API Response:", response.data);
        setBillHistories(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching billing history:", error);
        setError("Failed to load billing history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillHistory();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bill-layout-container">
      <div className="sidebar-container">
        <ClinicalSidebar />
      </div>
      <div className="bill-content-container">
        <div className="bill-content-inner">
          <h1 className="bill-page-title">Billing History</h1>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">
              {error}
            </div>
          ) : Object.keys(billHistories).length === 0 ? (
            <div className="empty-state">
              No billing history found.
            </div>
          ) : (
            <div className="patient-list">
              {Object.keys(billHistories).map((patientName) => (
                <div key={patientName} className="patient-card">
                  <div className="patient-header">
                    <h2 className="patient-name">{patientName}</h2>
                  </div>
                  <div className="table-container">
                    <table className="billing-table">
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
                            <td>{formatCurrency(bill.doctorFee)}</td>
                            <td>{formatCurrency(bill.reportFee)}</td>
                            <td>{formatCurrency(bill.clinicFee)}</td>
                            <td>{formatCurrency(bill.totalFee)}</td>
                            <td>{new Date(bill.date).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillHistory;