const jwt = require('jsonwebtoken');

const authMiddleware = (roles) => (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Access denied. Invalid role.' });
    }
    req.user = decoded; // Attach user details to the request
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;