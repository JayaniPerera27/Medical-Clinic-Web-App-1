
/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Login.css';

function Login() {
  // State hooks for email, password, role, etc.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor"); // Set default to "Doctor"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const navigate = useNavigate();

  // handleLogin function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Define role-to-route mapping
    const roleRoutes = {
      "Doctor": "/doctor-home",
      "Clinical Staff": "/clinical-home",
      "Admin": "/admin-home"
    };

    try {
      const response = await axios.post("http://localhost:8070/api/auth/login", {
        email,
        password,
        role,
      });

      // Check if the response indicates success
      if (response.data.role) {
        setSuccess("Login successful!"); // Set success message
        const route = roleRoutes[response.data.role]; // Get the correct route based on the role
        if (route) {
          navigate(route); // Redirect based on role
        } else {
          setError("No route defined for the role");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error); // Log the full error object
      if (error.response) {
        setError(error.response.data.message || "Error logging in. Please try again.");
      } else {
        setError("Error logging in. Please try again.");
      }
    }
  };

  // JSX block (rendering the login form)
  return (
    <div className="login-container">
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

          <input
            type="radio"
            id="admin"
            name="role"
            value="Admin"
            checked={role === "Admin"}
            onChange={() => setRole("Admin")}
          />
          <label htmlFor="admin">Admin</label>
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

export default Login;*/

/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Login.css';

function Login() {
  // State hooks for email, password, role, etc.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor"); // Set default to "Doctor"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const navigate = useNavigate();

  // handleLogin function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Define role-to-route mapping
    const roleRoutes = {
      "Doctor": "/doctor-home",
      "Clinical Staff": "/clinical-home",
      "Admin": "/admin-home"
    };

    try {
      const response = await axios.post("http://localhost:8070/api/auth/login", {
        email,
        password,
        role,
      });

      // Check if the response indicates success
      if (response.data.role) {
        setSuccess("Login successful!"); // Set success message
        const route = roleRoutes[response.data.role]; // Get the correct route based on the role
        if (route) {
          navigate(route); // Redirect based on role
        } else {
          setError("No route defined for the role");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error); // Log the full error object
      if (error.response) {
        setError(error.response.data.message || "Error logging in. Please try again.");
      } else {
        setError("Error logging in. Please try again.");
      }
    }
  };

  // JSX block (rendering the login form)
  return (
    <div className="login-container">
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

          <input
            type="radio"
            id="admin"
            name="role"
            value="Admin"
            checked={role === "Admin"}
            onChange={() => setRole("Admin")}
          />
          <label htmlFor="admin">Admin</label>
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

export default Login;*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor"); // Default role
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // For success message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Define routes based on role
    const roleRoutes = {
      "Doctor": "/doctor-home",
      "Clinical Staff": "/clinical-home",
      "Admin": "/admin-home"
    };

    try {
      const response = await axios.post("http://localhost:8070/api/auth/login", {
        email,
        password,
        role,
      });

      if (response.data.token) {
        setSuccess("Login successful!");
        
        // Store the JWT token in localStorage
        localStorage.setItem("token", response.data.token);
        
        // Redirect based on the role using defined routes
        const route = roleRoutes[response.data.role];
        if (route) {
          navigate(route); // Navigate to the correct route
        } else {
          setError("No route defined for this role.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error); // Log full error object
      if (error.response) {
        setError(error.response.data.message || "Error logging in. Please try again.");
      } else {
        setError("Error logging in. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <h3>Login Page</h3>
      <form onSubmit={handleLogin}> {/* Form submission triggers handleLogin */}
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

          <input
            type="radio"
            id="admin"
            name="role"
            value="Admin"
            checked={role === "Admin"}
            onChange={() => setRole("Admin")}
          />
          <label htmlFor="admin">Admin</label>
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
        {success && <p className="success">{success}</p>} {/* Success message */}
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










