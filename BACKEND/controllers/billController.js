const Bill = require("../models/Bill");
const User = require("../models/User"); // ✅ Import User model

// ✅ Fetch doctor fee by doctor's name
const getDoctorFee = async (req, res) => {
    try {
        const { doctorName } = req.params;
        console.log("🔎 Searching doctor with name:", doctorName);

        const doctor = await User.findOne({ fullName: doctorName, role: "Doctor" }, "doctorFee");

        if (!doctor) {
            console.log("❌ Doctor not found:", doctorName);
            return res.status(404).json({ message: "Doctor not found" });
        }

        console.log("✅ Doctor fee found:", doctor.doctorFee);
        res.status(200).json({ doctorFee: doctor.doctorFee });
    } catch (error) {
        console.error("❌ Error fetching doctor fee:", error);
        res.status(500).json({ message: "Failed to fetch doctor fee", error: error.message });
    }
};

// ✅ Fetch all bills
const getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().populate("doctorId", "fullName specialization");
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving bills", error: error.message });
    }
};

// ✅ Save bill details
const saveBillDetails = async (req, res) => {
    try {
        console.log("📥 Received bill data:", req.body);

// Ensure all required fields are provided
if (!req.body.patientId || !req.body.doctorId) {
    console.error("❌ Missing or invalid patientId/doctorId:", req.body);
    return res.status(400).json({ error: "Invalid patient or doctor information" });
}

// Ensure patientId and doctorId are MongoDB ObjectIDs
const mongoose = require("mongoose");
if (!mongoose.Types.ObjectId.isValid(req.body.patientId) || !mongoose.Types.ObjectId.isValid(req.body.doctorId)) {
    console.error("❌ Invalid ObjectID format:", req.body);
    return res.status(400).json({ error: "Invalid ObjectID format for patient or doctor" });
}


// Debugging: Check if patientId or doctorId is invalid
if (!req.body.patientId || !req.body.doctorId) {
    console.error("❌ Missing or invalid patientId/doctorId:", req.body);
    return res.status(400).json({ error: "Invalid patient or doctor information" });
}


        const { patientId, patientName, username, doctorId, doctorName, doctorFee, clinicalFee, totalFee } = req.body;

        // ✅ Validate required fields
        if (!patientId || !patientName || !username || !doctorId || !doctorName || doctorFee == null || clinicalFee == null || totalFee == null) {
            console.error("❌ Missing fields:", req.body);
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ Create and save bill
        const newBill = new Bill({
            patientId,
            patientName,
            username,
            doctorId,
            doctorName,
            doctorFee,
            clinicalFee,
            totalFee,
        });

        await newBill.save();
        console.log("✅ Bill saved successfully:", newBill);
        res.status(201).json({ message: "Bill saved successfully", bill: newBill });
    } catch (error) {
        console.error("❌ Error saving bill:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


module.exports = { getAllBills, saveBillDetails, getDoctorFee };