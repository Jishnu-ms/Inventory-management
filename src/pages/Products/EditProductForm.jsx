import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProductForm = ({ products, updateProduct }) => {
  const { index } = useParams(); // Extract the index from URL params
  const navigate = useNavigate(); // To navigate after updating
  const [form, setForm] = useState({ name: '', quantity: '', price: '' });

  // Populate the form with the existing product details
  useEffect(() => {
    if (products[index]) {
      setForm(products[index]);
    }
  }, [index, products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Update form state
  };

  // Handle form submission and update the product in the list
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProducts = [...products];  // Copy the products array
    updatedProducts[index] = form;         // Update the selected product
    updateProduct(updatedProducts);        // Call the updateProduct function passed via props
    navigate('/products');                 // Navigate back to the product list
  };

  return (
    <div className="container">
      <h2>💻 Edit Product</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label><strong>Product Name</strong></label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br></br>
        <br></br>
        <label><strong>Quantity</strong></label>
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <br></br>
        <br></br>
        <label><strong>Price</strong></label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductForm;
