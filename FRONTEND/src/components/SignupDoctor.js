/*import React, { useState } from 'react';
import axios from 'axios';

function SignupDoctor() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // State for password confirmation
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation: Check if password and passwordConfirmation match
    if (password !== passwordConfirmation) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8070/api/auth/signup/doctor", {
        fullName,
        email,
        medicalLicenseNumber,
        specialization,
        yearsOfExperience,
        phoneNumber,
        password, // Only the password is sent to the backend
      });
      console.log(response.data); // Handle success
      // Optionally, you can add code here to redirect or reset the form after successful registration
    } catch (error) {
      setError("Error registering user"); // Update error message for UI
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Medical License Number"
        value={medicalLicenseNumber}
        onChange={(e) => setMedicalLicenseNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Years of Experience"
        value={yearsOfExperience}
        onChange={(e) => setYearsOfExperience(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password Confirmation"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        required
      />
      <div className="terms">
        <input type="checkbox" required /> I agree to the terms and conditions.
      </div>
      <button type="submit">Register</button>
      {error && <p className="error">{error}</p>} 
    </form>
  );
}

export default SignupDoctor;*/

import React, { useState } from 'react';
import axios from 'axios';
//import '../styles/SignupDoctor.css';


function SignupDoctor() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8070/api/auth/signup/doctor", {
        fullName,
        email,
        medicalLicenseNumber,
        specialization,
        yearsOfExperience,
        phoneNumber,
        password,
      });
      console.log(response.data);
      // Reset the form on successful submission
      setFullName("");
      setEmail("");
      setMedicalLicenseNumber("");
      setSpecialization("");
      setYearsOfExperience("");
      setPhoneNumber("");
      setPassword("");
      setPasswordConfirmation("");
      setError("");
      alert("Doctor registered successfully!");
    } catch (error) {
      setError("Error registering user");
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Doctor Registration</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Medical License Number"
          value={medicalLicenseNumber}
          onChange={(e) => setMedicalLicenseNumber(e.target.value)}
          required
        />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        >
          <option value="" disabled>Select Specialization</option>
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Years of Experience"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <div className="terms">
          <input type="checkbox" required /> I agree to the terms and conditions.
        </div>
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default SignupDoctor;
