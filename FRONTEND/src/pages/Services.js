import React from "react";
import { Link } from "react-router-dom";
import "../styles/Services.css";

const Services = () => {
  return (
    <div className="services">
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
          <h1>Our <span>Medical Services</span></h1>
          <p>Your health is our priority. Explore our wide range of healthcare services designed to meet your needs.</p>
        </div>
      </section>

      {/* Curved top section */}
      <div className="curve-top">
        <svg viewBox="0 0 1440 150" fill="white">
          <path d="M0,0 C480,150 960,150 1440,0 Z" />
        </svg>
      </div>

      {/* Services Section */}
      <section className="services-list">
        <div className="service-card">
          <img src="https://via.placeholder.com/150" alt="General Checkup" className="service-icon"/>
          <h3>General Checkup</h3>
          <p>Comprehensive health checkups to keep you fit and healthy.</p>
        </div>

        <div className="service-card">
          <img src="https://via.placeholder.com/150" alt="Pediatrics" className="service-icon"/>
          <h3>Pediatrics</h3>
          <p>Expert care for infants, children, and adolescents.</p>
        </div>

        <div className="service-card">
          <img src="https://via.placeholder.com/150" alt="Cardiology" className="service-icon"/>
          <h3>Cardiology</h3>
          <p>Heart disease prevention and treatment services tailored to you.</p>
        </div>

        <div className="service-card">
          <img src="https://via.placeholder.com/150" alt="Dental Care" className="service-icon"/>
          <h3>Dental Care</h3>
          <p>Expert dental services for a bright and healthy smile.</p>
        </div>

        <div className="service-card">
          <img src="https://via.placeholder.com/150" alt="Emergency Care" className="service-icon"/>
          <h3>Emergency Care</h3>
          <p>24/7 emergency medical assistance for critical care.</p>
        </div>
      </section>

      {/* Curved bottom section */}
      {/* <div className="curve-bottom">
        <svg viewBox="0 0 1440 150" fill="white">
          <path d="M0,0 C480,150 960,150 1440,0 Z" />
        </svg>
      </div>

      
      <footer className="footer">
        <p>© 2025 Medical Clinic. All rights reserved. | <Link to="/privacy-policy">Privacy Policy</Link></p>
      </footer> */}
    </div>
  );
};

export default Services;
