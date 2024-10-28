/*import React, { useState } from "react";
import axios from "axios";
import "../styles/signupAdmin.css";

function SignupAdmin() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
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
      const response = await axios.post("/api/signup/admin", formData);
      if (response.data.success) {
        alert("Admin registered successfully!");
      } else {
        alert("Error registering Admin.");
      }
    } catch (error) {
      alert("Error signing up. Please try again.");
    }
  };

  return (
    <div className="signup-admin-container">
      <h2>Admin Signup</h2>
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

export default SignupAdmin;*/

import React, { useState } from "react";
import axios from "axios";
import "../styles/signupAdmin.css";

function SignupAdmin() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Log formData to console for debugging
      console.log("Form Data being sent:", formData);

      // Send POST request to the backend
      const response = await axios.post("http://localhost:8070/api/auth/signup/admin", formData);

      // Check response from server
      if (response.data.success) {
        alert("Admin registered successfully!");
      } else {
        alert("Error registering Admin: " + response.data.message);
      }
    } catch (error) {
      // Log the error response if available
      console.error("Error during signup:", error.response ? error.response.data : error.message);
      alert("Error signing up. Please try again.");
    }
  };

  return (
    <div className="signup-admin-container">
      <h2>Admin Signup</h2>
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

export default SignupAdmin;

