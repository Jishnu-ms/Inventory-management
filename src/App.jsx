import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import AddProductForm from './pages/Products/AddProductForm';
import Billing from './pages/Billing';
import EditProductForm from './pages/Products/EditProductForm';
import AddCustomerForm from './pages/Customers/AddCustomerForm';
import Customers from './pages/Customers';
import Login from './pages/Login';

// Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// ✅ Admin UID
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

  // 🔥 Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  // Products CRUD functions
  const addProduct = (newProduct) => setProducts([...products, newProduct]);
  const deleteProduct = (indexToDelete) =>
    setProducts(products.filter((_, index) => index !== indexToDelete));
  const updateProduct = (updatedProducts) => setProducts(updatedProducts);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (authLoading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  // If not logged in, show login page
  if (!user) return <Login onLogin={() => setUser(auth.currentUser)} />;

  // Check admin UID
  const isAdmin = user.uid === ADMIN_UID;

  return (
    <Router>
      <Navbar user={user} isAdmin={isAdmin} onLogout={handleLogout} />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard products={products} />} />
          <Route
            path="/products"
            element={<ProductList products={products} deleteProduct={deleteProduct} />}
          />
          <Route
            path="/add-product"
            element={isAdmin ? <AddProductForm addProduct={addProduct} /> : <Navigate to="/" />}
          />
          <Route
            path="/edit-product/:id"
            element={isAdmin ? <EditProductForm /> : <Navigate to="/" />}
          />
          <Route
            path="/add-customer"
            element={isAdmin ? <AddCustomerForm /> : <Navigate to="/" />}
          />
          <Route
            path="/billing"
            element={<Billing products={products} setProducts={setProducts} customers={customers} />}
          />
          <Route path="/customers" element={<Customers customers={customers} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
