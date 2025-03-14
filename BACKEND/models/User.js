const mongoose = require("mongoose");

const specializations = [
<<<<<<< HEAD
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Hematology",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Surgery",
    "Urology",
    "Nephrology",
    "Obstetrics and Gynecology",
    "Anesthesiology",
    "Pathology",
    "Other",
    "None",
];

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
        phoneNumber: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Validates that the phone number has exactly 10 digits
                },
                message: (props) => `${props.value} is not a valid phone number!`,
            },
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return v && v.length >= 6; // Ensures password is at least 6 characters long
                },
                message: (props) => `Password must be at least 6 characters long!`,
            },
        },
        role: {
            type: String,
            enum: ["Doctor", "Clinical Staff", "Admin"],
            required: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
            required: function () {
                return this.role === "Doctor" || this.role === "Clinical Staff";
            },
        },
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
        availableDays: {
            type: [String],
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: function () {
                return this.role === "Doctor";
            },
        },
        availableTimes: {
            type: Map,
            of: [String], // Array of time ranges for each day
            validate: {
                validator: function (v) {
                    for (let times of v.values()) {
                        if (
                            !times.every((time) =>
                                /^[0-2]?[0-9]:[0-5][0-9] (AM|PM) - [0-2]?[0-9]:[0-5][0-9] (AM|PM)$/.test(time)
                            )
                        ) {
                            return false;
                        }
                    }
                    return true;
                },
                message: (props) => `Invalid time range format! Use HH:MM AM - HH:MM PM.`,
            },
            required: function () {
                return this.role === "Doctor";
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

=======
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
    doctorFee: {
        type: Number,
        required: function () {
            return this.role === "Doctor";
        },
    },
    availability: [availabilitySchema] // Array of availability objects
});

const User = mongoose.model("User", userSchema);
>>>>>>> f7e57e764d6f620bc3b99a73dbf28cd960ccae6c
module.exports = User;
