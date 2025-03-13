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
    const doctorName = decodeURIComponent(req.params.doctorName);
    console.log("🔎 Searching doctor with name:", doctorName);

    try {
        // Explicitly fetch only the required fields
        const doctor = await User.findOne(
            { fullName: doctorName, role: "Doctor" },
            { doctorFee: 1 }
        );

        console.log("🛠️ Query Result:", doctor);

        if (!doctor) {
            console.log("❌ Doctor not found in DB");
            return res.status(404).json({ message: "Doctor not found" });
        }

        console.log("✅ Doctor fee found:", doctor.doctorFee);
        res.json({ doctorFee: doctor.doctorFee });
    } catch (error) {
        console.error("⚠️ Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



  
module.exports = router;
