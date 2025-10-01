import React, { useState, useEffect } from 'react';
import './Billing.css';
import { collection, getDocs, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [billedItems, setBilledItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [loading, setLoading] = useState(true);
  const [oldBills, setOldBills] = useState([]);
  const [billSearch, setBillSearch] = useState('');
  const [expandedBillId, setExpandedBillId] = useState(null); // track which bill is expanded

  // Bill ID and Date
  const [billId] = useState(() => 'INV' + Date.now());
  const [billDate] = useState(() => new Date().toLocaleString());

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setProducts(items);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'customers'));
      const customerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerList);
    } catch (error) {
      console.error('Error fetching customers:', error);
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

  const addToBill = async (productId) => {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;

    const product = products[productIndex];
    if (product.quantity <= 0) {
      alert('Out of stock!');
      return;
    }

    const existingIndex = billedItems.findIndex(item => item.id === productId);

    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { quantity: product.quantity - 1 });
      const updatedProducts = [...products];
      updatedProducts[productIndex].quantity -= 1;
      setProducts(updatedProducts);

      if (existingIndex !== -1) {
        const updatedBill = [...billedItems];
        updatedBill[existingIndex].count += 1;
        setBilledItems(updatedBill);
      } else {
        setBilledItems([...billedItems, { ...product, count: 1 }]);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromBill = async (indexToRemove) => {
    const item = billedItems[indexToRemove];
    const productIndex = products.findIndex(p => p.id === item.id);

    if (productIndex !== -1) {
      try {
        const productRef = doc(db, 'products', item.id);
        await updateDoc(productRef, { quantity: products[productIndex].quantity + 1 });
        const updatedProducts = [...products];
        updatedProducts[productIndex].quantity += 1;
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }

    const updated = [...billedItems];
    if (updated[indexToRemove].count > 1) {
      updated[indexToRemove].count -= 1;
    } else {
      updated.splice(indexToRemove, 1);
    }
    setBilledItems(updated);
  };

  const handlePrint = async () => {
    if (billedItems.length === 0) return alert("No items to bill!");

    try {
      await addDoc(collection(db, "bills"), {
        billId,
        date: Timestamp.now(),
        customer: selectedCustomer || "Walk-in",
        items: billedItems.map(item => ({
          name: item.name,
          qty: item.count,
          unitPrice: item.price,
          total: item.price * item.count
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
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save bill. Try again.");
    }
  };

  const loadOldBills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'bills'));
      const bills = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setOldBills(bills);
    } catch (error) {
      console.error('Error fetching old bills:', error);
    }
  };

  const filteredOldBills = oldBills.filter(bill =>
    bill.billId.toLowerCase().includes(billSearch.toLowerCase())
  );

  const subTotal = billedItems.reduce((sum, item) => sum + item.price * item.count, 0);
  const taxRate = 0.18;
  const taxAmount = subTotal * taxRate;
  const totalAmount = subTotal + taxAmount;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="billing-container">
      <h2>🧾 Billing</h2>

      {/* Customer Selection */}
      <div className="customer-select no-print">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="search-input"
        >
          <option value="">Select Customer</option>
          {customers.map(cust => (
            <option key={cust.id} value={cust.name}>{cust.name} ({cust.phone})</option>
          ))}
        </select>
      </div>

      {/* Products Section */}
      <div className="products-section no-print">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="products-container">
          {filteredProducts.length === 0 ? (
            <p>No matching products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-row">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>Category: {product.category || 'N/A'}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ₹{product.price}</p>
                </div>
                <button
                  onClick={() => addToBill(product.id)}
                  disabled={product.quantity <= 0}
                >
                  {product.quantity > 0 ? '➕ Add to Bill' : '❌ Out of Stock'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Current Bill Section */}
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
              {billedItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.count}</td>
                  <td className="no-print">
                    <button onClick={() => removeFromBill(index)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Subtotal</strong></td>
                <td colSpan="2">₹{subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Tax (18%)</strong></td>
                <td colSpan="2">₹{taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Total</strong></td>
                <td colSpan="2">₹{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <button onClick={handlePrint} className="print-btn no-print">
            🖨️ Print & Save Bill
          </button>
        </div>
      )}

      {/* Old Bills Section */}
      <div className="old-bills-section no-print">
        <h3>Load Old Bills</h3>
        <div className='sep'>

        </div>
        <div>
          <button onClick={loadOldBills}>Load Bills</button>
            <div className='sep'>
          
        </div>
          <input
            type="text"
            placeholder="Search by Bill ID..."
            value={billSearch}
            onChange={(e) => setBillSearch(e.target.value)}
            className="search-input"
            style={{ marginLeft: '10px' }}
          />
        </div>

        {filteredOldBills.length > 0 ? (
          <table className="bill-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOldBills.map(bill => (
                <React.Fragment key={bill.id}>
                  <tr
                    onClick={() =>
                      setExpandedBillId(expandedBillId === bill.id ? null : bill.id)
                    }
                    style={{ cursor: 'pointer', background: expandedBillId === bill.id ? '#333' : 'inherit' }}
                  >
                    <td>{bill.billId}</td>
                    <td>{bill.customer}</td>
                    <td>{new Date(bill.date.seconds * 1000).toLocaleString()}</td>
                    <td>₹{bill.totalAmount.toFixed(2)}</td>
                  </tr>

                  {expandedBillId === bill.id && (
                    <tr>
                      <td colSpan="4">
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
        ) : (
          <p>No bills found.</p>
        )}
      </div>
    </div>
  );
};

export default Billing;
