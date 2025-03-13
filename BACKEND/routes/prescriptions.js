const express = require("express");
const Prescription = require("../models/Prescription"); // Ensure correct model path
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("doctorId", "fullName")
      .populate("patientId", "name");
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching prescriptions" });
  }
});

module.exports = router;
