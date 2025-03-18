const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const availabilityRoutes = require("./routes/availabilityRoutes");
const userRouter = require('./routes/userRouter');
const doctorRoutes = require('./routes/doctorRoutes');

const billRoutes = require("./routes/billRoutes");
const clinicalStaffRoutes = require("./routes/clinicalStaffRoutes");
const billHistoryRoutes = require("./routes/billHistory");
const reportsRoutes = require("./routes/reports");
const appointmentRoutes = require("./routes/appointment");
const prescriptionsRoutes = require("./routes/prescriptions"); // Prescriptions
const fetchPrescribingDoctors = require("./routes/fetchPrescribingDoctors");
const patientRoutes = require('./routes/patientRoutes'); // Adjust the path as needed



dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Routers

app.use('/api/auth', userRouter);
app.use('/api', doctorRoutes);
app.use("/api/availability", availabilityRoutes); 

app.use("/api", patientRoutes);
app.use("/api/billing", billRoutes);
app.use("/api/clinical-staff", clinicalStaffRoutes);
app.use("/api/bill-history", billHistoryRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionsRoutes);  // Ensure this is included
app.use("/api/availability", availabilityRoutes); 
app.use("/api/users", fetchPrescribingDoctors);
app.use("/api/users", userRouter);

// Example route for Doctor Dashboard
const authMiddleware = require('./middleware/authMiddleware');
app.get('/api/doctor/dashboard', authMiddleware(['Doctor']), async (req, res) => {
    try {
        const dashboardData = {
            totalAppointments: 0,
            totalPatients: 0,
            totalReports: 0,
        };
        res.json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});