const User = require('../models/user');

// Add or update availability for a doctor
exports.setAvailability = async (req, res) => {
    try {
        const { availability } = req.body;

        if (!Array.isArray(availability) || availability.length === 0) {
            return res.status(400).json({ message: "Availability must be an array and cannot be empty." });
        }

        const doctor = await User.findById(req.user.id);

        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).json({ message: "Only doctors can set availability." });
        }

        doctor.availability = availability;
        await doctor.save();

        res.status(200).json({ message: "Availability updated successfully", availability: doctor.availability });
    } catch (error) {
        console.error("Error updating availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get doctor's availability
exports.getAvailability = async (req, res) => {
    try {
        const doctor = await User.findById(req.user.id).select("availability");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ availability: doctor.availability });
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
