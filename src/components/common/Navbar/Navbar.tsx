import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import headerLogo from '../../../assets/headerKMTIlogo.png';

const Navbar: React.FC = () => {
  const location = useLocation();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/services', label: 'SERVICES' },
    { path: '/projects', label: 'PROJECTS' },
    { path: '/about', label: 'ABOUT US' },
    { path: '/careers', label: 'CAREERS' },
    { path: '/contact', label: 'CONTACT US' },
  ];

  /* ----------------------------------
      Scroll-to-top behavior
  ---------------------------------- */
  const handleNavClick = (
    path: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    const currentPathname = location.pathname;
    if (path === currentPathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (
    path: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    handleNavClick(path, e);
    setIsMobileMenuOpen(false);
  };

  /* ----------------------------------
      Slider animation logic
  ---------------------------------- */
  useEffect(() => {
    if (activeLinkRef.current) {
      const rect = activeLinkRef.current.getBoundingClientRect();
      const ulRect =
        activeLinkRef.current.parentElement?.parentElement?.getBoundingClientRect();

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
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
          <img src={headerLogo} alt="KMTI Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''
                  }`}
                ref={location.pathname === link.path ? activeLinkRef : null}
                onClick={(e) => handleNavClick(link.path, e)}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Sliding underline */}
          <div
            className="navbar-slider"
            style={{
              width: sliderStyle.width,
              left: sliderStyle.left,
              transition: 'all 0.6s ease',
            }}
          />
        </ul>

        {/* Mobile Menu Button */}
        <button
          className={`navbar-burger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-mobile-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-mobile-link ${location.pathname === link.path ? 'active' : ''
                  }`}
                onClick={(e) => handleMobileNavClick(link.path, e)}
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
