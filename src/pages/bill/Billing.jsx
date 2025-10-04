import React, { useState, useEffect } from 'react';
import './Billing.css';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [billedItems, setBilledItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [loading, setLoading] = useState(true);
  const [oldBills, setOldBills] = useState([]);
  const [billSearch, setBillSearch] = useState('');
  const [expandedBillId, setExpandedBillId] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [billId] = useState(() => 'INV' + Date.now());
  const [billDate] = useState(() => new Date().toLocaleString());

  // Helper to get stock status
  const getStockStatus = (qty) => {
    if (qty > 5) return 'in-stock';
    if (qty > 0) return 'low-stock';
    return 'out-of-stock';
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      setProducts(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'customers'));
      setCustomers(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCustomers()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Add to bill
  const addToBill = async (productId) => {
    const prodIndex = products.findIndex(p => p.id === productId);
    if (prodIndex === -1) return;

    const product = products[prodIndex];
    if (product.quantity <= 0) return alert('Out of stock!');

    const existingIndex = billedItems.findIndex(item => item.id === productId);

    try {
      await updateDoc(doc(db, 'products', productId), { quantity: product.quantity - 1 });
      const updatedProducts = [...products];
      updatedProducts[prodIndex].quantity -= 1;
      setProducts(updatedProducts);

      if (existingIndex !== -1) {
        const updatedBill = [...billedItems];
        updatedBill[existingIndex].count += 1;
        setBilledItems(updatedBill);
      } else {
        setBilledItems([...billedItems, { ...product, count: 1, unitPrice: product.price }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Remove from bill
  const removeFromBill = async (index) => {
    const item = billedItems[index];
    const prodIndex = products.findIndex(p => p.id === item.id);

    if (prodIndex !== -1) {
      try {
        await updateDoc(doc(db, 'products', item.id), { quantity: products[prodIndex].quantity + 1 });
        const updatedProducts = [...products];
        updatedProducts[prodIndex].quantity += 1;
        setProducts(updatedProducts);
      } catch (error) {
        console.error(error);
      }
    }

    const updatedBill = [...billedItems];
    if (updatedBill[index].count > 1) updatedBill[index].count -= 1;
    else updatedBill.splice(index, 1);
    setBilledItems(updatedBill);
  };

  // Totals
  const subTotal = billedItems.reduce((sum, item) => sum + item.unitPrice * item.count, 0);
  const taxRate = 0.18;
  const taxAmount = subTotal * taxRate;
  const totalAmount = subTotal + taxAmount;

  // Print/Save bill
  const handlePrint = async () => {
    if (!billedItems.length) return alert('No items to bill!');
    try {
      await addDoc(collection(db, 'bills'), {
        billId,
        date: Timestamp.now(),
        customer: selectedCustomer || 'Walk-in',
        items: billedItems.map(item => ({
          name: item.name,
          qty: item.count,
          unitPrice: item.unitPrice,
          total: item.unitPrice * item.count,
        })),
        subTotal,
        taxRate: 18,
        taxAmount,
        totalAmount,
      });

      const navbar = document.querySelector('.navbar');
      if (navbar) navbar.style.display = 'none';
      window.print();
      if (navbar) setTimeout(() => (navbar.style.display = 'block'), 1000);

      setBilledItems([]);
      setSelectedCustomer('');
      setSuccessMessage('Bill saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to save bill.');
    }
  };

  // Load old bills
  const loadOldBills = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'bills'));
      setOldBills(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOldBills = oldBills.filter(bill =>
    bill.billId.toLowerCase().includes(billSearch.toLowerCase())
  );

  // Edit bill
  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setBilledItems(
      bill.items.map(item => ({
        id: item.name,
        name: item.name,
        count: item.qty,
        unitPrice: item.unitPrice,
      }))
    );
    setSelectedCustomer(bill.customer);
    setShowEditPopup(true);
  };

  const handleUpdateBill = async () => {
    if (!editingBill) return;
    const updatedSubTotal = billedItems.reduce((sum, item) => sum + item.unitPrice * item.count, 0);
    const updatedTaxAmount = updatedSubTotal * 0.18;
    const updatedTotalAmount = updatedSubTotal + updatedTaxAmount;

    try {
      await updateDoc(doc(db, 'bills', editingBill.id), {
        items: billedItems.map(item => ({
          name: item.name,
          qty: item.count,
          unitPrice: item.unitPrice,
          total: item.unitPrice * item.count,
        })),
        customer: selectedCustomer || 'Walk-in',
        subTotal: updatedSubTotal,
        taxRate: 18,
        taxAmount: updatedTaxAmount,
        totalAmount: updatedTotalAmount,
      });
      setShowEditPopup(false);
      setEditingBill(null);
      setSuccessMessage('Bill updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadOldBills();
    } catch (error) {
      console.error(error);
      alert('Failed to update bill.');
    }
  };

  // Delete bill
  const handleDeleteBill = async (id) => {
    if (!window.confirm('Are you sure to delete this bill?')) return;
    try {
      await deleteDoc(doc(db, 'bills', id));
      setSuccessMessage('Bill deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadOldBills();
    } catch (error) {
      console.error(error);
      alert('Failed to delete bill.');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#fff' }}>Loading...</p>;

  return (
    <div className="billing-container">
      <h2 className='dashboard-title '>🧾 Billing</h2>

      {successMessage && <p className="success-msg">{successMessage}</p>}

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h3>Edit Bill</h3>
            {billedItems.map((item, idx) => (
              <div key={idx} className="edit-item-row">
                <span>{item.name}</span>
                <input
                  type="number"
                  min={1}
                  value={item.count}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    const updated = [...billedItems];
                    updated[idx].count = val;
                    setBilledItems(updated);
                  }}
                />
                <span>₹{item.unitPrice}</span>
              </div>
            ))}
            <div className="edit-popup-buttons">
              <button className="btn-update" onClick={handleUpdateBill}>Update</button>
              <button className="btn-cancel" onClick={() => setShowEditPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Selection */}
      <div className="customer-select no-print">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="search-input"
        >
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c.id} value={c.name}>{c.name} ({c.phone})</option>)}
        </select>
      </div>

      {/* Products */}
      <div className="products-section no-print">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="billing-products-grid">
          {products
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(product => (
              <div key={product.id} className="billing-item">
                <div className="billing-header">
                  <div className="product-icon">📦</div>
                  <br></br>
                  
                  <div className={`status-badge ${getStockStatus(product.quantity)}`}></div>
                </div>
                <br></br>

                <div className="billing-content">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-details">
                    <span className="product-qty">Qty: {product.quantity || 0}</span>
                    <span className="product-price">₹{Number(product.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="product-category">{product.category || "Uncategorized"}</div>
                  <div className="extra-details">
                    <p><strong>Supplier:</strong> {product.supplier || "N/A"}</p>
                    <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
                    <p><strong>Expiry:</strong> {product.expiryDate || "N/A"}</p>
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    className="add-to-bill-btn"
                    disabled={product.quantity <= 0}
                    onClick={() => addToBill(product.id)}
                  >
                    {product.quantity > 0 ? 'Add to Bill' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Current Bill */}
      {billedItems.length > 0 && (
        <div className="bill-section">
          <div className="bill-header">
            <h3>InventoBill</h3>
            <p><strong>Bill ID:</strong> {billId}</p>
            <p><strong>Date:</strong> {billDate}</p>
            {selectedCustomer && <p><strong>Customer:</strong> {selectedCustomer}</p>}
          </div>

          <table className="bill-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th className="no-print">Remove</th>
              </tr>
            </thead>
            <tbody>
              {billedItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                  <td>₹{item.unitPrice}</td>
                  <td>₹{(item.unitPrice * item.count).toFixed(2)}</td>
                  <td className="no-print">
                    <button className="btn-remove" onClick={() => removeFromBill(idx)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan="3"><strong>Subtotal</strong></td><td colSpan="2">₹{subTotal.toFixed(2)}</td></tr>
              <tr><td colSpan="3"><strong>Tax (18%)</strong></td><td colSpan="2">₹{taxAmount.toFixed(2)}</td></tr>
              <tr><td colSpan="3"><strong>Total</strong></td><td colSpan="2">₹{totalAmount.toFixed(2)}</td></tr>
            </tfoot>
          </table>

          <button className="print-btn no-print" onClick={handlePrint}>🖨️ Print & Save Bill</button>
       

        </div>
      )}

      {/* Old Bills */}
         
      <div className="old-bills-section no-print">
        
        <div>
          <button className="btn-load" onClick={loadOldBills}>Load Old Bills</button>
          <br></br>
          <input
            type="text"
            placeholder="Search by Bill ID..."
            value={billSearch}
            onChange={e => setBillSearch(e.target.value)}
            className="search-input"
          />
        </div>
        {filteredOldBills.length ? (
          <div className="table-wrapper">
          <table className="bill-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOldBills.map(bill => (
                <React.Fragment key={bill.id}>
                  <tr onClick={() => setExpandedBillId(expandedBillId === bill.id ? null : bill.id)}
                      style={{ cursor: 'pointer', background: expandedBillId === bill.id ? '#333' : 'inherit' }}>
                    <td>{bill.billId}</td>
                    <td>{bill.customer}</td>
                    <td>{new Date(bill.date.seconds * 1000).toLocaleString()}</td>
                    <td>₹{bill.totalAmount.toFixed(2)}</td>
                    <td className="no-print">
                      <button className="btn-edit" onClick={() => handleEditBill(bill)}>✏️ Edit</button>
                      <button className="btn-remove" onClick={() => handleDeleteBill(bill.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                  {expandedBillId === bill.id && (
                    <tr>
                      <td colSpan="5">
                        <table className="bill-items-table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Qty</th>
                              <th>Unit Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bill.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{item.qty}</td>
                                <td>₹{item.unitPrice}</td>
                                <td>₹{item.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          </div>
        ) : <p>No bills found.</p>}
      </div>
    </div>
  );
};

export default Billing;