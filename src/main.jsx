import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/dark-theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{ overflowX: 'hidden' }}>
    <App />
    </div>
  </React.StrictMode>
);
