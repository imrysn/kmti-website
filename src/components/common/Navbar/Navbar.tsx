import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import type { NavbarProps } from './Navbar.types';

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/careers', label: 'Careers' },
  ];

  return (
    <nav className={`navbar ${className}`}>
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">MyCompany</span>
        </Link>
        <button className="navbar-toggle" aria-label="Toggle navigation">
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.path} className="navbar-item">
              <Link
                to={item.path}
                className={`navbar-link ${
                  location.pathname === item.path ? 'navbar-link--active' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;