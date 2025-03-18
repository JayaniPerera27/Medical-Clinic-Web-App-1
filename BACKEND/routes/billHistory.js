const express = require("express");
const router = express.Router();
const BillHistory = require("../models/BillHistory");

// Get billing history
router.get("/history", async (req, res) => {
    try {
        const history = await BillHistory.find();
        console.log("Fetched Billing History:", history);
        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching billing history:", error.message);
        res.status(500).json({ message: "Failed to fetch billing history", error: error.message });
    }
});

module.exports = router;