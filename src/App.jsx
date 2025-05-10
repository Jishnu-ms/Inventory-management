import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';

const App = () => {
  const [products, setProducts] = useState([
    { name: 'Product 1', quantity: 10, price: 20 },
    { name: 'Product 2', quantity: 5, price: 30 },
    { name: 'Product 3', quantity: 2, price: 50 },
  ]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard products={products} />} />
        <Route path="/products" element={<ProductList products={products} />} />
      </Routes>
    </Router>
  );
};

export default App;
