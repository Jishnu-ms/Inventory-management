import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // adjust path
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import "./CustomerManagement.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCustomer, setCurrentCustomer] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    dateJoined: new Date().toISOString().split("T")[0],
    history: [],
  });

  // Fetch customers
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

  // Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentCustomer.name || !currentCustomer.phone) {
      alert("⚠️ Please fill out Name and Phone Number.");
      return;
    }

    try {
      if (currentCustomer.id) {
        // Update existing customer
        const customerRef = doc(db, "customers", currentCustomer.id);
        await updateDoc(customerRef, {
          name: currentCustomer.name,
          phone: currentCustomer.phone,
          email: currentCustomer.email,
          address: currentCustomer.address,
          notes: currentCustomer.notes,
        });
        alert("✅ Customer updated successfully!");
      } else {
        // Add new customer
        await addDoc(collection(db, "customers"), {
          ...currentCustomer,
          createdAt: serverTimestamp(),
        });
        alert("✅ Customer added successfully!");
      }

      // Reset form
      setCurrentCustomer({
        id: null,
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
        dateJoined: new Date().toISOString().split("T")[0],
        history: [],
      });
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("❌ Failed to save customer.");
    }
  };

  // Edit customer (populate form)
  const handleEdit = (cust) => {
    setCurrentCustomer({
      id: cust.id,
      name: cust.name || "",
      phone: cust.phone || "",
      email: cust.email || "",
      address: cust.address || "",
      notes: cust.notes || "",
      dateJoined: cust.dateJoined || new Date().toISOString().split("T")[0],
      history: cust.history || [],
    });
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteDoc(doc(db, "customers", id));
      alert("✅ Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("❌ Failed to delete customer.");
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(
    (cust) =>
      cust.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust.phone && cust.phone.includes(searchQuery)) ||
      (cust.email &&
        cust.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container">
      <h2 className="dashboard-title">👤 Customer Management</h2>

      {/* Add/Edit Customer Form */}
      <form className="form" onSubmit={handleSubmit}>
        <label>Name & Phone Number</label>
        <div className="form-row">
          <input
            className="dark-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={currentCustomer.name}
            onChange={(e) =>
              setCurrentCustomer({ ...currentCustomer, name: e.target.value })
            }
            required
          />
          <input
            className="dark-input"
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={currentCustomer.phone}
            onChange={(e) =>
              setCurrentCustomer({ ...currentCustomer, phone: e.target.value })
            }
            required
          />
        </div>

        <label>Email</label>
        <div className="form-row">
          <input
            className="dark-input"
            type="email"
            name="email"
            placeholder="Email Address"
            value={currentCustomer.email}
            onChange={(e) =>
              setCurrentCustomer({ ...currentCustomer, email: e.target.value })
            }
          />
        </div>

        <label>Address</label>
        <textarea
          className="dark-input"
          name="address"
          placeholder="Customer Address"
          value={currentCustomer.address}
          onChange={(e) =>
            setCurrentCustomer({ ...currentCustomer, address: e.target.value })
          }
          rows={3}
        />

        <label>Notes</label>
        <textarea
          className="dark-input"
          name="notes"
          placeholder="Additional Notes"
          value={currentCustomer.notes}
          onChange={(e) =>
            setCurrentCustomer({ ...currentCustomer, notes: e.target.value })
          }
          rows={2}
        />

        <label>Date Joined</label>
        <div className="form-row">
          <input
            className="dark-input"
            type="date"
            name="dateJoined"
            value={currentCustomer.dateJoined}
            onChange={(e) =>
              setCurrentCustomer({ ...currentCustomer, dateJoined: e.target.value })
            }
            disabled
          />
        </div>

        <button type="submit">
          {currentCustomer.id ? "Update Customer" : "Add Customer"}
        </button>
        {currentCustomer.id && (
          <button
            type="button"
            onClick={() =>
              setCurrentCustomer({
                id: null,
                name: "",
                phone: "",
                email: "",
                address: "",
                notes: "",
                dateJoined: new Date().toISOString().split("T")[0],
                history: [],
              })
            }
          >
            Cancel
          </button>
        )}
      </form>
      <br></br>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by name, phone or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Customer List */}
      {loading ? (
        <p style={{ color: "#fff", textAlign: "center" }}>
          Loading customers...
        </p>
      ) : filteredCustomers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Notes</th>
                <th>Date Joined</th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust.id}>
                  <td>{cust.name}</td>
                  <td>{cust.phone}</td>
                  <td>{cust.email || "-"}</td>
                  <td>{cust.address || "-"}</td>
                  <td>{cust.notes || "-"}</td>
                  <td>{cust.dateJoined}</td>
                  <td className="no-print">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(cust)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-remove"
                      onClick={() => handleDelete(cust.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
