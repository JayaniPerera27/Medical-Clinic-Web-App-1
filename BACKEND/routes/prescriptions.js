const express = require("express");
const Prescription = require("../models/Prescription");
const User = require("../models/User"); // Ensure the correct model path
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patientId", "username") // Fetch patient usernames
      .populate("doctorId", "fullName") // Fetch doctor full names

    // Fetch doctor fees separately
    const prescriptionsWithFees = await Promise.all(
      prescriptions.map(async (prescription) => {
        const doctor = await User.findOne(
          { fullName: prescription.doctorName, role: "Doctor" }, 
          "fee"
        );

        return {
          ...prescription._doc, 
          doctorFee: doctor ? doctor.fee : "N/A", 
        };
      })
    );

    res.json(prescriptionsWithFees);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Error fetching prescriptions" });
  }
});

module.exports = router;