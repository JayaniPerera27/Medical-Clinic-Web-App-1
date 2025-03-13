const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription"); // Make sure this path is correct

// Route to fetch unique doctor names from prescriptions
router.get("/prescribing-doctors", async (req, res) => {
    try {
        const doctors = await Prescription.aggregate([
            { $group: { _id: "$doctorName" } }, // Get unique doctor names
            { $sort: { _id: 1 } } // Optional: Sort alphabetically
        ]);

        res.status(200).json(doctors.map(doc => doc._id)); // Return doctor names
    } catch (error) {
        res.status(500).json({ message: "Error fetching prescribing doctors", error });
    }
});

module.exports = router;
