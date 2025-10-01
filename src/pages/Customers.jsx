import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customerList = [];
      querySnapshot.forEach((docSnap) => {
        customerList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCustomers(customerList);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter((cust) =>
    cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cust.phone && cust.phone.includes(searchQuery)) ||
    (cust.email && cust.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading customers...</p>;
  }

  return (
    <div className="container">
      <h2>📋 Customer List</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, phone or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {filteredCustomers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.name}</td>
                <td>{cust.phone}</td>
                <td>{cust.email || "-"}</td>
                <td>{cust.address || "-"}</td>
                <td>{cust.dateJoined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Customers;
