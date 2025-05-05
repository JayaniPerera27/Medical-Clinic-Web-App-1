const express = require("express");
const router = express.Router();
const BillHistory = require("../models/BillHistory");
const Bill = require("../models/Bill"); // Assuming you have a Bill model

// Get all billing history with optional patient/doctor filtering
router.get("/history", async (req, res) => {
    try {
      const { patientId, doctorId } = req.query;
      let query = {};
  
      if (patientId) query.patientId = patientId;
      if (doctorId) query.doctorId = doctorId;
  
      // Fetch from bills collection directly
      const history = await Bill.find(query)
        .sort({ createdAt: -1 });
  
      res.status(200).json(history);
    } catch (error) {
      console.error("Error fetching billing history:", error);
      res.status(500).json({ 
        message: "Failed to fetch billing history", 
        error: error.message 
      });
    }
  });

// Move bill from active bills to history (when paid)
router.post("/archive", async (req, res) => {
  try {
    const { billId } = req.body;
    
    // Find the bill to archive
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Create history record
    const historyRecord = new BillHistory({
      patientId: bill.patientId,
      patientName: bill.patientName,
      doctorId: bill.doctorId,
      doctorName: bill.doctorName,
      doctorFee: bill.doctorFee,
      reportFee: bill.reportFee,
      clinicalFee: bill.clinicalFee,
      totalFee: bill.totalFee,
      prescriptions: bill.prescriptions
    });

    await historyRecord.save();
    
    // Remove the original bill
    await Bill.findByIdAndDelete(billId);

    res.status(201).json({ message: "Bill archived successfully", historyRecord });
  } catch (error) {
    console.error("Error archiving bill:", error);
    res.status(500).json({ message: "Failed to archive bill", error: error.message });
  }
});

module.exports = router;