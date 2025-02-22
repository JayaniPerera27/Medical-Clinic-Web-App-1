import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "../styles/DoctorHome.css";
import Sidebar from "./Sidebar";
import doctorPhoto from "../assets/doctorphoto.jpeg";

function DoctorHome() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [doctorName, setDoctorName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8070";

    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const tokenPayload = JSON.parse(atob(token.split(".")[1]));
                setDoctorName(tokenPayload.name || "Doctor");

                const response = await axios.get(`${API_BASE_URL}/api/doctor-appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setAppointments(response.data.appointments);

                    const today = format(new Date(), "EEEE");
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

        fetchAppointments();
    }, [navigate, API_BASE_URL]);

    return (
        <div className="doctor-home-container">
            <Sidebar />

            <div className="dashboard-content">
                {/* Header Section */}
                <div className="dashboard-header">
                    <div className="doctor-info">
                        <img src={doctorPhoto} alt="Doctor" className="doctor-photo" />
                        <div>
                            <h1>Welcome, Dr. {doctorName}</h1>
                            <p>Today is {format(new Date(), "EEEE, MMMM d, yyyy")}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Statistics */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Today's Appointments</h3>
                        <p>{todayAppointments.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Appointments</h3>
                        <p>{appointments.length}</p>
                    </div>
                </div>

                {/* Doctor Responsibilities - Styled as Cards */}
                <div className="responsibilities-container">
                    <h2>Your Responsibilities</h2>
                    <div className="responsibilities-grid">
                        <div className="responsibility-card">
                            <h3>Patient Care</h3>
                            <p>Diagnose and treat patients with care and precision.</p>
                        </div>
                        <div className="responsibility-card">
                            <h3>Prescriptions</h3>
                            <p>Manage and review patient prescriptions and reports.</p>
                        </div>
                        <div className="responsibility-card">
                            <h3>Medical Guidance</h3>
                            <p>Provide expert medical guidance and counseling.</p>
                        </div>
                        <div className="responsibility-card">
                            <h3>Record Keeping</h3>
                            <p>Ensure accurate medical records and patient history.</p>
                        </div>
                        <div className="responsibility-card">
                            <h3>Collaboration</h3>
                            <p>Work with clinical staff for seamless patient care.</p>
                        </div>
                    </div>
                </div>

                {/* Loading & Error Messages */}
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error">{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
                    </div>
                ) : (
                    <h3> </h3>
                )}
            </div>
        </div>
    );
}

export default DoctorHome;
