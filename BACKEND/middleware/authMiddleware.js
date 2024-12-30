/*const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Retrieve token from the Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ msg: 'Authorization denied: No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information from the token payload to the request object
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      name: decoded.name,
    };

    console.log('Authenticated User:', req.user);
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired. Please log in again.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token. Please log in again.' });
    }

    // Handle unexpected errors
    console.error('Unexpected error during token verification:', err);
    res.status(500).json({ msg: 'Server error while verifying token.' });
  }
};

module.exports = authMiddleware;*/

/*const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Retrieve token from the Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ msg: 'Authorization denied: No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information from the token payload to the request object
    req.user = {
      id: decoded.userId, // Ensure `userId` exists in your JWT payload
      role: decoded.role, // Ensure `role` exists in your JWT payload
      name: decoded.name, // Optional: Attach additional fields if needed
    };

    console.log('Authenticated User:', req.user);
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired. Please log in again.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token. Please log in again.' });
    }

    // Handle unexpected errors
    console.error('Unexpected error during token verification:', err);
    res.status(500).json({ msg: 'Server error while verifying token.' });
  }
};

module.exports = authMiddleware;*/

/*const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ msg: 'Authorization denied: No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token.' });
  }
};



module.exports = authMiddleware;*/

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    }; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;












