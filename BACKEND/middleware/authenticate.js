const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
            console.log("❌ No Authorization header found");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.replace("Bearer ", "").trim();
        console.log("🔹 Extracted Token:", token);

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        if (!decoded.name) {
            console.log("❌ Token does not contain doctor name");
            return res.status(401).json({ message: "Unauthorized: Name missing from token" });
        }

        req.user = decoded;
        console.log("✅ User attached to req:", req.user);

        next();
    } catch (err) {
        console.error("❌ JWT Verification Error:", err.message);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
