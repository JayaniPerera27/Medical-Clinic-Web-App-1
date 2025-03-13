const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const BillHistory = require("../models/BillHistory");
const User = require("../models/User");

// ✅ Route to save a fee
router.post("/save-fee", async (req, res) => {
    try {
        const { patientId, patientName, username, doctorId, doctorFee, reportFee, clinicFee } = req.body;

        if (!patientId || !patientName || !username || !doctorId || doctorFee == null || reportFee == null || clinicFee == null) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const totalFee = Number(doctorFee) + Number(reportFee) + Number(clinicFee);

        const newBill = new Bill({
            patientId,
            patientName,
            username,
            doctorId,
            doctorFee: Number(doctorFee),
            reportFee: Number(reportFee),
            clinicFee: Number(clinicFee),
            totalFee,
            date: new Date(),
        });

        await newBill.save();
        res.status(201).json({ message: "Fee saved successfully", bill: newBill });
    } catch (error) {
        console.error("Error saving fee:", error);
        res.status(500).json({ message: "Failed to save fee", error: error.message });
    }
});

// ✅ Route to move all bills to history
router.post("/move-to-history", async (req, res) => {
    try {
        const allBills = await Bill.find().populate("doctorId", "fullName"); // ✅ Fetch doctor name

        if (allBills.length === 0) {
            return res.status(400).json({ message: "No bills found to move." });
        }

        const historyEntries = allBills.map((bill) => ({
            patientName: bill.patientName,
            doctorName: bill.doctorId.fullName, // ✅ Ensure doctor name is assigned
            doctorFee: bill.doctorFee,
            reportFee: bill.reportFee,
            clinicFee: bill.clinicFee,
            totalFee: bill.totalFee,
            date: new Date(),
        }));

        await BillHistory.insertMany(historyEntries);
        await Bill.deleteMany();

        res.json({ message: "Bills moved to history successfully" });
    } catch (error) {
        console.error("Error moving bills to history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Route to fetch all billing history, grouped by patientName
router.get("/history", async (req, res) => {
    try {
        const bills = await Bill.find().populate("doctorId", "fullName specialization");

        if (bills.length === 0) {
            return res.status(200).json({});
        }

        // ✅ Group bills by patientName
        const groupedBills = bills.reduce((acc, bill) => {
            if (!acc[bill.patientName]) {
                acc[bill.patientName] = [];
            }
            acc[bill.patientName].push({
                billId: bill._id,
                doctorName: bill.doctorId.fullName, // ✅ Ensure doctor name is displayed
                doctorFee: bill.doctorFee,
                reportFee: bill.reportFee,
                clinicFee: bill.clinicFee,
                totalFee: bill.totalFee,
                date: bill.date,
            });
            return acc;
        }, {});

        res.status(200).json(groupedBills);
    } catch (error) {
        console.error("Error fetching billing history:", error);
        res.status(500).json({ message: "Failed to fetch billing history" });
    }
});

module.exports = router;
