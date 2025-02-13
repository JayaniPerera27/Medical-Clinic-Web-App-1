import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import doctor1 from "../assets/doctor1.jpeg";
import doctor2 from "../assets/doctor2.jpeg";
import doctor3 from "../assets/doctor3.jpeg";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Curved Top Section */}
      <div className="curve-top">
        <svg viewBox="0 0 1440 320">
          <path fill="#0089a7" fillOpacity="1" d="M0,160L1440,320L1440,0L0,0Z"></path>
        </svg>
      </div>

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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Trusted <span>Medical & Clinical</span> Center</h1>
          <p>We provide professional healthcare services to ensure your well-being.</p>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>

        {/* Images */}
        <div className="hero-images">
          <img src={doctor1} alt="Doctor 1" className="doctor doctor1"/>
          <img src={doctor2} alt="Doctor 2" className="doctor doctor2"/>
          <img src={doctor3} alt="Doctor 3" className="doctor doctor3"/>
        </div>
      </section>

      {/* Curved Bottom Section */}
      <div className="curve-bottom">
        <svg viewBox="0 0 1440 320">
          <path fill="#0089a7" fillOpacity="1" d="M0,320L1440,160L1440,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HomePage;
