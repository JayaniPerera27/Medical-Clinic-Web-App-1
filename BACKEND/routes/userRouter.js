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
  

module.exports = router;
