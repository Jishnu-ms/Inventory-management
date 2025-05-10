import React, { useState, useRef } from 'react';

const Billing = ({ products }) => {
  const [cart, setCart] = useState([]);
  const billRef = useRef();

  const addToCart = (product) => {
    const exists = cart.find(item => item.name === product.name);
    if (exists) {
      setCart(cart.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter(item => item.name !== productName));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePrint = () => {
    const printContent = billRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .bill-item { margin-bottom: 10px; }
            .total { font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Billing</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {products.map((product, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h4 className="font-semibold">{product.name}</h4>
            <p>Price: ₹{product.price}</p>
            <p>In Stock: {product.quantity}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
            >
              Add to Bill
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div>
          <div ref={billRef} className="border rounded p-4 bg-white shadow mb-4">
            <h3 className="text-xl font-medium mb-2">Bill Summary:</h3>
            {cart.map((item, index) => (
              <div key={index} className="bill-item flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="total text-lg">
              Total: ₹{getTotal().toFixed(2)}
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print Bill
          </button>
        </div>
      )}
    </div>
  );
};

export default Billing;
