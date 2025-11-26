import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import headerLogo from '../../../assets/headerKMTIlogo.png';
import menuIcon from '../../../assets/icons/menu-icon.png';
import NavDropdown from '../../ui/NavDropdown/NavDropdown';

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

  // Services dropdown items
  const servicesDropdownItems = [
    { path: '/services', label: '3D Modeling', hash: '#service-3d-modeling' },
    { path: '/services', label: '2D Detailing', hash: '#service-2d-detailing' },
    { path: '/services', label: 'Parts Inspection', hash: '#service-parts-inspection' },
    { path: '/services', label: 'Machine Assembly', hash: '#service-machine-assembly' },
  ];

  /* ----------------------------------
      Scroll-to-top behavior
      Scroll to top when clicking the same page link
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
  };

  /* ----------------------------------
      Slider animation logic
  ---------------------------------- */
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
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
      } else {
        // Check if SERVICES dropdown is active
        const servicesDropdown = document.querySelector('.nav-dropdown-toggle.active');
        if (servicesDropdown) {
          const rect = servicesDropdown.getBoundingClientRect();
          const ulRect = servicesDropdown.parentElement?.parentElement?.getBoundingClientRect();
          if (ulRect) {
            setSliderStyle({
              width: rect.width,
              left: rect.left - ulRect.left,
            });
          }
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

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
          {navLinks.map((link) => {
            // Use dropdown for SERVICES
            if (link.path === '/services') {
              const isServicesActive = location.pathname === '/services' ||
                servicesDropdownItems.some(item =>
                  location.pathname === item.path && location.hash === item.hash
                );
              return (
                <NavDropdown
                  key={`desktop-${link.path}`}
                  parentPath={link.path}
                  parentLabel={link.label}
                  items={servicesDropdownItems}
                  isActive={isServicesActive}
                  onNavigate={closeMenu}
                  activeRef={isServicesActive ? activeLinkRef : undefined}
                />
              );
            }

            // Regular links for other items
            return (
              <li key={`desktop-${link.path}`}>
                <Link
                  to={link.path}
                  className={`navbar-link ${location.pathname === link.path ? 'active' : ''
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
            );
          })}

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
      <div className={`navbar-mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={(e) => {
        // Don't close if clicking inside dropdown
        if ((e.target as HTMLElement).closest('.nav-dropdown')) {
          return;
        }
        closeMenu();
      }}>
        <ul className="navbar-mobile-links">
          {navLinks.map((link) => {
            // Use dropdown for SERVICES in mobile too
            if (link.path === '/services') {
              const isServicesActive = location.pathname === '/services' ||
                servicesDropdownItems.some(item =>
                  location.pathname === item.path && location.hash === item.hash
                );
              return (
                <NavDropdown
                  key={`mobile-${link.path}`}
                  parentPath={link.path}
                  parentLabel={link.label}
                  items={servicesDropdownItems}
                  isActive={isServicesActive}
                  onNavigate={closeMenu}
                />
              );
            }

            // Regular links for other items
            return (
              <li key={`mobile-${link.path}`}>
                <Link
                  to={link.path}
                  className={`navbar-link ${location.pathname === link.path ? 'active' : ''
                    }`}
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
      </div>
    </nav>
  );
};

export default Navbar;
