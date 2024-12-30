
/*const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check role
    if (user.role !== role) {
      return res.status(403).json({ msg: `User is not a ${role}` });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { fullName, email, medicalLicenseNumber, specialization, yearsOfExperience, phoneNumber, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      medicalLicenseNumber,
      specialization,
      yearsOfExperience,
      phoneNumber,
      password: hashedPassword, // Store hashed password
      role
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model

// Signup route for Doctor
router.post('/signup/doctor', async (req, res) => {

    const { fullName, email, medicalLicenseNumber, specialization, yearsOfExperience, phoneNumber, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            role: 'doctor',
            fullName,
            email,
            medicalLicenseNumber,
            specialization,
            yearsOfExperience,
            phoneNumber,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ success: true, message: 'Doctor registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering doctor' });
    }
});

// Signup route for Clinical Staff
router.post('/signup/clinical', async (req, res) => {
    const { fullName, email, staffIDNumber, phoneNumber, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            role: 'Clinical Staff',
            fullName,
            email,
            staffIDNumber,
            phoneNumber,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ success: true, message: 'Clinical staff registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering clinical staff' });
    }
});

// Signup route for Admin
router.post('/signup/admin', async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            role: 'admin',
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ success: true, message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering admin' });
    }
});

module.exports = router;

