const Patient = require('../models/Patient');
const User = require('../models/user'); // Assuming your User model is used for clinical staff

// Fetch all patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find(); // Fetch all patients
    res.status(200).json(patients); // Send response
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

// Fetch clinical staff details
const getClinicalStaffDetails = async (req, res) => {
  try {
    const clinicalStaffId = req.user.id; // Extract user ID from token
    const clinicalStaff = await User.findById(clinicalStaffId);

    if (!clinicalStaff) {
      return res.status(404).json({ message: 'Clinical staff not found' });
    }

    res.json({
      fullName: clinicalStaff.fullName,
      email: clinicalStaff.email,
      phoneNumber: clinicalStaff.phoneNumber,
      profilePicture: clinicalStaff.profilePicture, // Include image if available
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update clinical staff details
const updateClinicalStaffDetails = async (req, res) => {
  try {
    const clinicalStaffId = req.user.id;
    const { fullName, email, phoneNumber, profilePicture } = req.body;

    const updatedStaff = await User.findByIdAndUpdate(
      clinicalStaffId,
      { fullName, email, phoneNumber, profilePicture },
      { new: true } // Return the updated document
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Clinical staff not found' });
    }

    res.json({ message: 'Profile updated successfully', updatedStaff });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getPatients, getClinicalStaffDetails, updateClinicalStaffDetails };
