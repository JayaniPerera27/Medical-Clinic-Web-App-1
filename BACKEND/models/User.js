
/*const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema with additional fields for Doctor
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  medicalLicenseNumber: {
    type: String,
    required: function() {
      return this.role === 'Doctor'; // Required only for doctors
    },
  },
  specialization: {
    type: String,
    required: function() {
      return this.role === 'Doctor'; // Required only for doctors
    },
  },
  yearsOfExperience: {
    type: Number,
    required: function() {
      return this.role === 'Doctor'; // Required only for doctors
    },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Doctor', 'Clinical Staff', 'Admin'],
    required: true,
  },
}, { timestamps: true });

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match passwords during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema with additional fields for Doctor
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    medicalLicenseNumber: {
      type: String,
      required: function () {
        return this.role === 'Doctor'; // Required only for doctors
      },
      sparse: true, // Allows for null values for other roles
    },
    specialization: {
      type: String,
      required: function () {
        return this.role === 'Doctor'; // Required only for doctors
      },
      sparse: true,
    },
    yearsOfExperience: {
      type: Number,
      required: function () {
        return this.role === 'Doctor'; // Required only for doctors
      },
      min: [0, 'Years of experience cannot be negative'], // Ensures valid years
      sparse: true,
    },
    staffIdNumber: {
      type: String,
      required: function () {
        return this.role === 'Clinical Staff'; // Required only for clinical staff
      },
      sparse: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['Doctor', 'Clinical Staff', 'Admin'],
      required: true,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match passwords during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);


