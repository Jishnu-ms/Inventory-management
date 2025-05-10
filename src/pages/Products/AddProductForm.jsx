import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProductForm = ({ addProduct }) => {
  const [product, setProduct] = useState({ name: '', quantity: '', price: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      ...product,
      quantity: parseInt(product.quantity),
      price: parseFloat(product.price),
    });
    navigate('/products');
  };

  return (
    <div className="container">
      <h2>➕ Add New Product</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />
         <br></br>
        <br></br>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          required
        />
        <br></br>
        <br></br>
        
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;


