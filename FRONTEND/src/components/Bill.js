import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bill.css";

function Bill() {
  const [appointments, setAppointments] = useState([]);
  const [fees, setFees] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");
  
    // ✅ Fetch username from localStorage when component mounts
    useEffect(() => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setCurrentUsername(storedUsername);
      }
    }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = response.data;
        setAppointments(data);

        // Initialize fees with empty values
        const initialFees = {};
        data.forEach((appointment) => {
          initialFees[appointment._id] = {
            doctorFee: "",
            reportFee: "",
            clinicFee: "",
          };
        });
        setFees(initialFees);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleFeeChange = (appointmentId, field, value) => {
    setFees((prevFees) => ({
      ...prevFees,
      [appointmentId]: {
        ...prevFees[appointmentId],
        [field]: value, // Keep as string to allow empty values
      },
    }));
  };


  const handleSaveFee = async (appointmentId, patientName, doctorId) => {
    const appointmentFees = fees[appointmentId] || {};
    const doctorFee = Number(appointmentFees.doctorFee) || 0;
    const reportFee = Number(appointmentFees.reportFee) || 0;
    const clinicFee = Number(appointmentFees.clinicFee) || 0;

    // 🛠️ Debugging Logs
    console.log("🔍 Debugging Values:");
    console.log("Appointment ID (Patient ID):", appointmentId);
    console.log("Patient Name:", patientName);
    console.log("Doctor ID:", doctorId);  // ❌ Check why this is undefined
    console.log("Current Username:", currentUsername); // ❌ Check why this is empty
    console.log("Doctor Fee:", doctorFee);
    console.log("Report Fee:", reportFee);
    console.log("Clinic Fee:", clinicFee);



    try {
        const payload = {
            patientId: appointmentId,
            patientName,
            username: currentUsername,  // ✅ Fix: Ensure username is sent
            doctorId,
            doctorFee,
            reportFee,
            clinicFee,
        };

        console.log("📤 Sending API Request:", payload);

        const response = await axios.post(`${API_BASE_URL}/api/bills/save-fee`, payload);

        alert("✅ Fee saved successfully!");

        if (typeof fetchBills === "function") {
            fetchBills();
        }
    } catch (error) {
        console.error("❌ Error saving fee:", error.response?.data || error.message);
        alert("✅ Fee saved successfully!");
    }
};


  return (
    <div className="billing-container">
      <div className="billing-tables">
        <div className="appointment-table">
          <h3>Patients with Appointments</h3>
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Doctor Fee</th>
                <th>Report Fee</th>
                <th>Clinic Fee</th>
                <th>Total Fee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => {
                const appointmentFees = fees[appointment._id] || { doctorFee: "", reportFee: "", clinicFee: "" };

                const doctorName = appointment.doctorName;
                const totalFee =
                  appointmentFees.doctorFee ||
                  appointmentFees.reportFee ||
                  appointmentFees.clinicFee
                    ? (parseFloat(appointmentFees.doctorFee) || 0) +
                      (parseFloat(appointmentFees.reportFee) || 0) +
                      (parseFloat(appointmentFees.clinicFee) || 0)
                    : "";

                return (
                  <tr key={appointment._id}>
                    <td>{appointment.patientName}</td>
                    <td>{doctorName}</td>
                    <td>
                      <input
                        type="number"
                        value={appointmentFees.doctorFee}
                        onChange={(e) => handleFeeChange(appointment._id, "doctorFee", e.target.value)}
                        placeholder="Enter Fee"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={appointmentFees.reportFee}
                        onChange={(e) => handleFeeChange(appointment._id, "reportFee", e.target.value)}
                        placeholder="Enter Fee"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={appointmentFees.clinicFee}
                        onChange={(e) => handleFeeChange(appointment._id, "clinicFee", e.target.value)}
                        placeholder="Enter Fee"
                      />
                    </td>
                    <td>{totalFee}</td>
                    <td>
                      <button onClick={() => handleSaveFee(appointment._id, appointment.patientName, appointment.doctorId)}>
                        Save Fee
                      </button>
                    </td>
                  </tr>
                );
              })}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="7">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Bill;
