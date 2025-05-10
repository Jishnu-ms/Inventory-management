import React, { useState } from 'react';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';

const ProductList = ({ products, deleteProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="p-2 border border-gray-300 rounded w-full mb-4"
      />
      <ul className="space-y-4">
        {filteredProducts.map((product, index) => (
          <li key={index} className="p-4 border border-gray-300 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl">{product.name}</h3>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ${product.price}</p>
              </div>
              <button
                onClick={() => deleteProduct(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};



export default ProductList;




