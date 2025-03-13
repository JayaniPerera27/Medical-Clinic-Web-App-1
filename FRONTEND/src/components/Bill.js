import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bill.css";

const API_BASE_URL = "http://localhost:8070";

const Bill = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [clinicalFee, setClinicalFee] = useState(2000);
  const [fees, setFees] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/users/doctors`)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));

    axios.get(`${API_BASE_URL}/api/appointments/patients`)
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));

    axios.get(`${API_BASE_URL}/api/appointments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        setAppointments(response.data);
        const initialFees = {};
        response.data.forEach((appointment) => {
          initialFees[appointment._id] = {
            doctorFee: "",
            reportFee: "",
            clinicFee: clinicalFee,
          };
        });
        setFees(initialFees);
      })
      .catch((error) => console.error("Error fetching appointments:", error));

    axios.get(`${API_BASE_URL}/api/prescriptions`)
      .then((response) => setPrescriptions(response.data))
      .catch((error) => console.error("Error fetching prescriptions:", error));
  }, []);

  const handleDoctorChange = async (doctorId) => {
    setSelectedDoctorId(doctorId);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/doctor-fee/${doctorId}`);
      const doctorFee = response.data.fee || 0;
      const reportResponse = await axios.get(`${API_BASE_URL}/api/reports/${selectedPatientId}`);
      const reportFee = reportResponse.data.hasReport ? 1500 : 0;
      setFees((prevFees) => ({
        ...prevFees,
        [selectedPatientId]: {
          doctorFee,
          reportFee,
          clinicFee: clinicalFee,
        },
      }));
    } catch (error) {
      console.error("Error fetching doctor fee or report fee:", error);
    }
  };

  const handleSaveFee = async (appointmentId, patientId, doctorId) => {
    const billData = {
      patientId,
      doctorId,
      doctorFee: fees[appointmentId]?.doctorFee || 0,
      clinicalFee: fees[appointmentId]?.clinicFee || clinicalFee,
      reportFee: fees[appointmentId]?.reportFee || 0,
      totalFee:
        (parseFloat(fees[appointmentId]?.doctorFee) || 0) +
        (parseFloat(fees[appointmentId]?.clinicFee) || 0) +
        (parseFloat(fees[appointmentId]?.reportFee) || 0),
    };

    try {
      await axios.post(`${API_BASE_URL}/api/billing/create`, billData);
      alert("✅ Bill generated successfully!");
    } catch (error) {
      console.error("❌ Error generating bill:", error.response?.data || error.message);
      alert("❌ Failed to generate bill.");
    }
  };

  return (
    <div className="bill-container">
      <h2>Generate Bill</h2>
      <div className="form-group">
        <label>Patient:</label>
        <select onChange={(e) => setSelectedPatientId(e.target.value)}>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>{patient.name}</option>
          ))}
        </select>
      </div>
      <h3>Appointments & Prescriptions</h3>
      <table>
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
              <td>{prescription.patientName}</td>
              <td>{prescription.doctorName}</td>
              <td>{fees[prescription._id]?.doctorFee || "-"}</td>
              <td>{fees[prescription._id]?.clinicFee || clinicalFee}</td>
              <td>{fees[prescription._id]?.reportFee || "-"}</td>
              <td>
                {(parseFloat(fees[prescription._id]?.doctorFee) || 0) +
                 (parseFloat(fees[prescription._id]?.clinicFee) || clinicalFee) +
                 (parseFloat(fees[prescription._id]?.reportFee) || 0)}
              </td>
              <td>
                <button onClick={() => handleSaveFee(prescription._id, prescription.patientId, prescription.doctorId)}>Save Fee</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bill;
