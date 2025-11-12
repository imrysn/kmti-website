import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import headerLogo from '../../../assets/headerKMTIlogo.png';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/services', label: 'SERVICES' },
    { path: '/projects', label: 'PROJECTS' },
    { path: '/about', label: 'ABOUT US' },
    { path: '/careers', label: 'CAREERS' },
    { path: '/contact', label: 'CONTACT US' },

  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={headerLogo} alt="KMTI Logo" />
        </Link>
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

