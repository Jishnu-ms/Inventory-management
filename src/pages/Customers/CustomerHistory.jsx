import React from 'react';
import { useParams } from 'react-router-dom';

const CustomerHistory = ({ customers }) => {
  const { customerIndex } = useParams();  // Retrieve customerIndex from URL
  const customer = customers[customerIndex];  // Get customer data using the index

  if (!customer) {
    return <p>Customer not found</p>;
  }

  return (
    <div>
      <h2>{customer.name}'s History</h2>
      {customer.history.length > 0 ? (
        <ul>
          {customer.history.map((entry, index) => (
            <li key={index}>
              <strong>Invoice ID:</strong> {entry.invoiceID}<br />
              <strong>Date:</strong> {entry.date}<br />
              <strong>Total:</strong> ₹{entry.total}
            </li>
          ))}
        </ul>
      ) : (
        <p>No billing history available.</p>
      )}
    </div>
  );
};

export default CustomerHistory;

