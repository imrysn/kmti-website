import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">MyCompany</h3>
            <p className="footer-description">
              Building innovative solutions for your business needs.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/projects">Projects</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact</h4>
            <address className="footer-contact">
              <p>123 Business Street</p>
              <p>City, State 12345</p>
              <p>Email: info@mycompany.com</p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} MyCompany. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;