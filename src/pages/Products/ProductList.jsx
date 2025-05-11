import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = ({ products, deleteProduct }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2>📦 Product List</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: '10px',
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
            <h3>{product.name}</h3>
            <p>Quantity: {product.quantity}</p>
            <p>Price: ₹{product.price}</p>
            <button onClick={() => navigate(`/edit-product/${index}`)}>
              ✏️ Edit
            </button>
            <button
              style={{ marginLeft: '10px', backgroundColor: '#e74c3c' }}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this product?')) {
                  deleteProduct(index);
                }
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;





