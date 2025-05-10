import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = ({ products, deleteProduct }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>📦 Product List</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product, index) => (
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





