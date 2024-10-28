
/*const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorRoutes = require('./routes/doctorRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

//const doctorDataRoutes = require('./routes/doctorData');
//app.use('/api/doctor', doctorDataRoutes);


// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.use('/api/doctor', doctorRoutes);

// User schema for Registration
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Doctor', 'Clinical Staff', 'Admin'],
        required: true
    },
    // Doctor-specific fields
    medicalLicenseNumber: { type: String, required: function() { return this.role === 'Doctor'; }},
    specialization: { type: String, required: function() { return this.role === 'Doctor'; }},
    yearsOfExperience: { type: Number, required: function() { return this.role === 'Doctor'; }}
});

// User model
const User = mongoose.model('User', userSchema);

// Registration route for Doctor
app.post('/api/auth/signup/doctor', async (req, res) => {
    const { fullName, email, phoneNumber, password, medicalLicenseNumber, specialization, yearsOfExperience } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !medicalLicenseNumber || !specialization || !yearsOfExperience) {
        return res.status(400).json({ message: "All fields are required for Doctor registration" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role: 'Doctor',
            medicalLicenseNumber,
            specialization,
            yearsOfExperience
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "Doctor registered successfully" });
    } catch (error) {
        console.error("Error during doctor registration:", error);
        return res.status(500).json({ message: "Server error during doctor registration", error });
    }
});

// Registration route for Clinical Staff
app.post('/api/auth/signup/clinical', async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: "All fields are required for Clinical Staff registration" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role: 'Clinical Staff'
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "Clinical staff registered successfully" });
    } catch (error) {
        console.error("Error during clinical staff registration:", error);
        return res.status(500).json({ message: "Server error during clinical staff registration", error });
    }
});

// Registration route for Admin
app.post('/api/auth/signup/admin', async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: "All fields are required for Admin registration" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role: 'Admin'
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "Admin registered successfully" });
    } catch (error) {
        console.error("Error during admin registration:", error);
        return res.status(500).json({ message: "Server error during admin registration", error });
    }
});


// Login route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({ message: "User not found" });
        }

        // Log the stored hashed password and the plain-text password being compared
        console.log("Stored password hash:", user.password);
        console.log("Plain-text password provided:", password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match for user:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("User authenticated successfully:", email);
        return res.json({ token, role: user.role, message: "Login successful" }); // Role included in response
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
});


// Start server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorRoutes = require('./routes/doctorRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Import routes
app.use('/api/doctor', doctorRoutes);

// User schema and model
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Doctor', 'Clinical Staff', 'Admin'],
        required: true
    },
    medicalLicenseNumber: { type: String, required: function() { return this.role === 'Doctor'; }},
    specialization: { type: String, required: function() { return this.role === 'Doctor'; }},
    yearsOfExperience: { type: Number, required: function() { return this.role === 'Doctor'; }}
});
const User = mongoose.model('User', userSchema);

// Helper function for hashing passwords
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// Registration route for Doctor
app.post('/api/auth/signup/doctor', async (req, res) => {
    const { fullName, email, phoneNumber, password, medicalLicenseNumber, specialization, yearsOfExperience } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !medicalLicenseNumber || !specialization || !yearsOfExperience) {
        return res.status(400).json({ message: "All fields are required for Doctor registration" });
    }

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
            yearsOfExperience
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "Doctor registered successfully" });
    } catch (error) {
        console.error("Error during doctor registration:", error);
        return res.status(500).json({ message: "Server error during doctor registration", error });
    }
});

// Registration route for Clinical Staff
app.post('/api/auth/signup/clinical', async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: "All fields are required for Clinical Staff registration" });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: await hashPassword(password),
            role: 'Clinical Staff'
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "Clinical staff registered successfully" });
    } catch (error) {
        console.error("Error during clinical staff registration:", error);
        return res.status(500).json({ message: "Server error during clinical staff registration", error });
    }
});

// Registration route for Admin
app.post('/api/auth/signup/admin', async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: "All fields are required for Admin registration" });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: await hashPassword(password),
            role: 'Admin'
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "Admin registered successfully" });
    } catch (error) {
        console.error("Error during admin registration:", error);
        return res.status(500).json({ message: "Server error during admin registration", error });
    }
});

// Login route
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

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, role: user.role, message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
});

// Start server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});



















