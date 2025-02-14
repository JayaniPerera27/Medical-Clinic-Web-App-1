const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Includes fullName (doctor's name)
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
