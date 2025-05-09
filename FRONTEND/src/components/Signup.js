import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";
import { Link } from "react-router-dom";

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

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "Doctor",
    fullName: "",
    phoneNumber: "",
    medicalLicenseNumber: "",
    specialization: "",
    yearsOfExperience: "",
    doctorFee: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { password, confirmPassword, role, ...rest } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let endpoint = "https://medical-clinic-web-app-backend.vercel.app/api/auth/signup";
    if (role === "Doctor") {
      endpoint = "https://medical-clinic-web-app-backend.vercel.app/api/auth/signup/doctors";
    } else if (role === "Clinical Staff") {
      endpoint = "https://medical-clinic-web-app-backend.vercel.app/api/auth/signup/clinical-staff";
    } else if (role === "Admin") {
      endpoint = "https://medical-clinic-web-app-backend.vercel.app/api/auth/signup/admin";
    }

    let payload = { ...rest, role, password };
    if (role !== "Doctor") {
      delete payload.medicalLicenseNumber;
      delete payload.specialization;
      delete payload.yearsOfExperience;
      delete payload.doctorFee;
    }

    setIsSubmitting(true);

    try {
      console.log("Payload being sent:", payload);
      const response = await axios.post(endpoint, payload);

      if (response.data.message) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Error signing up. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError(error.response?.data?.message || "Error signing up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Navbar */}
                  <nav className="navbar">
                    <div className="logo">Medical Clinic</div>
                    <ul className="nav-links">
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/about">About Us</Link></li>
                      <li><Link to="/services">Services</Link></li>
                      <li><Link to="/signup" className="signup-btn">Signup</Link></li>
                      <li><Link to="/login" className="login-btn">Login</Link></li>
                    </ul>
                  </nav>
      <h2>Create an Account</h2>

      <form onSubmit={handleSignup}>
        <div className="role-selection">
          <input
            type="radio"
            id="doctor"
            name="role"
            value="Doctor"
            checked={formData.role === "Doctor"}
            onChange={handleChange}
          />
          <label htmlFor="doctor">Doctor</label>

          <input
            type="radio"
            id="clinical"
            name="role"
            value="Clinical Staff"
            checked={formData.role === "Clinical Staff"}
            onChange={handleChange}
          />
          <label htmlFor="clinical">Clinical Staff</label>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        {formData.role === "Doctor" && (
          <>
            <input
              type="text"
              placeholder="Medical License Number"
              name="medicalLicenseNumber"
              value={formData.medicalLicenseNumber}
              onChange={handleChange}
              required
            />

            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialization</option>
              {specializations.map((specialization) => (
                <option key={specialization} value={specialization}>
                  {specialization}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Years of Experience"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              placeholder="Doctor Fee"
              name="doctorFee"
              value={formData.doctorFee}
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login" className="login-link">
          Login Here
        </Link>
      </p>
    </div>
  );
}

export default Signup;