import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import './AddProductForm.css';

const EditProductForm = ({ onClose }) => {
  const { id } = useParams(); // Firestore doc ID from route
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    sku: '',
    category: '',
    supplier: '',
    quantity: '',
    price: '',
    reorderLevel: '',
    expiryDate: '',
    description: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product from Firestore
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ ...data });
          if (data.image) setImagePreview(data.image);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setProduct({ ...product, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = product.image;

      if (product.image instanceof File) {
        const storageRef = ref(storage, `products/${product.image.name}`);
        await uploadBytes(storageRef, product.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updatedProduct = {
        ...product,
        quantity: parseInt(product.quantity),
        price: parseFloat(product.price),
        reorderLevel: parseInt(product.reorderLevel),
        image: imageUrl,
      };

      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, updatedProduct);

      navigate('/products'); // back to list
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setLoading(false);
  };

  if (loading)
    return <p style={{ color: '#fff', textAlign: 'center' }}>Loading product...</p>;

  return (
    <div className="container">
      <div className="form-header">
        <h2>💻 Edit Product</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input className="dark-input" 
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
          />
          <input className="dark-input" 
            type="text"
            name="sku"
            placeholder="SKU"
            value={product.sku}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <select className="dark-input"  name="category" value={product.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Grocery">Grocery</option>
            <option value="Clothing">Clothing</option>
            <option value="Stationery">Stationery</option>
          </select>

          <select className="dark-input"  name="supplier" value={product.supplier} onChange={handleChange}>
            <option value="">Select Supplier</option>
            <option value="Supplier A">Supplier A</option>
            <option value="Supplier B">Supplier B</option>
            <option value="Supplier C">Supplier C</option>
          </select>
        </div>

        <div className="form-row">
          <input className="dark-input" 
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={product.quantity}
            onChange={handleChange}
            required
          />
          <input className="dark-input" 
            type="number"
            name="price"
            placeholder="Price per Unit"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input className="dark-input" 
            type="number"
            name="reorderLevel"
            placeholder="Reorder Level"
            value={product.reorderLevel}
            onChange={handleChange}
          />
          <input className="dark-input" 
            type="date"
            name="expiryDate"
            value={product.expiryDate}
            onChange={handleChange}
          />
        </div>

        <textarea className="dark-input" 
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          rows={3}
        />

        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductForm;
