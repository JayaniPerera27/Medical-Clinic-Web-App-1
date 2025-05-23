const mongoose = require('mongoose');

const clinicalappointmentSchema = new mongoose.Schema({
    patientName: String,
    patientEmail: String,
    phoneNumber: String,
    appointmentTime: String,
    appointmentDay: String,
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' } // Ensure this exists
});

module.exports = mongoose.model('clinicalAppointment', clinicalappointmentSchema);
