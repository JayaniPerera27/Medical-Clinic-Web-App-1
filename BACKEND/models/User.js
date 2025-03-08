const mongoose = require("mongoose");

const specializations = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", 
    "Hematology", "Neurology", "Oncology", "Ophthalmology", 
    "Orthopedics", "Pediatrics", "Psychiatry", "Pulmonology", 
    "Radiology", "Rheumatology", "Surgery", "Urology", 
    "Nephrology", "Obstetrics and Gynecology", "Anesthesiology", 
    "Pathology", "Other", "None"
];

// Define schema for availability
const availabilitySchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g., "Monday"
    timeSlots: [
        {
            startTime: { type: String, required: true }, // e.g., "09:00 AM"
            endTime: { type: String, required: true },   // e.g., "11:00 AM"
            maxPatients: { type: Number, required: true } // Number of patients per slot
        }
    ]
});

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length >= 6;
            },
            message: (props) => `Password must be at least 6 characters long!`,
        },
    },
    role: {
        type: String,
        enum: ["Doctor", "Clinical Staff", "Admin"],
        required: true,
    },
    isBlocked: { type: Boolean, default: false },
    medicalLicenseNumber: {
        type: String,
        required: function () {
            return this.role === "Doctor";
        },
    },
    specialization: {
        type: String,
        enum: specializations,
        required: function () {
            return this.role === "Doctor";
        },
    },
    yearsOfExperience: {
        type: Number,
        required: function () {
            return this.role === "Doctor";
        },
    },
    availability: [availabilitySchema] // Array of availability objects
});

const User = mongoose.model("User", userSchema);
module.exports = User;
