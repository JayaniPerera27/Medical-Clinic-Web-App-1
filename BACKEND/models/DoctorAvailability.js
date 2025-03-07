const mongoose = require("mongoose");

const DoctorAvailabilitySchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    availableSlots: [
        {
            day: { type: String, required: true }, // Example: "Monday"
            time: { type: String, required: true }, // Example: "09:00 AM - 11:00 AM"
            maxPatients: { type: Number, required: true } // Example: 10 patients
        }
    ]
});

module.exports = mongoose.model("DoctorAvailability", DoctorAvailabilitySchema);