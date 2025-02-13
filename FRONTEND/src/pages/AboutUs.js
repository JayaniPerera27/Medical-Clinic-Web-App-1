import React from "react";
import { Link } from "react-router-dom";
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus">
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

      {/* About Section */}
      <section className="about-hero">
        <div className="about-content">
          <h1>About <span>Our Medical Clinic</span></h1>
          <p>We provide top-notch healthcare services with compassion and expertise.</p>
          <p>Our clinic is dedicated to ensuring the well-being of our patients through advanced medical treatments and professional care.</p>
          
        </div>
      </section>

      {/* Info Section */}
      <section className="about-info">
        <div className="info-box">
          <h3>Our Mission</h3>
          <p>To provide high-quality healthcare services with integrity, care, and expertise.</p>
        </div>
        <div className="info-box">
          <h3>Our Team</h3>
          <p>We have highly skilled doctors and medical staff who are passionate about your health.</p>
        </div>
        <div className="info-box">
          <h3>Why Choose Us?</h3>
          <p>We use the latest medical technology to provide accurate diagnoses and effective treatments.</p>
        </div>
      </section>

      {/* Curved Bottom Section */}
      {/* <div className="curve-bottom">
        <svg viewBox="0 0 1440 320">
          <path fill="#0089a7" fillOpacity="1" d="M0,320L1440,160L1440,320L0,320Z"></path>
        </svg>
      </div> */}
    </div>
  );
};

export default AboutUs;
