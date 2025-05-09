const mongoose = require("mongoose");

const BillHistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  doctorFee: { type: Number, required: true },
  reportFee: { type: Number, required: true },
  clinicFee: { type: Number, required: true },
  totalFee: { type: Number, required: true },
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("BillHistory", BillHistorySchema);
