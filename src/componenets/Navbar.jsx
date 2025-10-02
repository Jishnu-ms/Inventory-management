import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // optional for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 style={{ color: 'var(--primary-color)' }}>🧾 InventoBill</h1>
      <ul className="nav-links">
        <li><Link to="/" style={linkStyle}>Dashboard</Link></li>
        <li><Link to="/products" style={linkStyle}>Products</Link></li>
        <li><Link to="/add-product" style={linkStyle}>Add Product</Link></li>
        <li><Link to="/billing" style={linkStyle}>Billing</Link></li>
        <li><Link to="/customers" style={linkStyle}>Customers</Link></li>
        <li> <Link to="/staff" style={linkStyle}>Staff</Link></li>
        <li>
        <Link to="/suppliers" style={linkStyle}>Suppliers</Link>
      </li>
      </ul>
    </nav>
  );
};

const linkStyle = {
  color: 'var(--text-color)',
  textDecoration: 'none',
  fontWeight: '500',
};

export default Navbar;
