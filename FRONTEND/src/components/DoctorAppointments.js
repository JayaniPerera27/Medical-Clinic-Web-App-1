import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "../styles/DoctorAppointments.css"; // Import the CSS file

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from local storage
                const response = await axios.get("http://localhost:8070/api/doctor-appointments", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setAppointments(response.data.appointments);
                    
                    // Get today's date name (e.g., "Monday")
                    const today = format(new Date(), "EEEE");
                    
                    // Filter appointments for today
                    const todaysAppointments = response.data.appointments.filter(app => app.date === today);
                    setTodayAppointments(todaysAppointments);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="appointments-container">
            <h2 className="title">Doctor's Appointments</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="summary-card">
                        <h3>Today's Appointments</h3>
                        <p>Total: {todayAppointments.length}</p>
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
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dayAppointments.map((appointment) => (
                                                        <tr key={appointment._id}>
                                                            <td>{appointment.patientName}</td>
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
    );
};

export default DoctorAppointments;
