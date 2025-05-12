import React, { useState } from 'react';

const AddCustomer = ({ addCustomer }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddCustomer = () => {
    if (!name || !phone) {
      alert('Please fill out both fields');
      return;
    }
    addCustomer({ name, phone, history: [] });
    setName('');
    setPhone('');
    alert('Customer added successfully');
  };

  return (
    <div>
      <h3>Add New Customer</h3>
      <input
        type="text"
        placeholder="Enter customer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter customer phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleAddCustomer}>Add Customer</button>
    </div>
  );
};

export default AddCustomer;

