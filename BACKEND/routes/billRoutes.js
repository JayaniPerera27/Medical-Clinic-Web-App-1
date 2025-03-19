const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const BillHistory = require("../models/BillHistory");
const { getDoctorFee } = require("../controllers/billController");
const User = require("../models/User"); // Ensure you import the User model

// ✅ Route to fetch doctor's fee by doctor name
router.get("/users/doctor-fee/:doctorName", async (req, res) => {
    try {
        const doctorName = decodeURIComponent(req.params.doctorName).trim(); // Decode URL encoding

        console.log("🔍 Fetching doctor fee for:", doctorName); // Debugging log

        // ✅ Find doctor in the `users` collection
        const doctor = await User.findOne({ fullName: doctorName, role: "Doctor" });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ doctorFee: doctor.doctorFee });
    } catch (error) {
        console.error("❌ Error fetching doctor fee:", error);
        res.status(500).json({ message: "Failed to fetch doctor fee", error: error.message });
    }
});

// ✅ Save bill to `bills` collection
router.post("/api/billing/save-fee", async (req, res) => {
    try {
        const { patientName, doctorName, doctorFee, clinicalFee, reportFee, totalFee } = req.body;

        const newBill = new Bill({
            patientName,
            doctorName,
            doctorFee,
            clinicalFee,
            totalFee,
        });

        await newBill.save();
        res.status(201).json({ message: "Bill saved successfully" });
    } catch (error) {
        console.error("Error saving bill:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get all saved bills
router.get("/history", async (req, res) => {
    try {
        const bills = await Bill.find().populate("doctorId", "fullName specialization");

        if (!bills || bills.length === 0) {
            return res.status(200).json([]); // ✅ Return an empty array, NOT an object!
        }

        console.log("Fetched Bills:", bills); // ✅ Debugging log

        const groupedBills = bills.reduce((acc, bill) => {
            if (!acc[bill.patientName]) {
                acc[bill.patientName] = [];
            }
            acc[bill.patientName].push({
                billId: bill._id,
                doctorName: bill.doctorId?.fullName || "Unknown",
                doctorFee: bill.doctorFee,
                clinicFee: bill.clinicFee,
                totalFee: bill.totalFee,
                date: bill.date,
            });
            return acc;
        }, {});

        console.log("Grouped Bills:", groupedBills); // ✅ Debugging log
        res.status(200).json(Object.values(groupedBills).flat()); // ✅ Ensure response is an array
    } catch (error) {
        console.error("Error fetching billing history:", error);
        res.status(500).json({ message: "Failed to fetch billing history", error: error.message });
    }
});

// ✅ Move all bills to `billHistory` collection
router.post("/move-to-history", async (req, res) => {
    try {
        const allBills = await Bill.find().populate("doctorId", "fullName");

        if (allBills.length === 0) {
            return res.status(400).json({ message: "No bills found to move." });
        }

        const historyEntries = allBills.map((bill) => ({
            patientName: bill.patientName,
            doctorName: bill.doctorId.fullName,
            doctorFee: bill.doctorFee,
            clinicFee: bill.clinicFee,
            totalFee: bill.totalFee,
            date: new Date(),
        }));

        await BillHistory.insertMany(historyEntries);
        await Bill.deleteMany(); // Clear `bills` collection after moving

        res.json({ message: "Bills moved to history successfully" });
    } catch (error) {
        console.error("Error moving bills to history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
