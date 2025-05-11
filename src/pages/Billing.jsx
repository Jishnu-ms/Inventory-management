import React, { useState } from 'react';
import './Billing.css';

const Billing = ({ products, setProducts }) => {
  const [billedItems, setBilledItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToBill = (index) => {
    const product = products[index];

    if (product.quantity <= 0) {
      alert('Out of stock!');
      return;
    }

    const existingIndex = billedItems.findIndex(item => item.name === product.name);

    const updatedProducts = [...products];
    updatedProducts[index].quantity -= 1;
    setProducts(updatedProducts);

    if (existingIndex !== -1) {
      const updatedBill = [...billedItems];
      updatedBill[existingIndex].count += 1;
      setBilledItems(updatedBill);
    } else {
      setBilledItems([...billedItems, { ...product, count: 1 }]);
    }
  };

  const removeFromBill = (indexToRemove) => {
    const item = billedItems[indexToRemove];

    const updatedProducts = [...products];
    const productIndex = products.findIndex(p => p.name === item.name);
    if (productIndex !== -1) {
      updatedProducts[productIndex].quantity += 1;
      setProducts(updatedProducts);
    }

    const updated = [...billedItems];
    if (updated[indexToRemove].count > 1) {
      updated[indexToRemove].count -= 1;
    } else {
      updated.splice(indexToRemove, 1);
    }
    setBilledItems(updated);
  };

  const handlePrint = () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';
    window.print();
    if (navbar) setTimeout(() => (navbar.style.display = 'block'), 1000);
  };

  const totalAmount = billedItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  // Filter products by search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2>🧾 Billing</h2>

      <div className="no-print">
        <h3>Available Products</h3>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px',
            width: '50%',
            marginBottom: '20px',
            borderRadius: '5px',
        
          }}
        />

        {filteredProducts.length === 0 ? (
          <p>No matching products found.</p>
        ) : (
          filteredProducts.map((product, index) => (
            <div key={index} className="card">
              <h4>{product.name}</h4>
              <p>Quantity: {product.quantity}</p>
              <p>Price: ₹{product.price}</p>
              <button
                onClick={() => addToBill(products.indexOf(product))}
                disabled={product.quantity <= 0}
              >
                {product.quantity > 0 ? '➕ Add to Bill' : '❌ Out of Stock'}
              </button>
            </div>
          ))
        )}
      </div>

      <h3>Billed Items</h3>
      {billedItems.length === 0 ? (
        <p>No items in bill.</p>
      ) : (
        <table className="bill-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th className="no-print">Remove</th>
            </tr>
          </thead>
          <tbody>
            {billedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.count}</td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.count}</td>
                <td className="no-print">
                  <button onClick={() => removeFromBill(index)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total</strong></td>
              <td colSpan="2"><strong>₹{totalAmount}</strong></td>
            </tr>
          </tfoot>
        </table>
      )}

      {billedItems.length > 0 && (
        <button
          onClick={handlePrint}
          className="no-print"
          style={{ marginTop: '20px' }}
        >
          🖨️ Print Bill
        </button>
      )}
    </div>
  );
};

export default Billing;







