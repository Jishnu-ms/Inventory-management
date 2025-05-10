import React, { useState, useEffect } from 'react';

const Dashboard = ({ products }) => {
  // Calculate some key metrics
  const totalStockValue = products.reduce(
    (total, product) => total + product.quantity * product.price,
    0
  );

  const lowStockProducts = products.filter((product) => product.quantity <= 5);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Total Stock Value</h3>
        <p>${totalStockValue.toFixed(2)}</p>
      </div>
      <div>
        <h3>Low Stock Items</h3>
        <ul>
          {lowStockProducts.map((product, index) => (
            <li key={index}>{product.name} - Quantity: {product.quantity}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Total Products</h3>
        <p>{products.length}</p>
      </div>
    </div>
  );
};

export default Dashboard;
