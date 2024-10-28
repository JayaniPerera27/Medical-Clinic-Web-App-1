/*const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkDoctorRole = require('../middleware/checkDoctorRole');

// Doctor dashboard data endpoint
router.get('/dashboard', authMiddleware, checkDoctorRole, async (req, res) => {
  try {
    const doctorData = {
      totalAppointments: 28,
      totalPatients: 50,
      totalReports: 20,
    };
    res.json(doctorData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard data' });
  }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkDoctorRole = require('../middleware/checkDoctorRole');

router.get('/dashboard', authMiddleware, checkDoctorRole, (req, res) => {
  // Protected route only accessible by authenticated users with Doctor role
  res.json({ msg: 'Welcome to the Doctor Dashboard!' });
});

module.exports = router;



