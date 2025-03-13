import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import "../styles/Availability.css";

const API_BASE_URL = "http://localhost:8070/api/availability";

const Availability = () => {
    const [availability, setAvailability] = useState([]);
    const [newSlot, setNewSlot] = useState({
        day: "",
        startTime: "",
        endTime: "",
        maxPatients: "",
    });
    const [editingSlotId, setEditingSlotId] = useState(null);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        console.log("Fetching availability...");
        try {
            const response = await axios.get(`${API_BASE_URL}/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("Fetched availability:", response.data);
            setAvailability(response.data.availability || []);
        } catch (error) {
            console.error("Error fetching availability:", error);
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

        // Find if the day already exists in availability
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

        console.log("Adding availability with updated data:", updatedAvailability);

        try {
            const response = await axios.post(`${API_BASE_URL}/set`, { availability: updatedAvailability }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("Availability added successfully:", response.data);

            fetchAvailability();
            setNewSlot({ day: "", startTime: "", endTime: "", maxPatients: "" });
        } catch (error) {
            console.error("Error adding availability:", error.response ? error.response.data : error);
        }
    };

    const deleteAvailability = async (day, slotId) => {
        console.log(`Deleting availability: Day=${day}, Slot ID=${slotId}`);
        try {
            await axios.delete(`${API_BASE_URL}/delete/${day}/${slotId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("Deleted availability successfully.");
            fetchAvailability();
        } catch (error) {
            console.error("Error deleting availability:", error);
        }
    };

    const handleEditClick = (day, slot) => {
        console.log("Editing slot:", slot);
        setEditingSlotId(slot._id);
        setNewSlot({ ...slot, day });
    };

    const updateAvailability = async () => {
        if (!newSlot.day || !newSlot.startTime || !newSlot.endTime || !newSlot.maxPatients) {
            alert("All fields are required!");
            return;
        }

        console.log("Updating availability with data:", newSlot);

        try {
            await axios.put(`${API_BASE_URL}/update/${editingSlotId}`, {
                day: newSlot.day,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                maxPatients: newSlot.maxPatients
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            console.log("Updated availability successfully.");
            fetchAvailability();
            setEditingSlotId(null);
            setNewSlot({ day: "", startTime: "", endTime: "", maxPatients: "" });
        } catch (error) {
            console.error("Error updating availability:", error);
        }
    };

    return (
        <div className="availability-container">
            <Sidebar />
            <h2>Doctor Availability</h2>

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
                                                <button className="save-btn" onClick={updateAvailability}>Save</button>
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
                                                <button className="delete-btn" onClick={() => deleteAvailability(daySlot.day, slot._id)}>Delete</button>
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
                <input type="time" name="startTime" value={newSlot.startTime} onChange={handleInputChange} />
                <input type="time" name="endTime" value={newSlot.endTime} onChange={handleInputChange} />
                <input type="number" name="maxPatients" placeholder="Max Patients" value={newSlot.maxPatients} onChange={handleInputChange} />
                <button className="add-btn" onClick={addAvailability}>Add</button>
            </div>
        </div>
    );
};

export default Availability;
