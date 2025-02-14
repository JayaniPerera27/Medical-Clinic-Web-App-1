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

// Get appointments for the logged-in doctor
router.get("/doctor-appointments", authenticate, async (req, res) => {
    try {
        const doctorName = req.user.fullName; // Extracted from JWT token

        const appointments = await Appointment.find({ doctorName });

        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;














