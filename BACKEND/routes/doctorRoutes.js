const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const checkDoctorRole = require('../middleware/checkDoctorRole.js');
const {
    getDoctorProfile,
    updateDoctorProfile,
    changePassword,
    savePrescription,
    getPrescriptionsForDoctor,
} = require('../controllers/doctorController.js');

const router = express.Router();
const Appointment = require("../models/Appointment");
const authenticate = require("../middleware/authenticate"); // Middleware to get doctor info from token

// Doctor Profile Routes
router.get('/doctors/profile', authMiddleware(['Doctor']), checkDoctorRole, getDoctorProfile);
router.put('/doctors/update-profile', authMiddleware(['Doctor']), checkDoctorRole, updateDoctorProfile);
router.put('/doctors/change-password', authMiddleware(['Doctor']), checkDoctorRole, changePassword);

// Prescription Routes
router.post('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, savePrescription);
router.get('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, getPrescriptionsForDoctor);

router.get("/doctor-appointments", authenticate, async (req, res) => {
    try {
        if (!req.user || !req.user.name) {
            return res.status(401).json({ success: false, message: "Unauthorized: Doctor name not found in token" });
        }

        let doctorName = req.user.name; // Extract doctor name from JWT token
        console.log("Doctor Name from Token:", doctorName);

        // Clean the doctor's name and add "Dr. " back if it's missing
        const cleanedDoctorName = doctorName.replace(/^Dr\.\s*/i, "").trim();
        const doctorNameWithDr = "Dr. " + cleanedDoctorName;
        console.log("Doctor Name with Dr.:", doctorNameWithDr);

        // Match both possible names (with and without "Dr. ")
        const appointments = await Appointment.find({
            $or: [
                { doctorName: { $regex: new RegExp(`^${doctorName}$`, "i") } },  // Original name
                { doctorName: { $regex: new RegExp(`^${doctorNameWithDr}$`, "i") } } // Name with "Dr."
            ]
        });

        if (!appointments.length) {
            return res.status(404).json({ success: false, message: "No appointments found for this doctor" });
        }

        res.json({ success: true, appointments });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});





module.exports = router;














