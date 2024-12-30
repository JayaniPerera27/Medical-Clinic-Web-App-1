const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');


// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// User schema and model
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Doctor', 'Clinical Staff', 'Admin'],
        required: true,
    },
    medicalLicenseNumber: { type: String, required: function () { return this.role === 'Doctor'; } },
    specialization: { type: String, required: function () { return this.role === 'Doctor'; } },
    yearsOfExperience: { type: Number, required: function () { return this.role === 'Doctor'; } },
});
const User = mongoose.model('User', userSchema);

// Helper function for hashing passwords
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// Middleware for role-based access
const authMiddleware = (roles) => (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.user = decoded; // Pass user data to the next middleware
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Doctor Registration Route with Validation
app.post('/api/auth/signup/doctor', async (req, res) => {
    const doctorSchema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().min(6).required(),
        medicalLicenseNumber: Joi.string().required(),
        specialization: Joi.string().required(),
        yearsOfExperience: Joi.number().required(),
    });

    const { error } = doctorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { fullName, email, phoneNumber, password, medicalLicenseNumber, specialization, yearsOfExperience } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: await hashPassword(password),
            role: 'Doctor',
            medicalLicenseNumber,
            specialization,
            yearsOfExperience,
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "Doctor registered successfully" });
    } catch (error) {
        console.error("Error during doctor registration:", error);
        return res.status(500).json({ message: "Server error during doctor registration", error });
    }
});

// Login Route with Full Name in Token
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

      
        const token = jwt.sign({ userId: user._id, role: user.role, name: user.fullName }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token, role: user.role, name: user.fullName, message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
});

// Doctor Dashboard Route
app.get('/api/doctor/dashboard', authMiddleware(['Doctor']), async (req, res) => {
    try {
        // Example: Fetch doctor-specific dashboard data
        const dashboardData = {
            totalAppointments: 25, // Example static data
            totalPatients: 100,    // Replace with actual DB queries
            totalReports: 50,
        };
        res.json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api", appointmentRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api', doctorRoutes);

//const authMiddleware = require('./middleware/authMiddleware');





// Start server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});

/*const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Helper function for hashing passwords
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Middleware for role-based access
const authMiddleware = (roles) => (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Doctor Registration Route
app.post('/api/auth/signup/doctor', async (req, res) => {
  const doctorSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).required(),
    medicalLicenseNumber: Joi.string().required(),
    specialization: Joi.string().required(),
    yearsOfExperience: Joi.number().required(),
  });

  const { error } = doctorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { fullName, email, phoneNumber, password, medicalLicenseNumber, specialization, yearsOfExperience } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: await hashPassword(password),
      role: 'Doctor',
      medicalLicenseNumber,
      specialization,
      yearsOfExperience,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Doctor registered successfully' });
  } catch (error) {
    console.error('Error during doctor registration:', error);
    res.status(500).json({ message: 'Server error during doctor registration' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role, name: user.fullName }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.role, name: user.fullName, message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Doctor Dashboard Route
app.get('/api/doctor/dashboard', authMiddleware(['Doctor']), async (req, res) => {
  try {
    const dashboardData = {
      totalAppointments: 25, // Example static data
      totalPatients: 100,    // Replace with actual DB queries
      totalReports: 50,
    };
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Routes
const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api', doctorRoutes);

// Start server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});*/























