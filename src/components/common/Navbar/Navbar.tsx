import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import { getAssetUrl } from '../../../utils/assets';
import LazyImage from '../../ui/LazyImage/LazyImage';

import localNavbarLogo from '../../../assets/logo_navbar_KMTI_logo.webp';

const headerLogoR2 = getAssetUrl('logo/download1.webp');
const menuIconR2 = getAssetUrl('icons/menu-icon.webp');

const MenuIconSVG: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navListRef = React.useRef<HTMLUListElement>(null);
  const linkRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  const navLinks = useMemo(() => ([
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/careers', label: t('nav.careers') },
    // Conditionally add the Events link only for English
    ...(i18n.language === 'en' ? [{ path: '/events', label: t('nav.events') }] : []),
    { path: '/contact', label: t('nav.contact') },
  ]), [t, i18n.language]);

  // key function to determine if a link is active based on current path
  const isActivePath = (linkPath: string, currentPath: string) => {
    if (linkPath === '/') {
      return currentPath === '/' || currentPath === '/home';
    }
    return currentPath.startsWith(linkPath);
  };

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

  // Slider Logic
  useEffect(() => {
    // We use a microtask delay using requestAnimationFrame to ensure the DOM 
    // is fully painted with the new active class before taking measurements.
    
    const rAF = requestAnimationFrame(() => {
      if (!navListRef.current) return;
      
      const activeIndex = navLinks.findIndex(link => isActivePath(link.path, location.pathname));
      
      if (activeIndex !== -1 && linkRefs.current[activeIndex]) {
        const activeItem = linkRefs.current[activeIndex];
        const ulElement = navListRef.current;
        
        if (activeItem && ulElement) {
          const itemRect = activeItem.getBoundingClientRect();
          const ulRect = ulElement.getBoundingClientRect();
          
          setSliderStyle({
            width: itemRect.width,
            left: itemRect.left - ulRect.left,
          });
          return;
        }
      }
      
      // If no active link found (e.g. 404), reset slider
      setSliderStyle({ width: 0, left: 0 });
    });

    return () => cancelAnimationFrame(rAF);
  }, [location.pathname, i18n.language, navLinks]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
          <LazyImage
            src={headerLogoR2}
            fallbackSrc={localNavbarLogo}
            alt={`${t('common.brand_full')} Logo`}
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop-group">
          <ul className="navbar-links" ref={navListRef}>
            {navLinks.map((link, index) => {
              const isActive = isActivePath(link.path, location.pathname);

              return (
                <li 
                  key={`desktop-${link.path}`}
                  ref={(el) => { linkRefs.current[index] = el; }}
                >
                  <Link
                    to={link.path}
                    className={`navbar-link ${isActive ? 'active' : ''}`}
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
          <LazyImage
            src={menuIconR2}
            fallbackNode={<div className="navbar-burger-icon"><MenuIconSVG /></div>}
            alt="Menu"
            loading="eager"
          />
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
          {navLinks.map((link) => {
            const isActive = isActivePath(link.path, location.pathname);

            return (
              <li key={`mobile-${link.path}`}>
                <Link
                  to={link.path}
                  className={`navbar-link ${isActive ? 'active' : ''}`}
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
