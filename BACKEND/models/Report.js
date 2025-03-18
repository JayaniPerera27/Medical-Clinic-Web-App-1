const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", required: true },
  patientName: { type: String, required: true },
  patientUsername: { type: String, required: true },  // <-- Ensure this exists
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  medicines: { type: Array, required: true },
  additionalNotes: { type: String }
});

module.exports = mongoose.model("Report", ReportSchema);