const Appointment = require('../models/clinicalAppointment');

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctorId'); // Ensure this path exists in schema
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments" });
    }
};