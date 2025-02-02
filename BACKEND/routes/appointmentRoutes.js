const express = require('express');
const router = express.Router();
//const { authenticate } = require('../middleware/authMiddleware'); // Middleware to check JWT
//const authenticate = require('../middleware/authMiddleware'); // Correct import

const authMiddleware = require('../middleware/authMiddleware'); // Adjusted to match export


//const authMiddleware = require('../middleware/authMiddleware');

const Appointment = require('../models/Appointment'); // Mongoose model for appointments

// GET /api/appointments - Fetch appointments for a logged-in doctor
router.get('/', authMiddleware, async (req, res) => {

//router.get('/', authenticate, async (req, res) => {
  try {
    const doctorId = req.user.userId; // Extracted from JWT token

    // Fetch appointments from the database
    const appointments = await Appointment.find({ doctor: doctorId });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

module.exports = router;

