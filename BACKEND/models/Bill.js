const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    username: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorFee: { type: Number, required: true },
    reportFee: { type: Number, required: true },
    clinicFee: { type: Number, required: true },
    totalFee: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", billSchema);
