const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const availabilityRoutes = require("./routes/availabilityRoutes");


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
const userRouter = require('./routes/userRouter');
const doctorRoutes = require('./routes/doctorRoutes');


app.use('/api/auth', userRouter);
app.use('/api', doctorRoutes);

app.use("/api/availability", availabilityRoutes); 


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