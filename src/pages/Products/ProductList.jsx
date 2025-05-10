import React, { useState } from 'react';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const editProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.name === updatedProduct.name ? updatedProduct : product
      )
    );
    setEditingProduct(null); // Reset editing state
  };

  return (
    <div>
      <h2>Product Inventory</h2>
      {editingProduct ? (
        <EditProductForm product={editingProduct} onEditProduct={editProduct} />
      ) : (
        <AddProductForm onAddProduct={addProduct} />
      )}
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <span>{product.name} - </span>
            <span>Quantity: {product.quantity} - </span>
            <span>Price: ${product.price}</span>
            <button onClick={() => setEditingProduct(product)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

