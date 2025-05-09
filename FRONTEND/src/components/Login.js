import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Login.css';
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor"); // Default role
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Define routes based on roles
    const roleRoutes = {
      "Doctor": "/doctor-home",
      "Clinical Staff": "/clinical-home",
      "Admin": "/admin-home"
    };

    try {
      console.log("Sending login request:", { email, password, role }); // Debugging log
      const response = await axios.post(
        //"http://localhost:3001/api/auth/login",
        "https://medical-clinic-web-app-backend.vercel.app/api/auth/login",
        { email, password, role },
        { timeout: 10000 } // Set a timeout of 10 seconds
      );

      if (response.data.token) {
        setSuccess("Login successful!");
        localStorage.setItem("token", response.data.token); // Save JWT token in local storage
        const route = roleRoutes[response.data.role];
        if (route) {
          navigate(route);
        } else {
          console.error("Undefined role in response:", response.data.role);
          setError("Login successful, but no route is configured for your role.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.");
        } else if (error.response) {
          setError(error.response.data.message || "Invalid credentials.");
        } else {
          setError("Network error. Please check your connection.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
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
      <h2>Welcome Back!</h2>
      <h3>Login Page</h3>
      <form onSubmit={handleLogin}>
        <div className="role-selection">
          <input
            type="radio"
            id="doctor"
            name="role"
            value="Doctor"
            checked={role === "Doctor"}
            onChange={() => setRole("Doctor")}
          />
          <label htmlFor="doctor">Doctor</label>
          
          <input
            type="radio"
            id="clinical"
            name="role"
            value="Clinical Staff"
            checked={role === "Clinical Staff"}
            onChange={() => setRole("Clinical Staff")}
          />
          <label htmlFor="clinical">Clinical Staff</label>

          {/* <input
            type="radio"
            id="admin"
            name="role"
            value="Admin"
            checked={role === "Admin"}
            onChange={() => setRole("Admin")}
          />
          <label htmlFor="admin">Admin</label> */}
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label>Show Password</label>
        </div>

        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
      <p>
        Forgot Password? <a href="/forgot-password">Reset it</a>
      </p>
      <p>
        Don’t have an account? <a href="/signup">Register Now</a> 
      </p>
    </div>
  );
}

export default Login;