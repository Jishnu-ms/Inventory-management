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
  const [searchQuery, setSearchQuery] = useState("");

  // single state for both adding and editing
  const [currentStaff, setCurrentStaff] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    role: "",
  });

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

  // Add or Update Staff
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentStaff.name || !currentStaff.email || !currentStaff.role) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      if (currentStaff.id) {
        // Update existing staff
        await updateDoc(doc(db, "staff", currentStaff.id), {
          name: currentStaff.name,
          email: currentStaff.email,
          phone: currentStaff.phone,
          role: currentStaff.role,
        });
        alert("✅ Staff updated successfully!");
      } else {
        // Add new staff
        await addDoc(collection(db, "staff"), {
          ...currentStaff,
          joinedAt: serverTimestamp(),
        });
        alert("✅ Staff added successfully!");
      }

      // Reset form
      setCurrentStaff({ id: null, name: "", email: "", phone: "", role: "" });
      fetchStaffs();
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("❌ Failed to save staff.");
    }
  };

  // Edit staff (populate form)
  const handleEdit = (staff) => {
    setCurrentStaff({
      id: staff.id,
      name: staff.name || "",
      email: staff.email || "",
      phone: staff.phone || "",
      role: staff.role || "",
    });
  };

  // Delete staff
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await deleteDoc(doc(db, "staff", id));
      fetchStaffs();
    } catch (error) {
      console.error("Error deleting staff:", error);
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

      {/* Add / Edit Staff Form */}
      <form onSubmit={handleSubmit} className="staff-form">
         <label>Name & Email</label>
        <div className="form-row">
          <input
            type="text"
            placeholder="Name"
            value={currentStaff.name}
            onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={currentStaff.email}
            onChange={(e) => setCurrentStaff({ ...currentStaff, email: e.target.value })}
            required
          />
        </div>

         <label>Phone Number & Role</label>
        <div className="form-row">
          <input
            type="text"
            placeholder="Phone"
            value={currentStaff.phone}
            onChange={(e) => setCurrentStaff({ ...currentStaff, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            value={currentStaff.role}
            onChange={(e) => setCurrentStaff({ ...currentStaff, role: e.target.value })}
            required
          />
        </div>

        <button type="submit">
          {currentStaff.id ? "Update Staff" : "Add Staff"}
        </button>
        {currentStaff.id && (
          <button
            type="button"
            onClick={() => setCurrentStaff({ id: null, name: "", email: "", phone: "", role: "" })}
          >
            Cancel
          </button>
        )}
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
                    {s.joinedAt?.toDate ? s.joinedAt.toDate().toLocaleDateString() : "-"}
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
    </div>
  );
};

export default StaffManagement;
