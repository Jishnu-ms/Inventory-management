import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import AddProductForm from './pages/Products/AddProductForm';
import Billing from './pages/Billing';
import EditProductForm from './pages/Products/EditProductForm';
import AddCustomerForm from './pages/Customers/AddCustomerForm';

import Customers from './pages/Customers';

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([
    { name: 'Product 1', quantity: 10, price: 20, barcode: '1234567890' },
    { name: 'Product 2', quantity: 5, price: 30, barcode: '2345678901' },
    { name: 'Product 3', quantity: 2, price: 50, barcode: '3456789012' },
  ]);

  // 🔥 Fetch customers from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        const customerList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Products logic stays local for now
  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (indexToDelete) => {
    const updatedProducts = products.filter((_, index) => index !== indexToDelete);
    setProducts(updatedProducts);
  };

  const updateProduct = (updatedProducts) => {
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
            element={<ProductList products={products} deleteProduct={deleteProduct} />}
          />
          <Route path="/add-product" element={<AddProductForm addProduct={addProduct} />} />
          <Route
            path="/billing"
            element={<Billing products={products} setProducts={setProducts} customers={customers} />}
          />
          <Route path="/edit-product/:id" element={<EditProductForm />} />
          {/* ✅ AddCustomerForm directly writes to Firestore, no props needed */}
          <Route path="/add-customer" element={<AddCustomerForm />} />

          {/* ✅ Pass Firestore customers list */}
          <Route path="/customers" element={<Customers customers={customers} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
