const express = require('express');
const { login, signup } = require('../controllers/userController');
const User = require("../models/User");
const router = express.Router();

// Routes
router.post('/login', login);
router.post('/signup/doctors', signup);
router.post('/signup/clinical-staff', signup);
router.post('/signup/admin', signup);

// ✅ GET Count of Doctors
router.get("/count-doctors", async (req, res) => {
    try {
      const count = await User.countDocuments({ role: "Doctor" });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });

  // ✅ GET Count of Clinical Staff
router.get("/count-clinical-staff", async (req, res) => {
    try {
      const count = await User.countDocuments({ role: "Clinical Staff" });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });
  // ✅ GET All Doctors
router.get("/doctors", async (req, res) => {
    try {
      const doctors = await User.find({ role: "Doctor" });
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });
  
  // Get doctor's fee by name
router.get("/get-doctor-fee/:doctorName", async (req, res) => {
  try {
    const doctorName = decodeURIComponent(req.params.doctorName);
    const doctor = await User.findOne({ fullName: doctorName, role: "Doctor" });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ doctorFee: doctor.doctorFee || 0 });
  } catch (error) {
    console.error("Error fetching doctor fee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
