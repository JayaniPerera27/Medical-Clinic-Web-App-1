/*  module.exports = (req, res, next) => {
    // Check if the user object exists and the role is Doctor
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized: No user information available' });
    }
  
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ msg: 'Access denied: Doctor role required' });
    }
  
    next(); // Proceed to the next middleware or route handler
  };*/
  
  /*const checkDoctorRole = (req, res, next) => {
    // Ensure the `req.user` object is present
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized: No user information available.' });
    }
  
    // Check if the user has the role of Doctor
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ msg: 'Access denied: Doctor role required.' });
    }
  
    next(); // Proceed to the next middleware or route handler
  };
  
  module.exports = checkDoctorRole;*/

 /* const checkDoctorRole = (req, res, next) => {
    if (req.user.role !== 'Doctor') {
      return res.status(403).json({ msg: 'Access denied: Doctor role required.' });
    }
    next();
  };
  
  module.exports = checkDoctorRole;*/





const checkDoctorRole = (req, res, next) => {
  if (req.user.role !== 'Doctor') {
    return res.status(403).json({ message: 'Access denied: Doctor role required' });
  }
  next();
};

module.exports = checkDoctorRole;

  
  
  