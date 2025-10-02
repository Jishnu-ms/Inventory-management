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
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    dateJoined: new Date().toISOString().split("T")[0],
    history: [],
  });

  const [editCustomer, setEditCustomer] = useState(null); // currently editing customer

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

  // Add new customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      alert("⚠️ Please fill out Name and Phone Number.");
      return;
    }

    try {
      await addDoc(collection(db, "customers"), {
        ...newCustomer,
        createdAt: serverTimestamp(),
      });
      alert("✅ Customer added successfully!");
      setNewCustomer({
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
      console.error("Error adding customer:", error);
      alert("❌ Failed to add customer. Please try again.");
    }
  };

  // Update customer
  const handleUpdate = async () => {
    if (!editCustomer.name || !editCustomer.phone) {
      alert("⚠️ Name and Phone cannot be empty.");
      return;
    }
    try {
      const customerRef = doc(db, "customers", editCustomer.id);
      await updateDoc(customerRef, {
        name: editCustomer.name,
        phone: editCustomer.phone,
        email: editCustomer.email,
        address: editCustomer.address,
        notes: editCustomer.notes,
      });
      alert("✅ Customer updated successfully!");
      setEditCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("❌ Failed to update customer.");
    }
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
      <h2>👤 Customer Management</h2>

      {/* Add Customer Form */}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            className="dark-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            required
          />
          <input
            className="dark-input"
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            required
          />
        </div>

        <div className="form-row">
          <input
            className="dark-input"
            type="email"
            name="email"
            placeholder="Email Address"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
          />
        </div>

        <textarea
          className="dark-input"
          name="address"
          placeholder="Customer Address"
          value={newCustomer.address}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, address: e.target.value })
          }
          rows={3}
        />

        <textarea
          className="dark-input"
          name="notes"
          placeholder="Additional Notes"
          value={newCustomer.notes}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, notes: e.target.value })
          }
          rows={2}
        />

        <div className="form-row">
          <input
            className="dark-input"
            type="date"
            name="dateJoined"
            value={newCustomer.dateJoined}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, dateJoined: e.target.value })
            }
            disabled
          />
        </div>

        <button type="submit">Add Customer</button>
        <br />
      </form>

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
                    onClick={() => setEditCustomer(cust)}
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
      )}

      {/* Edit Customer Popup */}
      {editCustomer && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h3>Edit Customer</h3>
            <div className="edit-item-row">
              <span>Name:</span>
              <input
                type="text"
                value={editCustomer.name}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, name: e.target.value })
                }
              />
            </div>
            <div className="edit-item-row">
              <span>Phone:</span>
              <input
                type="text"
                value={editCustomer.phone}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, phone: e.target.value })
                }
              />
            </div>
            <div className="edit-item-row">
              <span>Email:</span>
              <input
                type="email"
                value={editCustomer.email || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, email: e.target.value })
                }
              />
            </div>
            <div className="edit-item-row">
              <span>Address:</span>
              <input
                type="text"
                value={editCustomer.address || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, address: e.target.value })
                }
              />
            </div>
            <div className="edit-item-row">
              <span>Notes:</span>
              <input
                type="text"
                value={editCustomer.notes || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, notes: e.target.value })
                }
              />
            </div>

            <div className="edit-popup-buttons">
              <button className="btn-update" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="btn-cancel"
                onClick={() => setEditCustomer(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
