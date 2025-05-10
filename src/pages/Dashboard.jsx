import React from 'react';

const Dashboard = ({ products }) => {
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <div className="container">
      <h2>📊 Dashboard Overview</h2>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="card">
          <h3>Total Stock</h3>
          <p>{totalStock}</p>
        </div>
        <div className="card">
          <h3>Total Inventory Value</h3>
          <p>₹{totalValue}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
