const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctorName: String,
    date: String,
    time: String,
    patientName: String,
    patientEmail: String,
    patientPhone: String,
    patientUsername: String

});

module.exports = mongoose.model("Appointment", appointmentSchema);
