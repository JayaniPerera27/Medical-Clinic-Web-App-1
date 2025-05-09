import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import "../styles/Availability.css";

//const API_BASE_URL = "http://localhost:3001/api/availability";
const API_BASE_URL = "https://medical-clinic-web-app-backend.vercel.app/api/availability";

const Availability = () => {
    const [availability, setAvailability] = useState([]);
    const [newSlot, setNewSlot] = useState({
        day: "",
        startTime: "",
        endTime: "",
        maxPatients: "",
    });
    const [editingSlotId, setEditingSlotId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${API_BASE_URL}/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setAvailability(response.data.availability || []);
        } catch (err) {
            setError("Failed to fetch availability. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
    };

    const addAvailability = async () => {
        if (!newSlot.day || !newSlot.startTime || !newSlot.endTime || !newSlot.maxPatients) {
            alert("All fields are required!");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const existingDay = availability.find(daySlot => daySlot.day === newSlot.day);
            const updatedAvailability = existingDay
                ? availability.map(daySlot =>
                    daySlot.day === newSlot.day
                        ? { ...daySlot, timeSlots: [...daySlot.timeSlots, { 
                            startTime: newSlot.startTime, 
                            endTime: newSlot.endTime, 
                            maxPatients: newSlot.maxPatients }] }
                        : daySlot
                )
                : [...availability, {
                    day: newSlot.day,
                    timeSlots: [{
                        startTime: newSlot.startTime,
                        endTime: newSlot.endTime,
                        maxPatients: newSlot.maxPatients
                    }]
                }];

            await axios.post(`${API_BASE_URL}/set`, { availability: updatedAvailability }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            fetchAvailability();
            setNewSlot({ day: "", startTime: "", endTime: "", maxPatients: "" });
        } catch (error) {
            setError("Failed to add availability. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteAvailability = async (slotId) => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(`${API_BASE_URL}/delete/${slotId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            fetchAvailability();
        } catch (error) {
            setError("Failed to delete availability. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (day, slot) => {
        setEditingSlotId(slot._id);
        setNewSlot({ ...slot, day });
    };

    const updateAvailability = async () => {
        if (!newSlot.day || !newSlot.startTime || !newSlot.endTime || !newSlot.maxPatients) {
            alert("All fields are required!");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.put(`${API_BASE_URL}/update/${editingSlotId}`, {
                day: newSlot.day,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                maxPatients: newSlot.maxPatients
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            fetchAvailability();
            setEditingSlotId(null);
            setNewSlot({ day: "", startTime: "", endTime: "", maxPatients: "" });
        } catch (error) {
            setError("Failed to update availability. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="availability-container">
            <Sidebar />
            <h2>Doctor Availability</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            <table className="availability-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Max Patients</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {availability.length > 0 ? (
                        availability.map((daySlot) => (
                            daySlot.timeSlots.map((slot) => (
                                <tr key={slot._id}>
                                    {editingSlotId === slot._id ? (
                                        <>
                                            <td>
                                                <select name="day" value={newSlot.day} onChange={handleInputChange}>
                                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                                        <option key={day} value={day}>{day}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td><input type="time" name="startTime" value={newSlot.startTime} onChange={handleInputChange} /></td>
                                            <td><input type="time" name="endTime" value={newSlot.endTime} onChange={handleInputChange} /></td>
                                            <td><input type="number" name="maxPatients" value={newSlot.maxPatients} onChange={handleInputChange} /></td>
                                            <td>
                                                <button className="save-btn" onClick={updateAvailability} disabled={loading}>Save</button>
                                                <button className="cancel-btn" onClick={() => setEditingSlotId(null)}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{daySlot.day}</td>
                                            <td>{slot.startTime}</td>
                                            <td>{slot.endTime}</td>
                                            <td>{slot.maxPatients}</td>
                                            <td>
                                                <button className="edit-btn" onClick={() => handleEditClick(daySlot.day, slot)}>Edit</button>
                                                <button className="delete-btn" onClick={() => deleteAvailability(slot._id)} disabled={loading}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No availability set.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="add-availability">
                <h3>Add New Slot</h3>
                <select name="day" value={newSlot.day} onChange={handleInputChange}>
                    <option value="">Select Day</option>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>
                <h5>Start Time</h5>
                <input type="time" name="startTime" value={newSlot.startTime} onChange={handleInputChange} ></input>
                <h5>End Time</h5>
                <input type="time" name="endTime" value={newSlot.endTime} onChange={handleInputChange} ></input>
                <input type="number" name="maxPatients" placeholder="Max Patients" value={newSlot.maxPatients} onChange={handleInputChange} />
                <button className="add-btn" onClick={addAvailability} disabled={loading}>Add</button>
            </div>
        </div>
    );
};

export default Availability;