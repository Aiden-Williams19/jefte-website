import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ scrollToSection, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    scrollToSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo" onClick={() => handleNavClick('home')}>
          <h2>JM Studios</h2>
        </div>
        
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className={activeSection === 'home' ? 'active' : ''}>
            Home
          </a>
          <a href="#portfolio" onClick={(e) => { e.preventDefault(); handleNavClick('portfolio'); }} className={activeSection === 'portfolio' ? 'active' : ''}>
            Portfolio
          </a>
          <a href="#booking" onClick={(e) => { e.preventDefault(); handleNavClick('booking'); }} className={activeSection === 'booking' ? 'active' : ''}>
            Book Session
          </a>
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
