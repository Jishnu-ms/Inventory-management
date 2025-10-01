import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed
import "./AddCustomerForm.css";

const AddCustomerForm = () => {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    dateJoined: new Date().toISOString().split("T")[0],
    history: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert("⚠️ Please fill out Name and Phone Number.");
      return;
    }

    try {
      await addDoc(collection(db, "customers"), {
        ...customer,
        createdAt: serverTimestamp(),
      });

      alert("✅ Customer added successfully!");
      navigate("/customers"); // redirect to customer list
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("❌ Failed to add customer. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-header">
        <h2>👤 Add New Customer</h2>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input className="dark-input" 
            type="text"
            name="name"
            placeholder="Full Name"
            value={customer.name}
            onChange={handleChange}
            required
          />
          <input className="dark-input" 
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input className="dark-input" 
            type="email"
            name="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={handleChange}
          />
        </div>

        <textarea className="dark-input" 
          name="address"
          placeholder="Customer Address"
          value={customer.address}
          onChange={handleChange}
          rows={3}
        />

        <textarea className="dark-input" 
          name="notes"
          placeholder="Additional Notes"
          value={customer.notes}
          onChange={handleChange}
          rows={2}
        />

        <div className="form-row">
          <input className="dark-input" 
            type="date"
            name="dateJoined"
            value={customer.dateJoined}
            onChange={handleChange}
            disabled
          />
        </div>

        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomerForm;
