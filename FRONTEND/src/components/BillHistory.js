import React, { useEffect, useState } from "react";
import axios from "axios";
import ClinicalSidebar from "../components/ClinicalSidebar";
import "../styles/BillHistory.css";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

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
        const response = await axios.get(`${API_BASE_URL}/api/bills/history`);

        if (Array.isArray(response.data)) {
          // Process and normalize bills data
          const processedBills = response.data.map(bill => ({
            ...bill,
            createdAt: bill.createdAt || new Date().toISOString() // Fallback to current date if missing
          }));
          setBills(processedBills);
        } else {
          setBills([]);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setError(error.response?.data?.message || "Failed to load billing history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillHistory();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'No Date';

    try {
      // Handle different date input scenarios
      const date = typeof dateInput === 'string' 
        ? new Date(dateInput) 
        : dateInput instanceof Date 
        ? dateInput 
        : new Date();

      // Validate date
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateInput);
        return 'Invalid Date';
      }

      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Date Error';
    }
  };

  const filteredBills = bills.filter(bill => 
    (bill.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bill.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (billId) => {
    navigate(`/bill-details/${billId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClinicalSidebar />
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
            <h1 className="text-2xl font-bold">Billing History</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-lg text-gray-600">Loading billing history...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle size={48} className="mb-4 text-red-500" />
                <p className="text-lg font-medium">{error}</p>
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle size={48} className="mb-4 text-blue-500" />
                <p className="text-lg font-medium">
                  {searchTerm ? "No matching records found" : "No billing records found"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Patient Name</th>
                      <th className="p-3 text-left">Doctor Name</th>
                      <th className="p-3 text-right">Doctor Fee</th>
                      <th className="p-3 text-right">Clinic Fee</th>
                      <th className="p-3 text-right">Total Fee</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => (
                      <tr 
                        key={bill._id} 
                        onClick={() => handleRowClick(bill._id)}
                        className="hover:bg-gray-50 cursor-pointer border-b"
                      >
                        <td className="p-3">{bill.patientName || 'Unknown'}</td>
                        <td className="p-3">{bill.doctorName || 'Unknown'}</td>
                        <td className="p-3 text-right">{formatCurrency(bill.doctorFee)}</td>
                        <td className="p-3 text-right">{formatCurrency(bill.clinicFee)}</td>
                        <td className="p-3 text-right font-medium text-blue-600">{formatCurrency(bill.totalFee)}</td>
                        <td className="p-3">{formatDate(bill.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillHistory;