const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const checkDoctorRole = require('../middleware/checkDoctorRole.js');
const {
    getDoctorProfile,
    updateDoctorProfile,
    changePassword,
    getDoctorPatients, 
    addPrescription, 
    getPrescriptionsForPatient, 
    updatePrescription, 
    deletePrescription 
} = require('../controllers/doctorController.js');

const { getDoctorAppointments } = require("../controllers/doctorController");


const router = express.Router();
const authenticate = require("../middleware/authenticate"); // Middleware to get doctor info from token


// Doctor Profile Routes
router.get('/doctors/profile', authMiddleware(['Doctor']), checkDoctorRole, getDoctorProfile);
router.put('/doctors/update-profile', authMiddleware(['Doctor']), checkDoctorRole, updateDoctorProfile);
router.put('/doctors/change-password', authMiddleware(['Doctor']), checkDoctorRole, changePassword);


router.get("/doctor-appointments", authenticate, getDoctorAppointments);

// Prescription Routes
router.get("/patients", authenticate, getDoctorPatients);
//router.post("/prescriptions", authMiddleware, addPrescription);             // Add a prescription
router.get("/prescriptions/:patientName", authenticate, getPrescriptionsForPatient); // Get prescriptions for a patient
router.put("/prescriptions/:prescriptionId", authenticate, updatePrescription); // Update prescription
router.delete("/prescriptions/:prescriptionId", authenticate, deletePrescription); // Delete prescription

router.post("/prescriptions/add", authenticate,addPrescription);








module.exports = router;














