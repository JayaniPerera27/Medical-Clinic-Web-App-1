const mongoose = require("mongoose");

// models/Bill.js
const BillSchema = new mongoose.Schema({
    patientId: { type: String, required: true }, // Changed from ObjectId to String
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    username: { type: String, required: true },
    doctorId: { type: String, required: true }, // Changed from ObjectId to String
    doctorFee: { type: Number, required: true },
    clinicalFee: { type: Number, required: true },
    totalFee: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", BillSchema);