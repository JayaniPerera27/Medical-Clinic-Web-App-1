const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    medicines: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            instructions: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
