const mongoose = require("mongoose");

const specializations = [
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
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
