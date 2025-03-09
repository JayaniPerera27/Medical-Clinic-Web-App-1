const User = require('../models/User');
const bcrypt = require('bcrypt');
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");


// Get Doctor Profile
const getDoctorProfile = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Doctor') {
            return res.status(403).json({ message: 'Access denied. Only doctors can view this profile.' });
        }

        const doctor = await User.findOne({ _id: req.user.id, role: 'Doctor' });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({
            fullName: doctor.fullName,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            medicalLicenseNumber: doctor.medicalLicenseNumber,
            specialization: doctor.specialization,
            yearsOfExperience: doctor.yearsOfExperience,
            
        });
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
    const { fullName, email, phoneNumber, specialization, yearsOfExperience} = req.body;

    try {
        const doctor = await User.findOne({ _id: req.user.id, role: 'Doctor' });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        // Update profile fields
        doctor.fullName = fullName || doctor.fullName;
        doctor.email = email || doctor.email;
        doctor.phoneNumber = phoneNumber || doctor.phoneNumber;
        doctor.specialization = specialization || doctor.specialization;
        doctor.yearsOfExperience = yearsOfExperience || doctor.yearsOfExperience;

        const updatedDoctor = await doctor.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            doctor: {
                fullName: updatedDoctor.fullName,
                email: updatedDoctor.email,
                phoneNumber: updatedDoctor.phoneNumber,
                specialization: updatedDoctor.specialization,
                yearsOfExperience: updatedDoctor.yearsOfExperience,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Change Password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
};




const getDoctorAppointments = async (req, res) => {
    try {
        if (!req.user || !req.user.name) {
            return res.status(401).json({ success: false, message: "Unauthorized: Doctor name not found in token" });
        }

        let doctorName = req.user.name;
        console.log("Doctor Name from Token:", doctorName);

        // Clean the doctor's name and add "Dr. " back if it's missing
        const cleanedDoctorName = doctorName.replace(/^Dr\.\s*/i, "").trim();
        const doctorNameWithDr = "Dr. " + cleanedDoctorName;
        console.log("Doctor Name with Dr.:", doctorNameWithDr);

        // Match both possible names (with and without "Dr. ")
        const appointments = await Appointment.find({
            $or: [
                { doctorName: { $regex: new RegExp(`^${doctorName}$`, "i") } },
                { doctorName: { $regex: new RegExp(`^${doctorNameWithDr}$`, "i") } }
            ]
        });

        if (!appointments.length) {
            return res.status(404).json({ success: false, message: "No appointments found for this doctor" });
        }

        res.json({ success: true, appointments });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
const getDoctorPatients = async (req, res) => {
    try {
        if (!req.user || !req.user.name) {
            return res.status(401).json({ success: false, message: "Unauthorized: Doctor name not found in token" });
        }

        let doctorName = req.user.name;
        console.log("Doctor Name from Token:", doctorName);

        // Clean the doctor's name and add "Dr. " back if missing
        const cleanedDoctorName = doctorName.replace(/^Dr\.\s*/i, "").trim();
        const doctorNameWithDr = "Dr. " + cleanedDoctorName;
        console.log("Doctor Name with Dr.:", doctorNameWithDr);

        // Find all appointments for the specific doctor
        const appointments = await Appointment.find({
            $or: [
                { doctorName: { $regex: new RegExp(`^${doctorName}$`, "i") } },
                { doctorName: { $regex: new RegExp(`^${doctorNameWithDr}$`, "i") } }
            ]
        }).select("patientName patientEmail patientUsername");

        if (!appointments.length) {
            return res.status(404).json({ success: false, message: "No patients found for this doctor" });
        }

        console.log("Appointments Found:", appointments);

        // Extract unique patients based on patientUsername (to avoid duplicates)
        const uniquePatients = [];
        const patientSet = new Set();

        appointments.forEach(({ patientName, patientEmail, patientUsername }) => {
            const key = patientUsername; // Use patientUsername to ensure uniqueness
            if (!patientSet.has(key)) {
                uniquePatients.push({ 
                    username: patientUsername, 
                    fullName: patientName, 
                    email: patientEmail 
                });
                patientSet.add(key);
            }
        });

        res.json({ success: true, patients: uniquePatients });

    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



const addPrescription = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { patientName, patientUsername, doctorName, date, medicines } = req.body;

        if ( !patientUsername || !doctorName || !date || !medicines || medicines.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPrescription = new Prescription({
            patientName,
            patientUsername, 
            doctorName,
            date,
            medicines
        });

        await newPrescription.save();
        res.status(201).json({
            success: true, 
            message: "Prescription added successfully",
            prescription: newPrescription
        });

    } catch (error) {
        console.error("Error adding prescription:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getPrescriptionsForPatient = async (req, res) => {
    const { patientUsername } = req.params; 

    try {
        console.log("Doctor Name from Token:", req.user.name); // Log doctor's name
        console.log("Patient Username from Params:", patientUsername); // Log patient's username

        const prescriptions = await Prescription.find({
            doctorName: req.user.name,
            patientUsername
        });

        console.log("Prescriptions Found:", prescriptions); // Log prescriptions result

        if (!prescriptions.length) {
            return res.status(404).json({ message: "No prescriptions found for this patient" });
        }

        res.json({ success: true, prescriptions });

    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// // Update Prescription
// const updatePrescription = async (req, res) => {
//     const { prescriptionId } = req.params;
//     const { medicines } = req.body;

//     try {
//         const prescription = await Prescription.findByIdAndUpdate(prescriptionId, { medicines }, { new: true });

//         if (!prescription) {
//             return res.status(404).json({ message: "Prescription not found" });
//         }

//         res.json({ message: "Prescription updated successfully", prescription });
//     } catch (error) {
//         console.error("Error updating prescription:", error);
//         res.status(500).json({ message: "Failed to update prescription" });
//     }
// };

// Delete Prescription
const deletePrescription = async (req, res) => {
    const { prescriptionId } = req.params;

    try {
        await Prescription.findByIdAndDelete(prescriptionId);
        res.json({ message: "Prescription deleted successfully" });
    } catch (error) {
        console.error("Error deleting prescription:", error);
        res.status(500).json({ message: "Failed to delete prescription" });
    }
};




module.exports = {
    getDoctorProfile,
    updateDoctorProfile,
    changePassword,
    getDoctorAppointments,
    getDoctorPatients,
    addPrescription,
    getPrescriptionsForPatient,
    //updatePrescription,
    deletePrescription
};
