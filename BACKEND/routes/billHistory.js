const express = require("express");
const router = express.Router();
const BillHistory = require("../models/BillHistory");

// Save a bill to history
router.post("/save", async (req, res) => {
  try {
    const { patientName, doctorName, doctorFee, reportFee, clinicFee, totalFee } = req.body;

    const newBill = new BillHistory({
      patientName,
      doctorName,
      doctorFee,
      reportFee,
      clinicFee,
      totalFee,
    });

    await newBill.save();
    res.status(201).json({ message: "Bill history saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save bill history" });
  }
});

// Fetch all bill history records
router.get("/", async (req, res) => {
  try {
    const billHistory = await BillHistory.find().sort({ date: -1 });
    res.json(billHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bill history" });
  }
});

module.exports = router;