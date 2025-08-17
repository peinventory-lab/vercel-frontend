// src/pages/DashboardInventory.js
import React from 'react';
import InventoryPage from './InventoryPage';

const DashboardInventory = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {user?.username}!</h2>
      <p>Role: {user?.role}</p>
      <hr />
      <InventoryPage />
    </div>
  );
};

export default DashboardInventory;