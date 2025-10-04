import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!products.length) return {
      totalProducts: 0,
      totalStock: 0,
      totalValue: 0,
      lowStockItems: [],
      outOfStockItems: [],
      categoryCounts: {},
      avgPrice: 0
    };
    
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
    const totalValue = products.reduce(
      (sum, p) => sum + (Number(p.quantity || 0) * Number(p.price || 0)),
      0
    );
    
    const lowStockItems = products.filter(
      (p) => Number(p.quantity || 0) <= Number(p.reorderLevel || 5) && Number(p.quantity || 0) > 0
    );
    const outOfStockItems = products.filter((p) => Number(p.quantity || 0) === 0);
    
    const categoryCounts = products.reduce((acc, p) => {
      const category = p.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    const avgPrice = totalStock > 0 ? totalValue / totalStock : 0;
    
    return {
      totalProducts,
      totalStock,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categoryCounts,
      avgPrice
    };
  }, [products]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const openModal = (title, items) => {
    setModalTitle(title);
    setModalItems(items);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalItems([]);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">📊 Dashboard Overview</h1>
          <p className="dashboard-subtitle">Monitor your inventory performance and key metrics</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-section">
        <h2 className="section-title">📈 Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-icon">📦</div>
            <div className="metric-content">
              <div className="metric-value">{analytics.totalProducts.toLocaleString()}</div>
              <div className="metric-label">Total Products</div>
            </div>
          </div>
          
          <div className="metric-card success">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <div className="metric-value">{analytics.totalStock.toLocaleString()}</div>
              <div className="metric-label">Total Stock</div>
            </div>
          </div>
          
          <div className="metric-card info">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <div className="metric-value">₹{analytics.totalValue.toLocaleString()}</div>
              <div className="metric-label">Inventory Value</div>
            </div>
          </div>
          
          <div className="metric-card secondary">
            <div className="metric-icon">💵</div>
            <div className="metric-content">
              <div className="metric-value">₹{Math.round(analytics.avgPrice).toLocaleString()}</div>
              <div className="metric-label">Average Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts-section">
        <h2 className="section-title">⚠️ Inventory Alerts</h2>
        <div className="alerts-grid">
          <div 
            className="alert-card warning clickable"
            onClick={() => openModal("Low Stock Items", analytics.lowStockItems)}
          >
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <div className="alert-number">{analytics.lowStockItems.length}</div>
              <div className="alert-text">Low Stock Items</div>
            </div>
          </div>
          
          <div 
            className="alert-card danger clickable"
            onClick={() => openModal("Out of Stock Items", analytics.outOfStockItems)}
          >
            <div className="alert-icon">🚫</div>
            <div className="alert-content">
              <div className="alert-number">{analytics.outOfStockItems.length}</div>
              <div className="alert-text">Out of Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2 className="section-title">🏷️ Product Categories</h2>
        <div className="categories-grid">
          {Object.entries(analytics.categoryCounts).map(([category, count]) => {
            const categoryItems = products.filter(p => (p.category || 'Uncategorized') === category);
            const categoryValue = categoryItems.reduce(
              (sum, p) => sum + (Number(p.quantity || 0) * Number(p.price || 0)), 
              0
            );
            
            return (
              <div 
                key={category}
                className="category-card clickable"
                onClick={() => openModal(`Category: ${category}`, categoryItems)}
              >
                <div className="category-header">
                  <div className="category-icon">📋</div>
                  <div className="category-count">{count}</div>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category}</h3>
                  <p className="category-value">₹{categoryValue.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="recent-section">
        <h2 className="section-title">🆕 Recent Products</h2>
        <div className="recent-grid">
          {products.slice(-8).reverse().map((product) => {
            const stockStatus = Number(product.quantity || 0) === 0 ? 'out' : 
                               Number(product.quantity || 0) <= 5 ? 'low' : 'good';
            
            return (
              <div key={product.id} className="recent2-item">
                <div className="recent2-header">
                  <div className="product2-icon">📦</div>
                  <div className={`stock-indicator ${stockStatus}`}></div>
                </div>
                <div className="recent2-content">
                  <h4 className="product2-name">{product.name}</h4>
                  <div className="product2-details">
                    <span className="product2-qty">Qty: {product.quantity || 0}</span>
                    <span className="product2-price">₹{Number(product.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="product2-category">{product.category || 'Uncategorized'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modalTitle}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {modalItems.length === 0 ? (
                <div className="empty-state">
                  <p>No items found in this category.</p>
                </div>
              ) : (
                <div className="modal-items">
                  {modalItems.map((item) => (
                    <div key={item.id} className="modal-item">
                      <div className="item-info">
                        <h4 className="item-name">{item.name}</h4>
                        <div className="item-details">
                          <span>Quantity: {item.quantity || 0}</span>
                          <span>Price: ₹{Number(item.price || 0).toLocaleString()}</span>
                          <span>Category: {item.category || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="item-value">
                        ₹{((Number(item.quantity || 0) * Number(item.price || 0))).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <div className="modal-summary">
                <span>Total Items: {modalItems.length}</span>
                <span>Total Value: ₹{modalItems.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0).toLocaleString()}</span>
              </div>
              <button onClick={closeModal} className="modal-btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

