const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
});

module.exports = mongoose.model('Doctor', doctorSchema);