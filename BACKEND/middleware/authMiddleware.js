/*const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied: No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user and role to the request object for access in the next middleware/route
    req.user = decoded.userId;
    req.role = decoded.role;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle different JWT errors more explicitly
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired, please login again' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    } else {
      return res.status(500).json({ msg: 'Server error while verifying token' });
    }
  }
};*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    // Debugging line to ensure token decoding is correct
    console.log('Decoded User:', req.user);

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired, please login again' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    } else {
      return res.status(500).json({ msg: 'Server error while verifying token' });
    }
  }
};


