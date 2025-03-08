const express = require("express");
const { setAvailability, getAvailability } = require("../controllers/availabilityController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for doctor availability
router.post("/set", authMiddleware(["Doctor"]), setAvailability);
router.get("/get", authMiddleware(["Doctor"]), getAvailability);

module.exports = router;
