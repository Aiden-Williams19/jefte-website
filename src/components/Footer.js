import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Photo Studio</h3>
            <p>Capturing life's beautiful moments through professional photography and video editing.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#booking">Book Session</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: info@photostudio.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>
                <div className="social-links">
                  <a href="#" aria-label="Instagram">Instagram</a>
                  <a href="#" aria-label="Facebook">Facebook</a>
                  <a href="#" aria-label="Twitter">Twitter</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Photo Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
