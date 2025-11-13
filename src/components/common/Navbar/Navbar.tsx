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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
          <img src={headerLogo} alt="KMTI Logo" />
        </Link>
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={(e) => handleNavClick(link.path, e)}
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
