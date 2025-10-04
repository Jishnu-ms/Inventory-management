import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';


const Navbar = ({ user, isAdmin, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (menuOpen && !e.target.closest('.navbar-container')) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const navigationLinks = [
    { path: '/', label: '📊 Dashboard', icon: '📊' },
    { path: '/products', label: '📦 Products', icon: '📦' },
    ...(isAdmin ? [{ path: '/add-product', label: '➕ Add Product', icon: '➕' }] : []),
    { path: '/billing', label: '🧾 Billing', icon: '🧾' },
    ...(isAdmin ? [{ path: '/customers', label: '👥 Customers', icon: '👥' }] : []),
    ...(isAdmin ? [{ path: '/staff', label: '👨‍💼 Staff', icon: '👨‍💼' }] : []),
    ...(isAdmin ? [{ path: '/suppliers', label: '🏭 Suppliers', icon: '🏭' }] : []),
  ];

  return (
    <>
      {menuOpen && isMobile && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-content">
              <h1>🧾 InventoBill</h1>
              <span className="brand-subtitle">Inventory Management</span>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className={`nav-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Navigation Links */}
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {navigationLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-text">{link.label.replace(/^.+\s/, '')}</span>
                </Link>
              </li>
            ))}
            
            {/* Mobile User Section - Only show in mobile menu */}
            {isMobile && user && (
              <li className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="user-details">
                    <span className="user-email">{user.email}</span>
                    {isAdmin && (
                      <div className="admin-indicator">
                        <span className="admin-icon">👑</span>
                        <span className="admin-text">Administrator</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => { onLogout(); setMenuOpen(false); }} className="mobile-logout-btn">
                    <span className="logout-icon">🚪</span>
                    <span className="logout-text">Logout</span>
                  </button>
                </div>
              </li>
            )}
          </ul>

          {/* Desktop User Section */}
          {!isMobile && user && (
            <div className="navbar-user">
              <div className="user-info">
                
                {isAdmin && (
                  <div className="admin-badge">
                    <span className="crown-icon">👑</span>
                    <span>Admin</span>
                  </div>
                )}
              </div>
             
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
