import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import "./StaffManagement.css";

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", phone: "", role: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [editStaff, setEditStaff] = useState(null); // staff object being edited

  // Fetch staff list
  const fetchStaffs = async () => {
    try {
      const staffCollection = collection(db, "staff");
      const staffSnapshot = await getDocs(staffCollection);
      setStaffs(staffSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // Add new staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      await addDoc(collection(db, "staff"), {
        ...newStaff,
        joinedAt: serverTimestamp(),
      });
      alert("Staff added successfully!");
      setNewStaff({ name: "", email: "", phone: "", role: "" });
      fetchStaffs();
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  // Delete staff
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await deleteDoc(doc(db, "staff", id));
        fetchStaffs();
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  // Start edit
  const handleEdit = (staff) => {
    setEditStaff(staff);
  };

  // Update staff
  const handleUpdate = async () => {
    if (!editStaff.name || !editStaff.email || !editStaff.role) {
      alert("Please fill all required fields!");
      return;
    }
    try {
      await updateDoc(doc(db, "staff", editStaff.id), {
        name: editStaff.name,
        email: editStaff.email,
        phone: editStaff.phone,
        role: editStaff.role,
      });
      setEditStaff(null);
      fetchStaffs();
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // Filter staff based on search query
  const filteredStaffs = staffs.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone && s.phone.includes(searchQuery)) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="staff-container">
      <h2 className="dashboard-title">👥 Staff Management</h2>

      {/* Add Staff Form */}
      <form onSubmit={handleAddStaff} className="staff-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newStaff.email}
            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Phone"
            value={newStaff.phone}
            onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            value={newStaff.role}
            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add Staff</button>
      </form>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, email, phone, or role..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="staff-search"
      />

      {/* Staff List */}
     
      {filteredStaffs.length === 0 ? (
        <p className="no-records">No staff found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined At</th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone || "-"}</td>
                  <td>{s.role}</td>
                  <td>
                    {s.joinedAt?.toDate
                      ? s.joinedAt.toDate().toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn-remove" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Staff Popup */}
      {editStaff && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h3>Edit Staff</h3>
            <div className="edit-item-row">
              <label>Name:</label>
              <input
                type="text"
                value={editStaff.name}
                onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })}
              />
            </div>
            <div className="edit-item-row">
              <label>Email:</label>
              <input
                type="email"
                value={editStaff.email}
                onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
              />
            </div>
            <div className="edit-item-row">
              <label>Phone:</label>
              <input
                type="text"
                value={editStaff.phone}
                onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })}
              />
            </div>
            <div className="edit-item-row">
              <label>Role:</label>
              <input
                type="text"
                value={editStaff.role}
                onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
              />
            </div>
            <div className="edit-popup-buttons">
              <button className="btn-update" onClick={handleUpdate}>Update</button>
              <button className="btn-cancel" onClick={() => setEditStaff(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
