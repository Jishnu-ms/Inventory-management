import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddProductForm.css";

const AddProductForm = ({ onClose }) => {
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    quantity: "",
    price: "",
    reorderLevel: "",
    expiryDate: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suppliersList, setSuppliersList] = useState([]);

  // Fetch suppliers from Firestore
  const fetchSuppliers = async () => {
    try {
      const querySnap = await getDocs(collection(db, "suppliers"));
      const list = querySnap.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
      setSuppliersList(list);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
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
      let imageUrl = "";

      // Upload image if exists
      if (product.image) {
        const imageRef = ref(storage, `products/${product.image.name}_${Date.now()}`);
        await uploadBytes(imageRef, product.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add product to Firestore
      await addDoc(collection(db, "products"), {
        name: product.name,
        sku: product.sku,
        category: product.category,
        supplier: product.supplier,
        quantity: parseInt(product.quantity),
        price: parseFloat(product.price),
        reorderLevel: parseInt(product.reorderLevel),
        expiryDate: product.expiryDate,
        description: product.description,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Product added successfully!");
      onClose(); // Close the modal

    }  finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-header">
        <h2 className="dashboard-title">➕ Add New Product</h2>
        <button className="close-btn" onClick={onClose}></button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <label>Name & SKU</label>  
        <div className="form-row">
          <input
            className="dark-input"
            type="text"
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            required
          />
          <input
            className="dark-input"
            type="text"
            name="sku"
            placeholder="SKU"
            onChange={handleChange}
            required
          />
        </div>
        <label>Category & Supplier</label>  
        <div className="form-row">
          <select
            className="dark-input"
            name="category"
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Grocery">Grocery</option>
            <option value="Clothing">Clothing</option>
            <option value="Stationery">Stationery</option>
          </select>

          <select
            className="dark-input"
            name="supplier"
            onChange={handleChange}
          >
            <option value="">Select Supplier</option>
            {suppliersList.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <label>Quantity & Price</label>  
        <div className="form-row">
          
          <input
            className="dark-input"
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            required
          />
          <input
            className="dark-input"
            type="number"
            name="price"
            placeholder="Price per Unit"
            onChange={handleChange}
            required
          />
        </div>
        <label>Reorder Level & Expiry Date</label>  
        <div className="form-row">
          <input
            className="dark-input"
            type="number"
            name="reorderLevel"
            placeholder="Reorder Level"
            onChange={handleChange}
          />
          <input
            className="dark-input"
            type="date"
            name="expiryDate"
            onChange={handleChange}
          />
        </div>
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          rows={3}
        />

        {/* Image preview */}
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
