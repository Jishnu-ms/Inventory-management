import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import AddProductForm from './pages/Products/AddProductForm';
import Billing from './pages/Billing';
import EditProductForm from './pages/Products/EditProductForm';
import CustomerHistory from './pages/Customers/CustomerHistory';

const App = () => {
  const [customers, setCustomers] = useState([
    { name: 'John Doe', phone: '1234567890', history: [] },
    { name: 'Jane Smith', phone: '9876543210', history: [] }
  ]);

  const [products, setProducts] = useState([
    { name: 'Product 1', quantity: 10, price: 20, barcode: '1234567890' },
    { name: 'Product 2', quantity: 5, price: 30, barcode: '2345678901' },
    { name: 'Product 3', quantity: 2, price: 50, barcode: '3456789012' },
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
    setProducts(updatedProducts);
  };

  // Add a new customer to the state
  const addCustomer = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };
  <Route
  path="/add-customer"
  element={<addCustomer addCustomer={addCustomer} />}
/>


  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard products={products} />} />
          <Route
            path="/products"
            element={<ProductList products={products} deleteProduct={deleteProduct} />}
          />
          <Route path="/add-product" element={<AddProductForm addProduct={addProduct} />} />
          <Route
            path="/billing"
            element={<Billing products={products} setProducts={setProducts} customers={customers} />}
          />
          <Route
            path="/edit-product/:index"
            element={<EditProductForm products={products} updateProduct={updateProduct} />}
          />
          <Route
            path="/customer-history/:customerIndex"
            element={<CustomerHistory customers={customers} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

