import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./Dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(items);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p style={{ color: "#fff", textAlign: "center" }}>Loading dashboard...</p>;

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity), 0);
  const totalValue = products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price), 0);

  const lowStockItemsList = products.filter(p => Number(p.quantity) <= Number(p.reorderLevel) && Number(p.quantity) > 0);
  const outOfStockItemsList = products.filter(p => Number(p.quantity) === 0);

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const openModal = (title, items) => {
    setModalTitle(title);
    setModalItems(items);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="dashboard-container">
      <h2>📊 Inventory Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Stock</h3>
          <p>{totalStock}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Inventory Value</h3>
          <p>₹{totalValue.toLocaleString()}</p>
        </div>

        <div
          className="dashboard-card warning"
          onClick={() => openModal("Low Stock Items", lowStockItemsList)}
          style={{ cursor: "pointer" }}
        >
          <h3>Low Stock Items</h3>
          <p>{lowStockItemsList.length}</p>
        </div>

        <div
          className="dashboard-card danger"
          onClick={() => openModal("Out of Stock Items", outOfStockItemsList)}
          style={{ cursor: "pointer" }}
        >
          <h3>Out of Stock Items</h3>
          <p>{outOfStockItemsList.length}</p>
        </div>
      </div>

      <div className="category-section">
        <h3>Products by Category</h3>
        <div className="category-grid">
          {Object.keys(categoryCounts).map((cat, i) => (
            <div key={i} className="category-card">
              <h4>{cat}</h4>
              <p>{categoryCounts[cat]} products</p>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-products">
        <h3>Recent Products Added</h3>
        {products.slice(-5).reverse().map((p, idx) => (
          <div key={idx} className="recent-card">
            <p><strong>{p.name}</strong> | Qty: {p.quantity} | ₹{p.price}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{modalTitle}</h3>
            <ul>
              {modalItems.map((item) => (
                <li key={item.id}>
                  {item.name} | Qty: {item.quantity} | ₹{item.price}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
