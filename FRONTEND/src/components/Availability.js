import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Availability.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8070/api/availability"; // Backend API

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [newSlot, setNewSlot] = useState({ day: "", startTime: "", endTime: "", maxPatients: "" });
  const [editingSlot, setEditingSlot] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAvailability();
  }, []);

  // ✅ ( + ) Fetch doctor's availability
  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailability(response.data.availability || []);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  // ✅ Handle input change
  const handleSlotChange = (field, value) => {
    setNewSlot((prevSlot) => ({ ...prevSlot, [field]: value }));
  };

  // ✅ ( + ) Add or update availability slot
  const handleSaveAvailability = async () => {
    try {
      if (!newSlot.day || !newSlot.startTime || !newSlot.endTime || !newSlot.maxPatients) {
        alert("Please fill in all fields.");
        return;
      }

      if (editingSlot) {
        // ✅ Update existing slot
        await axios.put(
          `${API_BASE_URL}/update/${editingSlot._id}`,
          newSlot,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // ✅ Add new slot
        await axios.post(
          `${API_BASE_URL}/set`,
          newSlot,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchAvailability();
      setNewSlot({ day: "", startTime: "", endTime: "", maxPatients: "" });
      setEditingSlot(null);
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  // ✅ ( + ) Delete slot
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

  // ✅ ( + ) Start editing a slot
  const handleEditAvailability = (slot) => {
    setNewSlot(slot);
    setEditingSlot(slot);
  };

  return (
    <div className="availability-container">
      <h2>Doctor Availability</h2>

      {/* ✅ ( + ) Availability List */}
      <div className="availability-list">
        {availability.length > 0 ? (
          availability.map((slot) => (
            <div key={slot._id} className="availability-slot">
              <h3>{slot.day}</h3>
              <p>{slot.startTime} - {slot.endTime} ({slot.maxPatients} patients)</p>
              <div className="action-buttons">
                <FaEdit className="edit-icon" onClick={() => handleEditAvailability(slot)} />
                <FaTrash className="delete-icon" onClick={() => handleDeleteAvailability(slot._id)} />
              </div>
            </div>
          ))
        ) : (
          <p>No availability set.</p>
        )}
      </div>

      {/* ✅ ( + ) Add / Edit Availability Section */}
      <h3>{editingSlot ? "Edit Availability" : "Add Availability"}</h3>
      <div className="availability-form">
        <select value={newSlot.day} onChange={(e) => handleSlotChange("day", e.target.value)}>
          <option value="">Select Day</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <input
          type="time"
          value={newSlot.startTime}
          onChange={(e) => handleSlotChange("startTime", e.target.value)}
          placeholder="Start Time"
        />
        <input
          type="time"
          value={newSlot.endTime}
          onChange={(e) => handleSlotChange("endTime", e.target.value)}
          placeholder="End Time"
        />
        <select value={newSlot.maxPatients} onChange={(e) => handleSlotChange("maxPatients", e.target.value)}>
          <option value="">Max Patients</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* ✅ Save / Update Button */}
      <button onClick={handleSaveAvailability}>
        {editingSlot ? "Update Availability" : "Save Availability"}
      </button>
    </div>
  );
};

export default Availability;
