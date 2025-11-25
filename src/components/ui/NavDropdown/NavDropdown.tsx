import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavDropdown.css';

interface DropdownItem {
  path: string;
  label: string;
  hash?: string; // For anchor links like #service-3d-modeling
}

interface NavDropdownProps {
  parentPath: string;
  parentLabel: string;
  items: DropdownItem[];
  isActive?: boolean;
  onNavigate?: () => void;
  activeRef?: React.MutableRefObject<HTMLElement | null>;
}

const NavDropdown: React.FC<NavDropdownProps> = ({
  parentPath,
  parentLabel,
  items,
  isActive = false,
  onNavigate,
  activeRef,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const parentButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useRef(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth <= 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };

    if (isOpen || isMobileExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMobileExpanded]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (isOpen || isMobileExpanded)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
        parentButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isMobileExpanded]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index?: number) => {
    if (!menuRef.current) return;

    const menuItems = Array.from(menuRef.current.querySelectorAll('a[role="menuitem"]')) as HTMLElement[];

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isMobile.current) {
          setIsMobileExpanded(!isMobileExpanded);
        } else {
          if (index === undefined) {
            // Parent button - toggle dropdown
            setIsOpen(!isOpen);
          } else {
            // Menu item - navigate
            menuItems[index]?.click();
          }
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (isMobile.current) {
          setIsMobileExpanded(true);
        } else {
          if (!isOpen) {
            setIsOpen(true);
          } else if (index !== undefined && index < menuItems.length - 1) {
            menuItems[index + 1]?.focus();
          } else if (index === undefined) {
            menuItems[0]?.focus();
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isMobile.current && isOpen) {
          if (index !== undefined && index > 0) {
            menuItems[index - 1]?.focus();
          } else if (index === 0) {
            parentButtonRef.current?.focus();
            setIsOpen(false);
          }
        }
        break;
      case 'Tab':
        if (!isOpen && !isMobileExpanded) {
          // Allow normal tab behavior when closed
          return;
        }
        if (e.shiftKey && index === 0) {
          e.preventDefault();
          parentButtonRef.current?.focus();
          setIsOpen(false);
        }
        break;
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile.current) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleParentClick = (e: React.MouseEvent) => {
    if (isMobile.current) {
      e.preventDefault();
      setIsMobileExpanded(!isMobileExpanded);
    } else {
      // On desktop, clicking parent navigates to parent page
      // Dropdown opens on hover
    }
  };

  const handleItemClick = (item: DropdownItem, e: React.MouseEvent) => {
    if (onNavigate) {
      onNavigate();
    }

    // If item has a hash, navigate to the page first, then scroll
    if (item.hash) {
      e.preventDefault();
      // Navigate to the page
      navigate(`${item.path}${item.hash}`);
      // Scroll will happen after navigation
      setTimeout(() => {
        const element = document.querySelector(item.hash!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    setIsOpen(false);
    setIsMobileExpanded(false);
  };

  const isItemActive = (item: DropdownItem) => {
    if (item.hash) {
      return location.pathname === item.path && location.hash === item.hash;
    }
    return location.pathname === item.path;
  };

  return (
    <li
      ref={dropdownRef}
      className="nav-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={(node) => {
          parentButtonRef.current = node;
          if (activeRef && node && isActive) {
            activeRef.current = node;
          }
        }}
        className={`nav-dropdown-toggle ${isActive ? 'active' : ''} ${isMobileExpanded ? 'expanded' : ''}`}
        onClick={handleParentClick}
        onKeyDown={(e) => handleKeyDown(e)}
        aria-haspopup="true"
        aria-expanded={isOpen || isMobileExpanded}
        aria-label={`${parentLabel} menu`}
      >
        <Link
          to={parentPath}
          className="nav-dropdown-parent-link"
          onClick={(e) => {
            if (isMobile.current && isMobileExpanded) {
              e.preventDefault();
            }
          }}
        >
          {parentLabel}
        </Link>
        <span className="nav-dropdown-chevron" aria-hidden="true">
          ▼
        </span>
      </button>

      <ul
        ref={menuRef}
        className={`nav-dropdown-menu ${isOpen || isMobileExpanded ? 'open' : ''}`}
        role="menu"
        aria-label={`${parentLabel} submenu`}
      >
        {items.map((item, index) => (
          <li key={item.path} role="none">
            <Link
              to={item.hash ? `${item.path}${item.hash}` : item.path}
              className={`nav-dropdown-item ${isItemActive(item) ? 'active' : ''}`}
              role="menuitem"
              onClick={(e) => handleItemClick(item, e)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={isOpen || isMobileExpanded ? 0 : -1}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default NavDropdown;

