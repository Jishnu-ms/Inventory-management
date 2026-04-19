import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import AddProductForm from './pages/Products/AddProductForm';
import Billing from './pages/bill/Billing';
import EditProductForm from './pages/Products/EditProductForm';
import Login from './pages/Login';
import StaffManagement from './pages/staff/StaffManagement';
import Customers from './pages/Customers/CustomerManagement';
import SuppliersManagement from './pages/SuppliersManagement/SuppliersManagement';

import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const ADMIN_UID = "nByRorkQuHOUNcySWbSR7nDnzXY2";

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  const [products, setProducts] = useState([
    { name: 'Product 1', quantity: 10, price: 20, barcode: '1234567890' },
    { name: 'Product 2', quantity: 5, price: 30, barcode: '2345678901' },
    { name: 'Product 3', quantity: 2, price: 50, barcode: '3456789012' },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        console.error(error);
      }
    };

    fetchCustomers();
  }, []);

  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (indexToDelete) => {
    setProducts(products.filter((_, index) => index !== indexToDelete));
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (authLoading) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  // ✅ If no login required, auto allow dashboard
  const isAdmin = user?.uid === ADMIN_UID;

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} isAdmin={isAdmin} onLogout={handleLogout} />

        <main className="main-content">
          <div className="content-wrapper">
            <Routes>

              {/* Direct move to dashboard */}
              <Route path="/" element={<Dashboard products={products} />} />

              <Route
                path="/products"
                element={<ProductList products={products} deleteProduct={deleteProduct} />}
              />

           

              <Route
                path="/billing"
                element={
                  <Billing
                    products={products}
                    setProducts={setProducts}
                    customers={customers}
                  />
                }
              />

              <Route path="/customers" element={<Customers customers={customers} />} />

              <Route path="/add-product" element={<AddProductForm addProduct={addProduct} />} />

<Route path="/edit-product/:id" element={<EditProductForm />} />

<Route path="/staff" element={<StaffManagement />} />

<Route path="/suppliers" element={<SuppliersManagement />} />

            

              {/* Any wrong route goes dashboard */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
