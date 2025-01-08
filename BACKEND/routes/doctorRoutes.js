/*const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkDoctorRole = require('../middleware/checkDoctorRole');
//const Doctor = require('../models/User'); // Import the User model
//const User = require('../models/User');
const { getDoctorProfile, updateDoctorProfile } = require('../controllers/doctorController');



// Fetch doctor profile
router.get('/doctors/profile', authMiddleware, checkDoctorRole, getDoctorProfile, async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id); // Log the user ID
    const doctor = await User.findOne({ _id: req.user.id, role: 'Doctor' });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});


// Update doctor profile
router.put('/doctors/update-profile', authMiddleware, checkDoctorRole,updateDoctorProfile, async (req, res) => {
  const { fullName, email, phoneNumber, specialization, yearsOfExperience } = req.body;

  try {
    const doctorId = req.user.id;
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { fullName, email, phoneNumber, specialization, yearsOfExperience },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Profile updated successfully', doctor: updatedDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

const {
  getPatientsForDoctor,
  savePrescription,
  getPrescriptionsForDoctor,
} = require('../controllers/doctorController');

// Get patients assigned to the doctor
router.get('/doctor/patients', authMiddleware, checkDoctorRole, getPatientsForDoctor);

// Save a prescription
router.post('/doctor/prescriptions', authMiddleware, checkDoctorRole, savePrescription);

// Get prescriptions for the doctor
router.get('/doctor/prescriptions', authMiddleware, checkDoctorRole, getPrescriptionsForDoctor);

module.exports = router;*/

/*onst express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const checkDoctorRole = require('../middleware/checkDoctorRole.js');

const {
  getDoctorProfile,
  updateDoctorProfile,
  changePassword,
  getPatientsForDoctor,
  savePrescription,
  getPrescriptionsForDoctor,
} = require('../controllers/doctorController.js');

// Fetch doctor profile
router.get('/doctors/profile', authMiddleware, checkDoctorRole, getDoctorProfile);

// Update doctor profile
router.put('/doctors/update-profile', authMiddleware, checkDoctorRole, updateDoctorProfile);

// Change Password Route
router.put('/doctors/change-password', authMiddleware, changePassword);

// Get patients assigned to the doctor
//router.get('/doctors/patients', authMiddleware, checkDoctorRole, getPatientsForDoctor);

// Save a prescription
//router.post('/doctors/prescriptions', authMiddleware, checkDoctorRole, savePrescription);


// Get prescriptions for the doctor
//router.get('/doctors/prescriptions', authMiddleware, checkDoctorRole, getPrescriptionsForDoctor);

module.exports = router;*/

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

// Doctor Profile Routes
router.get('/doctors/profile', authMiddleware(['Doctor']), checkDoctorRole, getDoctorProfile);
router.put('/doctors/update-profile', authMiddleware(['Doctor']), checkDoctorRole, updateDoctorProfile);
router.put('/doctors/change-password', authMiddleware(['Doctor']), checkDoctorRole, changePassword);

// Prescription Routes
router.post('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, savePrescription);
router.get('/doctors/prescriptions', authMiddleware(['Doctor']), checkDoctorRole, getPrescriptionsForDoctor);

module.exports = router;














