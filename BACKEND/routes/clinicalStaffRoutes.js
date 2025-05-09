const express = require("express");
const router = express.Router();
const User = require("../models/User");
const clinicalMiddleware = require("../middleware/clinicalMiddleware");
const bcrypt = require("bcryptjs");

// ✅ GET Clinical Staff Details (Already exists)
router.get("/settings", clinicalMiddleware(["Clinical Staff"]), async (req, res) => {
    try {
        console.log("Fetching clinical staff details for user ID:", req.user.userId); // Log the user ID
        const staff = await User.findById(req.user.userId).select("-password");
        if (!staff) return res.status(404).json({ error: "Clinical Staff not found" });
        res.json(staff);
    } catch (error) {
        console.error("Error fetching clinical staff details:", error); // Log the error
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ UPDATE Clinical Staff Profile (Fix for 404)
router.put("/settings/update", clinicalMiddleware(["Clinical Staff"]), async (req, res) => {
    try {
        const { fullName, phoneNumber } = req.body;
        const updatedStaff = await User.findByIdAndUpdate(
            req.user.userId,
            { fullName, phoneNumber },
            { new: true }
        );

        if (!updatedStaff) return res.status(404).json({ error: "Clinical Staff not found" });

        res.json({ message: "Profile updated successfully", updatedStaff });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ CHANGE Password (Fix for 404)
router.put("/settings/change-password", clinicalMiddleware(["Clinical Staff"]), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const staff = await User.findById(req.user.userId);

        if (!staff) return res.status(404).json({ error: "Clinical Staff not found" });

        const isMatch = await bcrypt.compare(currentPassword, staff.password);
        if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        staff.password = hashedPassword;
        await staff.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;