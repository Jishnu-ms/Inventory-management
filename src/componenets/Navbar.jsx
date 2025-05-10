import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
  <nav className="navbar">
      <h1 style={{ color: 'var(--primary-color)' }}>🧾 Stock & Billing</h1>
      <div style={{ marginTop: '10px' }}>
        <Link to="/" style={linkStyle}>Dashboard</Link>
        <Link to="/products" style={linkStyle}>Products</Link>
        <Link to="/add-product" style={linkStyle}>Add Product</Link>
        <Link to="/billing" style={linkStyle}>Billing</Link>
      </div>
    </nav>

  );
};
const linkStyle = {
  color: 'var(--text-color)',
  textDecoration: 'none',
  marginRight: '20px',
  fontWeight: '500',
};
export default Navbar;

