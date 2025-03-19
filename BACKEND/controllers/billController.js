const Bill = require("../models/Bill");
const User = require("../models/User.js"); // ✅ Import User model

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
        console.log("Received request body:", req.body);

        const { patientId, patientName, username, doctorId, doctorFee, reportFee, clinicFee } = req.body;

        if (!patientId || !patientName || !username || !doctorId || doctorFee == null || clinicFee == null) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const totalFee = Number(doctorFee) + Number(reportFee) + Number(clinicFee);

        const newBill = new Bill({
            patientId,
            patientName,
            username,
            doctorId,
            doctorFee: Number(doctorFee),
            clinicFee: Number(clinicFee),
            totalFee,
        });

        await newBill.save();
        res.status(201).json({ message: "Bill saved successfully", bill: newBill });
    } catch (error) {
        console.error("Error saving bill:", error.message);
        res.status(500).json({ message: "Error saving bill", error: error.message });
    }
};

module.exports = { getAllBills, saveBillDetails, getDoctorFee };
