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

const { getDoctorAppointments } = require("../controllers/doctorController");


const router = express.Router();
const authenticate = require("../middleware/authenticate"); // Middleware to get doctor info from token


// Doctor Profile Routes
router.get('/doctors/profile', authMiddleware(['Doctor']), checkDoctorRole, getDoctorProfile);
router.put('/doctors/update-profile', authMiddleware(['Doctor']), checkDoctorRole, updateDoctorProfile);
router.put('/doctors/change-password', authMiddleware(['Doctor']), checkDoctorRole, changePassword);

// Prescription Routes
router.post('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, savePrescription);
router.get('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, getPrescriptionsForDoctor);

router.get("/doctor-appointments", authenticate, getDoctorAppointments);






module.exports = router;














