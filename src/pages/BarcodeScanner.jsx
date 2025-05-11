import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';

const BarcodeScanner = ({ products, addToBill }) => {
  const [scannedCode, setScannedCode] = useState('');

  // This function will be triggered when the barcode is scanned
  const handleScan = (data) => {
    setScannedCode(data);
    const product = products.find((p) => p.barcode === data);  // Find product by barcode
    if (product) {
      const index = products.indexOf(product);  // Find the index of the product
      addToBill(index);  // Add to bill
    } else {
      alert('Product not found!');  // Show alert if product is not found
    }
  };

  return (
    <div>
      <h4>Scan Barcode:</h4>
      <BarcodeReader onScan={handleScan} />  {/* Barcode scanning input */}
      <p>Scanned Code: {scannedCode}</p>  {/* Display scanned code */}
    </div>
  );
};

export default BarcodeScanner;

