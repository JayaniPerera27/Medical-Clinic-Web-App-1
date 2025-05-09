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
    //updatePrescription, 
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
router.get("/doctors/patients", authenticate, getDoctorPatients);
//router.post("/prescriptions", authMiddleware, addPrescription);             // Add a prescription
router.get("/prescriptions/:patientUsername", authenticate, getPrescriptionsForPatient); // Get prescriptions for a patient
//router.put("/prescriptions/:prescriptionId", authenticate, updatePrescription); // Update prescription
router.delete("/prescriptions/:prescriptionId", authenticate, deletePrescription); // Delete prescription

router.post("/prescriptions/add", authenticate,addPrescription);

// Get doctor by ID
router.get('/doctors/:id', async (req, res) => {
    try {
      const doctor = await User.findById(req.params.id).select('-password');
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      if (doctor.role !== 'doctor') {
        return res.status(400).json({ message: 'User is not a doctor' });
      }
      
      res.json(doctor);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update doctor
router.put('/doctors/:id', async (req, res) => {
    try {
      const {
        fullName,
        email,
        phoneNumber,
        specialization,
        yearsOfExperience,
        medicalLicenseNumber,
        doctorFee
      } = req.body;
  
      // Find doctor
      let doctor = await User.findById(req.params.id);
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      if (doctor.role !== 'doctor') {
        return res.status(400).json({ message: 'User is not a doctor' });
      }
  
      // Check if email is being changed and if it already exists
      if (email !== doctor.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
  
      // Update fields
      doctor.fullName = fullName || doctor.fullName;
      doctor.email = email || doctor.email;
      doctor.phoneNumber = phoneNumber || doctor.phoneNumber;
      doctor.specialization = specialization || doctor.specialization;
      doctor.yearsOfExperience = yearsOfExperience || doctor.yearsOfExperience;
      doctor.medicalLicenseNumber = medicalLicenseNumber || doctor.medicalLicenseNumber;
      doctor.doctorFee = doctorFee || doctor.doctorFee;
  
      await doctor.save();
  
      // Return updated doctor without password
      const doctorResponse = doctor.toObject();
      delete doctorResponse.password;
      
      res.json(doctorResponse);
    } catch (error) {
      console.error('Error updating doctor:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete doctor
  router.delete('/doctors/:id', async (req, res) => {
    try {
      const doctor = await User.findById(req.params.id);
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      if (doctor.role !== 'doctor') {
        return res.status(400).json({ message: 'User is not a doctor' });
      }
  
      await User.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      console.error('Error deleting doctor:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });



module.exports = router;