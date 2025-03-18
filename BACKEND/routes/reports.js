const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const Report = require("../models/Report");

// Get all prescriptions
router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});


// Send a report and save it
router.post("/send-report/:id", async (req, res) => {
  try {
    const prescriptionId = req.params.id;

    // Fetch prescription and populate its medicines
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // ✅ Ensure medicines are included
    const newReport = new Report({
      prescriptionId: prescription._id,
      patientName: prescription.patientName,
      patientUsername: prescription.patientUsername || "Unknown",
      doctorName: prescription.doctorName,
      date: new Date().toISOString(),
      medicines: prescription.medicines,  // <-- This ensures medicines are stored
      additionalNotes: req.body.additionalNotes || "No additional notes.",
    });

    await newReport.save();
    res.status(201).json({ message: "Report sent and saved successfully" });

  } catch (error) {
    console.error("❌ Error in sending report:", error);
    res.status(500).json({ error: "Failed to send and save report", details: error.message });
  }
});



module.exports = router;