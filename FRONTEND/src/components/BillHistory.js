import React, { useEffect, useState } from "react";
import axios from "axios";
import ClinicalSidebar from "../components/ClinicalSidebar";
import "../styles/BillHistory.css";
import { useNavigate } from "react-router-dom";

function BillHistory() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillHistory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bills/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (Array.isArray(response.data)) {
          setBills(response.data);
        } else {
          setBills([]);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setError(error.response?.data?.message || "Failed to load billing history. Please try again later.");
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

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredBills = bills.filter(bill => 
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (billId) => {
    navigate(`/bill-details/${billId}`);
  };

  return (
    <div className="bill-history-container">
      <div className="clinicalsidebar-container">
        <ClinicalSidebar />
      </div>
      <div className="bill-history-content">
        <div className="bill-history-header">
          <h1 className="bill-history-title">Billing History</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredBills.length === 0 ? (
          <div className="no-records-message">
            {searchTerm ? "No matching records found." : "No billing records found."}
          </div>
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
                {filteredBills.map((bill) => (
                  <tr 
                    key={bill._id} 
                    onClick={() => handleRowClick(bill._id)}
                    className="clickable-row"
                  >
                    <td>{bill.patientName}</td>
                    <td>{bill.doctorName}</td>
                    <td>{formatCurrency(bill.doctorFee)}</td>
                    <td>{formatCurrency(bill.reportFee)}</td>
                    <td>{formatCurrency(bill.clinicFee)}</td>
                    <td className="total-fee">{formatCurrency(bill.totalFee)}</td>
                    <td>{formatDate(bill.createdAt)}</td>
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