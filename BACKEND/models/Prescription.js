const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
    patientName: { type: String,required: false},
    patientUsername: { type: String,required: true},
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    medicines: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            instructions: { type: String, required: true }
        }
    ],
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Add doctorId
patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Add patientId

});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
