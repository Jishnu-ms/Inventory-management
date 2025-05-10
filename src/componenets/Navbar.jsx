import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/products">Product List</Link>
        </li>
        {/* Add more links as necessary */}
      </ul>
    </nav>
  );
};

export default Navbar;
