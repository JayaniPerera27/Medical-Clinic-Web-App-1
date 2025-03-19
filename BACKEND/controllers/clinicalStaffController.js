const User = require('../models/User.js');

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
      role: clinicalStaff.role,
      profilePicture: clinicalStaff.profilePicture, // Include image if available
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getClinicalStaffDetails };