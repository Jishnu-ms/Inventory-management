import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./SuppliersManagement.css";

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSupplierId, setEditingSupplierId] = useState(null);

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [supplyPopup, setSupplyPopup] = useState(false);
  const [newSupply, setNewSupply] = useState({
    productName: "",
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    rate: "",
    total: 0,
    paid: "",
    due: 0,
  });

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const querySnap = await getDocs(collection(db, "suppliers"));
      const list = querySnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      setSuppliers(list);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Add or Update supplier
  const handleAddOrUpdateSupplier = async (e) => {
    e.preventDefault();
    if (!newSupplier.name) {
      alert("Supplier name is required!");
      return;
    }

    try {
      if (editingSupplierId) {
        // Update existing supplier
        await updateDoc(doc(db, "suppliers", editingSupplierId), newSupplier);
        alert("Supplier updated!");
      } else {
        // Add new supplier
        await addDoc(collection(db, "suppliers"), { ...newSupplier, createdAt: serverTimestamp() });
        alert("Supplier added!");
      }

      setNewSupplier({ name: "", contact: "", phone: "", email: "", address: "", notes: "" });
      setEditingSupplierId(null);
      fetchSuppliers();
    } catch (error) {
      console.error("Error adding/updating supplier:", error);
    }
  };

  // Edit supplier
  const handleEditSupplier = (supplier) => {
    setNewSupplier({
      name: supplier.name,
      contact: supplier.contact || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      notes: supplier.notes || "",
    });
    setEditingSupplierId(supplier.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete supplier
  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Delete this supplier?")) {
      await deleteDoc(doc(db, "suppliers", id));
      fetchSuppliers();
    }
  };

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.includes(searchQuery)
  );

  // Fetch supplies for selected supplier
  const fetchSupplies = async (supplierId) => {
    try {
      const suppliesRef = collection(db, "suppliers", supplierId, "supplies");
      const snapshot = await getDocs(suppliesRef);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSupplies(list);
    } catch (error) {
      console.error("Error fetching supplies:", error);
    }
  };

  // Open supply popup
  const openSupplyPopup = (supplier) => {
    setSelectedSupplier(supplier);
    fetchSupplies(supplier.id);
    setSupplyPopup(true);
  };

  // Add supply
  const handleAddSupply = async (e) => {
    e.preventDefault();
    if (!newSupply.productName || !newSupply.quantity || !newSupply.rate) {
      alert("Fill all required fields!");
      return;
    }

    const total = parseFloat(newSupply.quantity) * parseFloat(newSupply.rate);
    const due = total - parseFloat(newSupply.paid || 0);

    try {
      const supplierRef = doc(db, "suppliers", selectedSupplier.id);
      const suppliesCollection = collection(supplierRef, "supplies");
      await addDoc(suppliesCollection, { ...newSupply, total, due, createdAt: serverTimestamp() });
      setNewSupply({
        productName: "",
        date: new Date().toISOString().split("T")[0],
        quantity: "",
        rate: "",
        total: 0,
        paid: "",
        due: 0,
      });
      fetchSupplies(selectedSupplier.id);
    } catch (error) {
      console.error("Error adding supply:", error);
    }
  };

  return (
    <div className="supplier-container">
      <h2 className="dashboard-title">🏭 Suppliers / Vendors</h2>

      {/* Add / Edit Supplier Form */}
      <form className="supplier-form" onSubmit={handleAddOrUpdateSupplier}>
         <label>Supplier Name & Contact Person</label> 
        <div className="form-row">
          <input
            type="text"
            placeholder="Supplier Name"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Contact Person"
            value={newSupplier.contact}
            onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
          />
        </div>
         <label>Phone Number & Email</label> 
        <div className="form-row">
          <input
            type="text"
            placeholder="Phone"
            value={newSupplier.phone}
            onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newSupplier.email}
            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
          />
        </div>
         <label>Address</label> 
        <textarea
          placeholder="Address"
          value={newSupplier.address}
          onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
        />
         <label>Notes</label> 
        <textarea
          placeholder="Notes"
          value={newSupplier.notes}
          onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
        />
        <button type="submit">{editingSupplierId ? "Update Supplier" : "Add Supplier"}</button>
        {editingSupplierId && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setNewSupplier({ name: "", contact: "", phone: "", email: "", address: "", notes: "" });
              setEditingSupplierId(null);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search suppliers..."
        className="supplier-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Supplier List */}
      {filteredSuppliers.length === 0 ? (
        <p>No suppliers found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="supplier-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Notes</th>
                <th>Supplies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.contact || "-"}</td>
                  <td>{s.phone || "-"}</td>
                  <td>{s.email || "-"}</td>
                  <td>{s.address || "-"}</td>
                  <td>{s.notes || "-"}</td>
                  <td>
                    <button className="btn-supply" onClick={() => openSupplyPopup(s)}>
                      View
                    </button>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditSupplier(s)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteSupplier(s.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Supply Popup */}
      {supplyPopup && selectedSupplier && (
        <div className="supply-popup">
          <div className="supply-popup-content">
            <h3>Supplies for {selectedSupplier.name}</h3>

            {/* Existing Supplies Table */}
            {supplies.length > 0 && (
              <div className="table-wrapper">
                <table className="supply-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Date</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplies.map((supply) => (
                      <tr key={supply.id}>
                        <td>{supply.productName}</td>
                        <td>{supply.date}</td>
                        <td>{supply.quantity}</td>
                        <td>{supply.rate}</td>
                        <td>{supply.total}</td>
                        <td>{supply.paid}</td>
                        <td>{supply.due}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br />
              </div>
            )}

            {/* Add Supply Form */}
            <form onSubmit={handleAddSupply}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newSupply.productName}
                  onChange={(e) => setNewSupply({ ...newSupply, productName: e.target.value })}
                  required
                />
                <input
                  type="date"
                  value={newSupply.date}
                  onChange={(e) => setNewSupply({ ...newSupply, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newSupply.quantity}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      quantity: e.target.value,
                      total: e.target.value * newSupply.rate,
                      due: e.target.value * newSupply.rate - (newSupply.paid || 0),
                    })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Rate per Unit"
                  value={newSupply.rate}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      rate: e.target.value,
                      total: newSupply.quantity * e.target.value,
                      due: newSupply.quantity * e.target.value - (newSupply.paid || 0),
                    })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Paid"
                  value={newSupply.paid}
                  onChange={(e) =>
                    setNewSupply({
                      ...newSupply,
                      paid: e.target.value,
                      due: newSupply.total - e.target.value,
                    })
                  }
                />
                <input type="number" placeholder="Due" value={newSupply.due} readOnly />
              </div>
              <div className="popup-buttons">
                <button type="submit" className="btn-add-supply">
                  Add Supply
                </button>
                <button type="button" className="btn-cancel" onClick={() => setSupplyPopup(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersManagement;
