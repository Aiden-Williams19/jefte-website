import React from 'react';
import './Hero.css';

const Hero = ({ scrollToSection }) => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Capturing Life's
            <span className="gradient-text"> Beautiful Moments</span>
          </h1>
          <p className="hero-description">
            Professional photography and video editing services for weddings, 
            corporate events, commercial projects, and special occasions. 
            Let me tell your story through stunning visuals.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('portfolio')}
            >
              View Portfolio
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => scrollToSection('booking')}
            >
              Book a Session
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="400" fill="#f0f0f0"/>
              <circle cx="200" cy="180" r="60" fill="#ddd"/>
              <rect x="160" y="250" width="80" height="100" rx="10" fill="#ddd"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
