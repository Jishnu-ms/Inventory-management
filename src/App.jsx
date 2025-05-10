import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import AddProductForm from './pages/Products/AddProductForm';

const App = () => {
  const [products, setProducts] = useState([
    { name: 'Product 1', quantity: 10, price: 20 },
    { name: 'Product 2', quantity: 5, price: 30 },
    { name: 'Product 3', quantity: 2, price: 50 },
  ]);

  // Add a product to the state
  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  // Delete a product from the state
  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard products={products} />} />
          <Route
            path="/products"
            element={
              <ProductList
                products={products}
                deleteProduct={deleteProduct}
              />
            }
          />
          <Route
            path="/add-product"
            element={<AddProductForm addProduct={addProduct} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
