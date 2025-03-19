import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Sidebar from "./Sidebar"; // Import Sidebar component
import "../styles/DoctorAppointments.css"; // Import the CSS file

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [doctorName, setDoctorName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

    useEffect(() => {
        const fetchDoctorAppointments = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized access. Please log in.");
                return;
            }

            try {
                // Decode the JWT token to get the doctor's name
                const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode the token
                setDoctorName(tokenPayload.name || "Doctor"); // Set doctor name

                // Fetch appointments
                const response = await axios.get(`${API_BASE_URL}/api/doctor-appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setAppointments(response.data.appointments);

                    // Get today's date (e.g., "Monday")
                    const today = format(new Date(), "EEEE");

                    // Filter today's appointments
                    const todaysAppointments = response.data.appointments.filter(app => app.date === today);
                    setTodayAppointments(todaysAppointments);
                } else {
                    setError("Failed to fetch appointments.");
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setError("Failed to load appointments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorAppointments();
    }, [API_BASE_URL]);

    return (
        <div className="appointments-page">
            <Sidebar />
            <div className="appointments-container">
                <h2 className="title">Dr. {doctorName}'s Appointments</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <>
                        {/* Separate box for Today's Appointments Count */}
                        <div className="today-box">
                            <h3>Today's Appointments</h3>
                            <p>{todayAppointments.length}</p>
                        </div>

                        {appointments.length === 0 ? (
                            <p>No appointments found.</p>
                        ) : (
                            <>
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                                    const dayAppointments = appointments.filter(app => app.date === day);

                                    return (
                                        dayAppointments.length > 0 && (
                                            <div key={day} className="appointments-card">
                                                <h3>{day}</h3>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Patient Name</th>
                                                            <th>User Name</th>
                                                            <th>Email</th>
                                                            <th>Phone</th>
                                                            <th>Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dayAppointments.map((appointment) => (
                                                            <tr key={appointment._id}>
                                                                <td>{appointment.patientName}</td>
                                                                <td>{appointment.patientUsername}</td>
                                                                <td>{appointment.patientEmail}</td>
                                                                <td>{appointment.patientPhone}</td>

                                                                <td className="time-badge">{appointment.time}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                    );
                                })}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointments;
