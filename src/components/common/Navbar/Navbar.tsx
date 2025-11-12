import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import headerLogo from '../../../assets/headerKMTIlogo.png';

const Navbar: React.FC = () => {
  const location = useLocation();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/services', label: 'SERVICES' },
    { path: '/projects', label: 'PROJECTS' },
    { path: '/about', label: 'ABOUT US' },
    { path: '/careers', label: 'CAREERS' },
    { path: '/contact', label: 'CONTACT US' },

  ];

  useEffect(() => {
    if (activeLinkRef.current) {
      const rect = activeLinkRef.current.getBoundingClientRect();
      const ulRect = activeLinkRef.current.parentElement?.parentElement?.getBoundingClientRect();
      if (ulRect) {
        setSliderStyle({
          width: rect.width,
          left: rect.left - ulRect.left,
        });
      }
    }
  }, [location.pathname]);

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
                ref={location.pathname === link.path ? activeLinkRef : null}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <div
            className="navbar-slider"
            style={{
              ...sliderStyle,
              transition: 'all 0.6s ease',
            }}
          />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
