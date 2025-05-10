import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex gap-4">
      <Link to="/" className="hover:underline">Dashboard</Link>
      <Link to="/products" className="hover:underline">Product List</Link>
      <Link to="/add-product" className="hover:underline">Add Product</Link>
    </nav>
  );
};

export default Navbar;

