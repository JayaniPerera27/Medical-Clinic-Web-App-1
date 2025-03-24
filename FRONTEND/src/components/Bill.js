import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table.jsx";
import { Button } from "./ui/button.jsx";
import { Loader2, FilePlus, AlertCircle } from "lucide-react";
import { useToast } from "./ui/use-toast.jsx";
import ClinicalSidebar from "../components/ClinicalSidebar";
import "../styles/Bill.css";

const API_BASE_URL = "http://localhost:8070";

const Bill = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [fees, setFees] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const clinicalFee = 2000;
  const { toast } = useToast();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get(`${API_BASE_URL}/api/prescriptions`);
        console.log("📥 Fetched Prescriptions:", response.data); // ✅ Debugging log

        const prescriptionsData = response.data.map((p) => ({
            ...p,
            doctorId: p.doctorId || null, // Ensure doctorId is valid
            patientId: p.patientId || null, // Ensure patientId is valid
        }));

        const updatedPrescriptions = prescriptionsData.map((p) => ({
          ...p,
          doctorId: p.doctorId || null,
          patientId: p.patientId || null,
      }));
      
      setPrescriptions(updatedPrescriptions);
      
        await fetchDoctorFees(prescriptionsData);
    } catch (error) {
        console.error("❌ Error fetching prescriptions:", error.response?.data || error.message);
        toast({
            title: "Error fetching prescriptions",
            description: error.response?.data || error.message,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
};


  // Fetch doctor fees from users collection
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

  const handleSaveFee = async (prescriptionId) => {
    setProcessing((prev) => ({ ...prev, [prescriptionId]: true }));

    const prescription = prescriptions.find((p) => p._id === prescriptionId);
    
    if (!prescription) {
        toast({
            title: "Error",
            description: "Prescription data is missing.",
            variant: "destructive",
        });
        setProcessing(prev => ({ ...prev, [prescriptionId]: false }));
        return;
    }

    const username = prescription?.patientUsername || "N/A"; 
    const patientName = prescription?.patientName || "Unknown";
    const doctorName = prescription?.doctorName || "Unknown"; 
    const patientId = prescription?.patientId && prescription.patientId !== "N/A" ? prescription.patientId : null;
    const doctorId = prescription?.doctorId && prescription.doctorId !== "N/A" ? prescription.doctorId : null;

    const doctorFee = Number(fees[prescriptionId]?.doctorFee || 0);
    const totalFee = doctorFee + clinicalFee;

    if (!patientId || !doctorId || !doctorName || doctorFee == null) {
        toast({
            title: "Error",
            description: "Invalid patient or doctor information. Cannot generate bill.",
            variant: "destructive",
        });
        setProcessing(prev => ({ ...prev, [prescriptionId]: false }));
        return;
    }

    const billData = {
        patientId,
        patientName,
        username,
        doctorId,
        doctorName,
        doctorFee,
        clinicalFee,
        totalFee,
    };

    console.log("📤 Sending bill data:", billData);

    try {
        const response = await axios.post(`${API_BASE_URL}/api/billing/save-fee`, billData);

        toast({
            title: "Success",
            description: "Bill generated successfully!",
            variant: "success",
        });

    } catch (error) {
        console.error("❌ Error generating bill:", error);

        // ✅ Ensure only strings are displayed in the alert
        const errorMessage = error.response?.data?.message 
            ? JSON.stringify(error.response.data.message)
            : "Failed to generate bill.";

        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });

        // ✅ Prevent `[object Object] OK` pop-up
        alert(errorMessage);

    } finally {
        setProcessing((prev) => ({ ...prev, [prescriptionId]: false }));
    }
};


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ClinicalSidebar />
      <div className="flex-1 flex flex-col p-6 overflow-auto">
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
              <div className="overflow-x-auto rounded-md border">
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
        </Card>
      </div>
    </div>
  );
};

export default Bill;