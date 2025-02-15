const express = require('express');
const router = express.Router();
const { getPatients } = require('../controllers/clinicalStaffController');
const clinicalStaffController = require('../controllers/clinicalStaffController');
const authenticate = require('../middleware/authenticate.js');

// Define the route for fetching patients
router.get('/patients', getPatients);

// Route to get clinical staff details
router.get('/details', authenticate, clinicalStaffController.getClinicalStaffDetails);

// Route to update clinical staff details
router.put('/update', authenticate, clinicalStaffController.updateClinicalStaffDetails);

module.exports = router;
