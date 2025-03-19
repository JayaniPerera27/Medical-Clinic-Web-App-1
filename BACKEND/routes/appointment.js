const express = require("express");
const router = express.Router();
const { getAppointments } = require("../controllers/appointmentController");
const Appointment = require("../models/Appointment");

router.get("/", getAppointments);  // ✅ Use controller function

// ✅ GET All Appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;