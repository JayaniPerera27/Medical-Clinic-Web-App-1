import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table.jsx";
import { Button } from "./ui/button.jsx";
import { Loader2, FilePlus, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import ClinicalSidebar from "../components/ClinicalSidebar";
import "../styles/Bill.css";
import { Link } from "react-router-dom";
import { History } from "lucide-react";


const API_BASE_URL = "http://localhost:8070";

const Bill = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [fees, setFees] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const clinicalFee = 2000;

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prescriptions`);
      console.log("📥 Fetched Prescriptions:", response.data);

      const updatedPrescriptions = response.data.map((p) => ({
        ...p,
        doctorId: p.doctorId || null,
        patientId: p.patientId || null
      }));

      setPrescriptions(updatedPrescriptions);
      await fetchDoctorFees(updatedPrescriptions);
    } catch (error) {
      console.error("❌ Error fetching prescriptions:", error);
      toast.error(error.response?.data?.message || "Failed to fetch prescriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorFees = async (prescriptionsData) => {
    const updatedFees = {};

    await Promise.all(
      prescriptionsData.map(async (prescription) => {
        try {
          let response;
          try {
            response = await axios.get(
              `${API_BASE_URL}/api/users/get-doctor-fee/${encodeURIComponent(prescription.doctorName.trim())}`
            );
          } catch (e) {
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

  const handleSaveFee = async (prescriptionId) => {
    setProcessing((prev) => ({ ...prev, [prescriptionId]: true }));

    try {
      const prescription = prescriptions.find((p) => p._id === prescriptionId);
      if (!prescription) {
        throw new Error("Prescription not found");
      }

      const billData = {
        patientId: prescription.patientId || "unknown",
        patientName: prescription.patientName || "Unknown Patient",
        username: prescription.patientUsername || "unknown",
        doctorId: prescription.doctorId || "unknown",
        doctorName: prescription.doctorName || "Unknown Doctor",
        doctorFee: fees[prescription._id]?.doctorFee || 0,
        clinicalFee: clinicalFee,
        totalFee: (fees[prescription._id]?.doctorFee || 0) + clinicalFee,
      };

      console.log("📤 Sending bill data:", billData);
      await axios.post(`${API_BASE_URL}/api/billing/save-fee`, billData);
      toast.success("Bill generated successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("❌ Bill save failed:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing((prev) => ({ ...prev, [prescriptionId]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClinicalSidebar />
      <div className="flex-1 flex flex-col p-6">
        
        
        <Card className="w-full shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardTitle className="text-2xl font-bold flex items-center">
              <FilePlus className="mr-2" size={24} />
              Generate Bill
            </CardTitle>
            <p className="text-blue-50">Prescriptions & Billing Management</p>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-lg text-gray-600">Loading prescriptions...</span>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle size={48} className="mb-4 text-blue-500" />
                <p className="text-lg font-medium">No prescriptions found</p>
                <p className="text-sm">New prescriptions will appear here when available</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold">Patient Name</TableHead>
                      <TableHead className="font-semibold">Doctor</TableHead>
                      <TableHead className="font-semibold text-right">Doctor Fee</TableHead>
                      <TableHead className="font-semibold text-right">Clinic Fee</TableHead>
                      <TableHead className="font-semibold text-right">Total Fee</TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription) => {
                      const doctorFee = fees[prescription._id]?.doctorFee || 0;
                      const totalFee = doctorFee + clinicalFee;
                      const isProcessing = processing[prescription._id];
                      
                      return (
                        <TableRow key={prescription._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {prescription.patientName || "Unknown"}
                          </TableCell>
                          <TableCell>{prescription.doctorName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(doctorFee)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(clinicalFee)}</TableCell>
                          <TableCell className="text-right font-medium text-blue-600">
                            {formatCurrency(totalFee)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleSaveFee(prescription._id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing
                                </>
                              ) : (
                                "Generate Bill"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t flex justify-end">
          <Link 
  to="/billing-history" 
  className="view-history-link inline-flex items-center"
>
  <History className="mr-2" size={16} />
  View Billing History
</Link>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default Bill;