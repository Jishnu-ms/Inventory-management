import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './ProductList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(items);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts(); // refresh list
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <p style={{ color: '#fff', textAlign: 'center' }}>Loading products...</p>;

  return (
    <div className="container">
      <h2>📦 Product List</h2>

      <input
        type="text"
        placeholder="Search by product name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {filteredProducts.length === 0 ? (
        <p style={{ color: '#ccc', marginTop: '1rem' }}>No matching products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img src={product.image} alt={product.name} className="product-image" />
            )}
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>SKU: {product.sku || 'N/A'}</p>
              <p>Category: {product.category || 'N/A'}</p>
              <p>Supplier: {product.supplier || 'N/A'}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Price: ₹{product.price}</p>
              <p>Reorder Level: {product.reorderLevel || '-'}</p>
              {product.expiryDate && <p>Expiry: {product.expiryDate}</p>}
              {product.description && <p>{product.description}</p>}
            </div>
            <div className="product-actions">
              <button onClick={() => navigate(`/edit-product/${product.id}`)}>✏️ Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
