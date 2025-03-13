const express = require("express");
const { login, signup } = require("../controllers/userController");
const User = require("../models/User");  // Import the User model
const router = express.Router();

// Routes
router.post('/login', login);
router.post('/signup/doctors', signup);
router.post('/signup/clinical-staff', signup);
router.post('/signup/admin', signup);

// Fetch doctor fee by doctor name
router.get("/doctor-fee/:doctorName", async (req, res) => {
    const doctorName = decodeURIComponent(req.params.doctorName);  // Decode it
    console.log("Received doctor name:", doctorName);
  
    try {
      const doctor = await User.findOne({ name: doctorName, role: "doctor" });
  
      if (!doctor) {
        console.log("Doctor not found in DB");
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      console.log("Doctor fee found:", doctor.fee);
      res.json({ doctorFee: doctor.fee });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
module.exports = router;
