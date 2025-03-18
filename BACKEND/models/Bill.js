const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    username: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assuming doctors are stored in `users` collection
    doctorFee: { type: Number, required: true },
    reportFee: { type: Number, required: true },
    clinicFee: { type: Number, required: true },
    totalFee: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", BillSchema);