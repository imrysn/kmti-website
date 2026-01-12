import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Added for translation 
import './Navbar.css';
import headerLogo from '../../../assets/headerKMTIlogo.png';
import menuIcon from '../../../assets/icons/menu-icon.png';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation(); // Initialize translation hook 
  const location = useLocation();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Labels are now pulled from translation files 
  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/careers', label: t('nav.careers') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const handleNavClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
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
  };

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Function to switch language 
  };

  useEffect(() => {
    // Update body class for language-specific styling
    document.body.classList.remove('lang-en', 'lang-jp');
    document.body.classList.add(`lang-${i18n.language}`);
  }, [i18n.language]);

  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 100); // Increased delay slightly to allow translation text to render first

    return () => clearTimeout(timer);
  }, [location.pathname, i18n.language]); // Recalculate slider when language changes

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
          <img src={headerLogo} alt="KMTI Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop-group">
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={`desktop-${link.path}`}>
                <Link
                  to={link.path}
                  className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
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
            <div
              className="navbar-slider"
              style={{
                width: sliderStyle.width,
                left: sliderStyle.left,
                transition: 'all 0.6s ease',
              }}
            />
          </ul>

          {/* Language Switcher */}
          <div className="language-switcher">
            <button
              className={`lang-btn ${i18n.language === 'jp' ? 'active' : ''}`}
              onClick={() => toggleLanguage('jp')}
            >
              JP
            </button>
            <span className="lang-divider">|</span>
            <button
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => toggleLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>

        <button className="navbar-burger" onClick={toggleMenu}>
          <img src={menuIcon} alt="Menu" />
        </button>
      </div>

      <div className={`navbar-mobile-backdrop ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu} />

      <div className={`navbar-mobile-panel ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-lang-switcher">
          <button onClick={() => { toggleLanguage('jp'); closeMenu(); }}>日本語</button>
          <button onClick={() => { toggleLanguage('en'); closeMenu(); }}>English</button>
        </div>
        <ul className="navbar-mobile-links">
          {navLinks.map((link) => (
            <li key={`mobile-${link.path}`}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
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