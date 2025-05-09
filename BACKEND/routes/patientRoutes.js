const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient"); // Import the Patient model
const Prescription = require("../models/Prescription"); // Import the Prescription model
const authenticate = require("../middleware/authenticate"); // Import middleware for token authentication

// Get all patients with their bill details
router.get("/patients", authenticate, async (req, res) => {
  try {
    const patients = await Patient.find(); // Fetch all patients from the database
    const patientsWithFees = patients.map((patient) => ({
      _id: patient._id,
      name: patient.name,
      doctorFee: patient.doctorFee || 0,
      reportFee: patient.reportFee || 0,
      clinicFee: patient.clinicFee || 0,
      totalFee: (patient.doctorFee || 0) + (patient.reportFee || 0) + (patient.clinicFee || 0),
    }));
    res.json(patientsWithFees);
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});

// 🔹 Fetch patient full name using username from prescriptions collection
router.get("/get-patient-name/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("🔎 Searching for patient:", username);

    const prescription = await Prescription.findOne({ patientUsername: username });

    if (!prescription) {
      console.log("❌ No prescription found for:", username);
      return res.status(404).json({ message: "Patient not found" });
    }

    console.log("✅ Found prescription:", prescription);
    res.json({ fullName: prescription.patientName });
  } catch (error) {
    console.error("🔥 Error:", error);
    res.status(500).json({ message: "Failed to fetch patient name" });
  }
});

// ✅ GET Count of Patients
router.get("/count", async (req, res) => {
  try {
    const count = await Patient.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ GET All Patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).send('Patient not found');
    res.send(patient);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;