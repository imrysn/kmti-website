import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import headerLogo from '../../../assets/headerKMTIlogo.png';
import menuIcon from '../../../assets/icons/menu-icon.png';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = useMemo(() => [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/careers', label: t('nav.careers') },
    { path: '/contact', label: t('nav.contact') },
  ], [t]);

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
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    // Update body class for language-specific styling
    document.body.classList.remove('lang-en', 'lang-jp');
    document.body.classList.add(`lang-${i18n.language}`);
  }, [i18n.language]);

  useEffect(() => {
    // Store last main nav path when visiting a main nav page
    const isMainNavPage = navLinks.some(link => link.path === location.pathname);
    if (isMainNavPage) {
      localStorage.setItem('lastMainNavPath', location.pathname);
    }
  }, [location.pathname, navLinks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Determine which path to highlight
      const isMainNavPage = navLinks.some(link => link.path === location.pathname);
      const pathToHighlight = isMainNavPage
        ? location.pathname
        : localStorage.getItem('lastMainNavPath') || '/';

      // Find the link element for the path to highlight
      const linkElement = document.querySelector(
        `.navbar-link[href="${pathToHighlight}"]`
      ) as HTMLAnchorElement;

      if (linkElement) {
        const rect = linkElement.getBoundingClientRect();
        const ulRect = linkElement.parentElement?.parentElement?.getBoundingClientRect();

        if (ulRect) {
          setSliderStyle({
            width: rect.width,
            left: rect.left - ulRect.left,
          });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, i18n.language, navLinks]);

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
            {navLinks.map((link) => {
              const isMainNavPage = navLinks.some(navLink => navLink.path === location.pathname);
              const lastMainNavPath = localStorage.getItem('lastMainNavPath') || '/';
              const pathToHighlight = isMainNavPage ? location.pathname : lastMainNavPath;
              const isActive = link.path === pathToHighlight;

              return (
                <li key={`desktop-${link.path}`}>
                  <Link
                    to={link.path}
                    className={`navbar-link ${isActive ? 'active' : ''}`}
                    ref={isActive ? activeLinkRef : null}
                    onClick={(e) => {
                      handleNavClick(link.path, e);
                      closeMenu();
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <div
              className="navbar-slider"
              style={{
                width: sliderStyle.width,
                left: sliderStyle.left,
                transition: 'all 0.6s ease',
              }}
            />
          </ul>

          {/* Sitemap Button */}
          <Link to="/sitemap" className="sitemap-btn" title="Sitemap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" fill="currentColor" />
            </svg>
          </Link>

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
        {/* Mobile Language Switcher */}
        <div className="mobile-lang-switcher">
          <button
            className={`lang-btn ${i18n.language === 'jp' ? 'active' : ''}`}
            onClick={() => {
              toggleLanguage('jp');
              closeMenu();
            }}
          >
            JP
          </button>
          <button
            className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
            onClick={() => {
              toggleLanguage('en');
              closeMenu();
            }}
          >
            EN
          </button>
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
        <Link to="/sitemap" className="mobile-sitemap-link" onClick={closeMenu}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" fill="currentColor" />
          </svg>
          <span>Sitemap</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;