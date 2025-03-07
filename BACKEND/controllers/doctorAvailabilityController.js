const DoctorAvailability = require('../models/DoctorAvailability.js');
const User = require('../models/user.js');

// Add Doctor Availability
const addDoctorAvailability = async (req, res) => {
    try {
        // Ensure the user is authenticated and is a doctor
        if (!req.user || req.user.role !== 'Doctor') {
            return res.status(403).json({ message: 'Access denied. Only doctors can set availability.' });
        }

        const { availableSlots } = req.body;

        // Validate that availability slots are provided
        if (!availableSlots || availableSlots.length === 0) {
            return res.status(400).json({ message: 'Please provide availability slots.' });
        }

        // Create a new DoctorAvailability entry
        const doctorAvailability = new DoctorAvailability({
            doctorId: req.user.id, // Automatically using the doctor ID from the token
            availableSlots,
        });

        await doctorAvailability.save();

        // Fetch doctor details (name, email) from the User model
        const doctor = await User.findById(req.user.id).select('fullName email');

        res.status(201).json({
            message: 'Availability added successfully',
            doctor: {
                name: doctor.fullName,
                email: doctor.email
            },
            availability: doctorAvailability,
        });

    } catch (error) {
        console.error('Error adding availability:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Doctor's Availability
const getDoctorAvailability = async (req, res) => {
    try {
        // Ensure the user is authenticated and is a doctor
        if (!req.user || req.user.role !== 'Doctor') {
            return res.status(403).json({ message: 'Access denied. Only doctors can view their availability.' });
        }

        // Fetch the doctor's availability and populate doctor details (name, email)
        const doctorAvailability = await DoctorAvailability.findOne({ doctorId: req.user.id })
            .populate('doctorId', 'fullName email');

        // If no availability found for the doctor, return 404
        if (!doctorAvailability) {
            return res.status(404).json({ message: 'No availability slots found for this doctor.' });
        }

        res.status(200).json({
            success: true,
            doctorName: doctorAvailability.doctorId.fullName,
            doctorEmail: doctorAvailability.doctorId.email,
            availableSlots: doctorAvailability.availableSlots,
        });

    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addDoctorAvailability,
    getDoctorAvailability,
};
