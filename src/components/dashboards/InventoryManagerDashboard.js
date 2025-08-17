import React from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '30px', background: 'linear-gradient(to right, #e0ffef, #f0fff8)', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>Welcome, {user.username}!</h2>
        <p>Role: {user.role}</p>
        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h3>📦 View Inventory</h3>
          <p>Browse and manage items.</p>
          <button onClick={() => navigate('/inventory')} style={buttonStyle}>Go</button>
        </div>
        <div style={cardStyle}>
          <h3>📥 Fulfill Requests</h3>
          <p>Approve or deny STEMbassador requests.</p>
          <button onClick={() => navigate('/request')} style={buttonStyle}>Go</button>
          
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  flex: '1 1 300px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginTop: '10px'
};

export default InventoryDashboard;