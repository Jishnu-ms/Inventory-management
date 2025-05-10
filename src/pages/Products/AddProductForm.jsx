import React, { useState } from 'react';

const AddProductForm = ({ addProduct }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    addProduct(newProduct);  // Passing the new product to the parent component
    setProductName('');
    setQuantity('');
    setPrice('');
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
      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;

