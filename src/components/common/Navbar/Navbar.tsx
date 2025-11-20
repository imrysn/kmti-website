import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import headerLogo from '../../../assets/headerKMTIlogo.png';
import menuIcon from '../../../assets/icons/menu-icon.png';

const Navbar: React.FC = () => {
  const location = useLocation();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      Only scroll to top if the page is scrolled near the bottom
  ---------------------------------- */
  const handleNavClick = (
    path: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    const currentPathname = location.pathname;
    const isNearBottom = window.scrollY + window.innerHeight >=
                         document.documentElement.scrollHeight - 100;
    if (path === currentPathname && isNearBottom) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isNearBottom = window.scrollY + window.innerHeight >=
                         document.documentElement.scrollHeight - 100;
    if (location.pathname === '/' && isNearBottom) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  /* ----------------------------------
      Mobile menu toggle
  ---------------------------------- */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
          <img src={headerLogo} alt="KMTI Logo" />
        </Link>

        {/* Burger Menu Button */}
        <button className="navbar-burger" onClick={toggleMenu}>
          <img src={menuIcon} alt="Menu" />
        </button>

        <ul className={`navbar-links ${isMenuOpen ? 'navbar-links--open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${
                  location.pathname === link.path ? 'active' : ''
                }`}
                ref={location.pathname === link.path ? activeLinkRef : null}
                onClick={(e) => {
                  handleNavClick(link.path, e);
                  closeMenu();
                }}
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
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`navbar-mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}>
        <ul className="navbar-mobile-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${
                  location.pathname === link.path ? 'active' : ''
                }`}
                onClick={(e) => {
                  handleNavClick(link.path, e);
                  closeMenu();
                }}
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
