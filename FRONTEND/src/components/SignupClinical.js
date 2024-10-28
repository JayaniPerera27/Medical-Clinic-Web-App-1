/*import React, { useState } from "react";
import axios from "axios";
import "../styles/signupClinical.css";

function SignupClinical() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    staffIDNumber: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/signup/clinical", formData);
      if (response.data.success) {
        alert("Clinical Staff registered successfully!");
      } else {
        alert("Error registering Clinical Staff.");
      }
    } catch (error) {
      alert("Error signing up. Please try again.");
    }
  };

  return (
    <div className="signup-clinical-container">
      <h2>Clinical Staff Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Staff ID Number"
          value={formData.staffIDNumber}
          onChange={(e) => setFormData({ ...formData, staffIDNumber: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.passwordConfirmation}
          onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
          required
        />
        <div className="terms">
          <input type="checkbox" required /> 
          <label>I agree to the terms and conditions.</label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default SignupClinical;*/

import React, { useState } from "react";
import axios from "axios";
import "../styles/signupClinical.css";

function SignupClinical() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    staffIDNumber: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8070/api/auth/signup/clinical", formData); // Updated URL
      if (response.status === 201) {
        alert("Clinical Staff registered successfully!");
      } else {
        alert("Error registering Clinical Staff.");
      }
    } catch (error) {
      console.error("Error during signup:", error.response ? error.response.data : error.message); // Log error for debugging
      alert("Error signing up. Please try again.");
    }
  };

  return (
    <div className="signup-clinical-container">
      <h2>Clinical Staff Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Staff ID Number"
          value={formData.staffIDNumber}
          onChange={(e) => setFormData({ ...formData, staffIDNumber: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.passwordConfirmation}
          onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
          required
        />
        <div className="terms">
          <input type="checkbox" required /> 
          <label>I agree to the terms and conditions.</label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default SignupClinical;

