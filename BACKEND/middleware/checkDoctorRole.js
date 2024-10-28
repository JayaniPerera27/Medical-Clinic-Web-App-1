// middleware/checkDoctorRole.js

module.exports = (req, res, next) => {
    // Ensure user is authenticated and has a valid role
    if (!req.user || req.user.role !== 'Doctor') {
      return res.status(403).json({ msg: 'Access denied: Doctor role required' });
    }
    next();
  };
  
  