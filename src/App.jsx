import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import AddProductForm from './pages/Products/AddProductForm';
import Billing from './pages/Billing';
import EditProductForm from './pages/Products/EditProductForm';

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
const deleteProduct = (indexToDelete) => {
  const updatedProducts = products.filter((_, index) => index !== indexToDelete);
  setProducts(updatedProducts);
};


  // Update a product in the state
  const updateProduct = (updatedProducts) => {
    setProducts(updatedProducts); // Update the products list with the updated one
  };

  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          {/* Dashboard route */}
          <Route path="/" element={<Dashboard products={products} />} />

          {/* Product List route */}
          <Route
            path="/products"
            element={
              <ProductList
                products={products}
                deleteProduct={deleteProduct}
              />
            }
          />

          {/* Add Product route */}
          <Route
            path="/add-product"
            element={<AddProductForm addProduct={addProduct} />}
          />
          

          {/* Billing route */}
          <Route
            path="/billing"
            element={<Billing products={products} setProducts={setProducts} />}
          />

          {/* Edit Product route with dynamic 'index' as URL parameter */}
          <Route
            path="/edit-product/:index"
            element={
              <EditProductForm
                products={products}
                updateProduct={updateProduct} // Pass updateProduct function to EditProductForm
              />
            }
            
          />
  <Route
  path="/products"
  element={
    <ProductList
      products={products}
      deleteProduct={deleteProduct} // ✅ passed properly
    />
  }
/>


        </Routes>
      </div>
      
    </Router>
    
  );
};

export default App;

