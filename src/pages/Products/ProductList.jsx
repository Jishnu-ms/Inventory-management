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
    <div className="container2">
      <h2>📦 Product List</h2>

      <input
        type="text"
        placeholder="Search by product name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

{filteredProducts.map((product) => {
  const stockStatus = Number(product.quantity || 0) === 0 ? 'out' : 
                      Number(product.quantity || 0) <= 5 ? 'low' : 'good';

  return (
    <div key={product.id} className="recent-item">
      <div className="recent-header">
        <div className="product-icon">📦</div>
        <div className={`stock-indicator ${stockStatus}`}></div>
      </div>

      <div className="recent-content">
        <h4 className="product-name">{product.name}</h4>

        {/* Quantity + Price */}
        <div className="product-details">
          <span className="product-qty">Qty: {product.quantity || 0}</span>
          <span className="product-price">₹{Number(product.price || 0).toLocaleString()}</span>
        </div>

        {/* Category */}
        <div className="product-category">{product.category || "Uncategorized"}</div>

        {/* Supplier / SKU / Expiry */}
        <div className="extra-details">
          <p><strong>Supplier:</strong> {product.supplier || "N/A"}</p>
          <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
          <p><strong>Expiry:</strong> {product.expiryDate || "N/A"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="product-actions">
        <button onClick={() => navigate(`/edit-product/${product.id}`)}>✏️ Edit</button>
        <button className="delete-btn" onClick={() => handleDelete(product.id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
})}

    </div>
  );
};

export default ProductList;



