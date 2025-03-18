const Bill = require("../models/Bill");

// Get all bills
const getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().populate("doctorId", "fullName specialization");
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving bills", error: error.message });
    }
};

// Save bill details
const saveBillDetails = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

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
        });

        await newBill.save();
        res.status(201).json({ message: "Bill saved successfully", bill: newBill });
    } catch (error) {
        console.error("Error saving bill:", error.message);
        res.status(500).json({ message: "Error saving bill", error: error.message });
    }
};

module.exports = { getAllBills, saveBillDetails };