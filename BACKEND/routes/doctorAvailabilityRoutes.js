const express = require('express');
const router = express.Router();
const { addDoctorAvailability, getDoctorAvailability } = require('../controllers/doctorAvailabilityController.js');
const authenticate = require("../middleware/authenticate"); // Middleware to get doctor info from token

// Add doctor availability route
router.post('/availability', authenticate, addDoctorAvailability);

// Get doctor availability route
router.get('/availability', authenticate, getDoctorAvailability);

module.exports = router;
