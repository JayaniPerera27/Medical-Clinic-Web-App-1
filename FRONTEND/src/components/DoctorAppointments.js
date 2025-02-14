import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token"); // Get JWT from storage
                const response = await axios.get("http://localhost:8070/api/appointments/doctor-appointments", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setAppointments(response.data.appointments);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="appointments-container">
            <h2>My Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Appointment Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td>{appointment.patientName}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorAppointments;
