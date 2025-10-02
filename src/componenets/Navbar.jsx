import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h1>🧾 InventoBill</h1>

      <div className={`nav-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {[
          { path: '/', label: 'Dashboard' },
          { path: '/products', label: 'Products' },
          { path: '/add-product', label: 'Add Product' },
          { path: '/billing', label: 'Billing' },
          { path: '/customers', label: 'Customers' },
          { path: '/staff', label: 'Staff' },
          { path: '/suppliers', label: 'Suppliers' },
        ].map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              onClick={handleLinkClick}
              className={location.pathname === link.path ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
