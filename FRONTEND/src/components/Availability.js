import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Availability.css";
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8070/api/availability"; // Backend API

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Availability = () => {
  const [availability, setAvailability] = useState({});
  const [newSlot, setNewSlot] = useState({ day: "", startTime: "", endTime: "", maxPatients: "" });
  const [editingSlot, setEditingSlot] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.availability) {
        // Grouping availability slots by day
        const groupedAvailability = response.data.availability.reduce((acc, slot) => {
          if (!acc[slot.day]) acc[slot.day] = [];
          acc[slot.day].push(slot);
          return acc;
        }, {});

        // Ensure all days are represented, even if empty
        const completeAvailability = daysOfWeek.reduce((acc, day) => {
          acc[day] = groupedAvailability[day] || [];
          return acc;
        }, {});

        setAvailability(completeAvailability);
      } else {
        setAvailability({});
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleSlotChange = (field, value) => {
    setNewSlot((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAvailability = async () => {
    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime || !newSlot.maxPatients) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (editingSlot) {
        await axios.put(`${API_BASE_URL}/update/${editingSlot._id}`, newSlot, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/set`, newSlot, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchAvailability();
      setNewSlot({ day: "", startTime: "", endTime: "", maxPatients: "" });
      setEditingSlot(null);
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const handleDeleteAvailability = async (slotId) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAvailability();
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  };

  const handleEditAvailability = (slot) => {
    setNewSlot(slot);
    setEditingSlot(slot);
  };

  return (
    <div className="availability-container">
      <h2>Doctor Availability</h2>
      <div className="availability-list">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-section">
            <h3>{day}</h3>
            {availability[day] && availability[day].length > 0 ? (
              availability[day].map((slot) => (
                <div key={slot._id} className="availability-slot">
                  <p>{slot.startTime} - {slot.endTime} ({slot.maxPatients} patients)</p>
                  <FaEdit className="edit-icon" onClick={() => handleEditAvailability(slot)} />
                  <FaTrash className="delete-icon" onClick={() => handleDeleteAvailability(slot._id)} />
                </div>
              ))
            ) : (
              <p>No availability set for {day}.</p>
            )}
          </div>
        ))}
      </div>
      <h3>{editingSlot ? "Edit Time Slot" : "Add New Time Slot"}</h3>
      <div className="availability-form">
        <select value={newSlot.day} onChange={(e) => handleSlotChange("day", e.target.value)}>
          <option value="">Select Day</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <input type="time" value={newSlot.startTime} onChange={(e) => handleSlotChange("startTime", e.target.value)} />
        <input type="time" value={newSlot.endTime} onChange={(e) => handleSlotChange("endTime", e.target.value)} />
        <input type="number" value={newSlot.maxPatients} onChange={(e) => handleSlotChange("maxPatients", e.target.value)} placeholder="Max Patients" />
      </div>
      <button onClick={handleSaveAvailability}>{editingSlot ? "Update" : "Add"} Time Slot</button>
    </div>
  );
};

export default Availability;