import React, { useState, useEffect } from 'react';

const EditProductForm = ({ product, updateProduct }) => {
  const [productName, setProductName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity);
  const [price, setPrice] = useState(product.price);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    updateProduct(updatedProduct);  // Update the product in the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block">Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block">Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
          required
        />
      </div>
      <button type="submit" className="bg-green-500 text-white p-2 rounded mt-4">
        Update Product
      </button>
    </form>
  );
};

export default EditProductForm;

