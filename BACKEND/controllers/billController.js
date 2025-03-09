const Bill = require("../models/Bill");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bills", error: error.message });
  }
};

// Save bill details
const saveBillDetails = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Log request body for debugging

    const { patientId, patientName, username, appointmentDoctor, doctorFee, reportFee, clinicFee } = req.body;

    // Check if any required field is missing
    if (!patientId || !patientName || !username || !appointmentDoctor || doctorFee == null || reportFee == null || clinicFee == null) {
      console.log("Missing fields:", { patientId, patientName, username, appointmentDoctor, doctorFee, reportFee, clinicFee });
      return res.status(400).json({ message: "All fields are required" });
    }

    const totalFee = doctorFee + reportFee + clinicFee;

    const newBill = new Bill({
      patientId,
      patientName,
      username,
      appointmentDoctor,
      doctorFee,
      reportFee,
      clinicFee,
      totalFee
    });

    await newBill.save();
    res.status(201).json({ message: "Bill saved successfully", bill: newBill });

  } catch (error) {
    console.error("Error saving bill:", error.message);
    res.status(500).json({ message: "Error saving bill", error: error.message });
  }
};

module.exports = { getAllBills,saveBillDetails }; 