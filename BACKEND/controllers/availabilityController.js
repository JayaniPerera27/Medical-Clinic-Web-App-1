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

// Delete a specific availability slot
exports.deleteAvailability = async (req, res) => {
    try {
        const { slotId } = req.params;

        // Find the doctor using the user ID in the request
        const doctor = await User.findById(req.user.id);

        // Check if the doctor exists and has the correct role
        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).json({ message: "Only doctors can delete availability slots." });
        }

        // Find the availability slot in the doctor's schedule and remove it
        let availabilityUpdated = false;
        doctor.availability = doctor.availability.filter(daySlot => {
            daySlot.timeSlots = daySlot.timeSlots.filter(slot => {
                if (slot._id.toString() === slotId) {
                    availabilityUpdated = true;
                    return false;  // Removes the matched slot
                }
                return true;  // Keeps the rest
            });
            return daySlot.timeSlots.length > 0;  // Keeps daySlots that have time slots left
        });

        // If no slot was removed, return a 404 error
        if (!availabilityUpdated) {
            return res.status(404).json({ message: "Availability slot not found." });
        }

        // Save the updated availability to the doctor document
        await doctor.save();

        // Respond with success message and the updated availability
        res.status(200).json({ message: "Availability slot deleted successfully", availability: doctor.availability });
    } catch (error) {
        console.error("Error deleting availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Update a specific availability slot
exports.updateAvailability = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { startTime, endTime, maxPatients } = req.body;

        const doctor = await User.findById(req.user.id);

        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).json({ message: "Only doctors can update availability slots." });
        }

        // Update the slot inside the correct day and time slots array
        let availabilityUpdated = false;
        doctor.availability.forEach(daySlot => {
            daySlot.timeSlots.forEach(slot => {
                if (slot._id.toString() === slotId) {
                    slot.startTime = startTime;
                    slot.endTime = endTime;
                    slot.maxPatients = maxPatients;
                    availabilityUpdated = true;
                }
            });
        });

        if (!availabilityUpdated) {
            return res.status(404).json({ message: "Availability slot not found." });
        }

        await doctor.save();

        res.status(200).json({ message: "Availability slot updated successfully", availability: doctor.availability });
    } catch (error) {
        console.error("Error updating availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};