import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Updated role checks
  const canViewInventory = ['director', 'inventorymanager', 'stembassador'].includes(role);
  const canRequestItems = ['stembassador'].includes(role);
  const canApproveRequests = ['director'].includes(role);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {user?.username || 'User'}!</h2>
        <p>Role: {role}</p>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.sections}>
        {canViewInventory && (
          <div style={styles.card}>
            <h3>📦 View Inventory</h3>
            <p>Browse and manage items in stock.</p>
            <button style={styles.cardBtn} onClick={() => navigate('/inventory')}>Go</button>
          </div>
        )}

        {canRequestItems && (
          <div style={styles.card}>
            <h3>📝 Request Items</h3>
            <p>Request items for events or programs.</p>
            <button style={styles.cardBtn} onClick={() => navigate('/request')}>Go</button>
          </div>
        )}

        {canApproveRequests && (
          <div style={styles.card}>
            <h3>✅ Approve Requests</h3>
            <p>Review and manage item requests.</p>
            <button style={styles.cardBtn} onClick={() => navigate('/approve')}>Go</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    background: 'linear-gradient(to right, #d4fc79, #96e6a1)',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    marginBottom: '30px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)'
  },
  logoutBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer'
  },
  sections: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  card: {
    flex: '1 1 30%',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
    minWidth: '250px'
  },
  cardBtn: {
    marginTop: '10px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default Dashboard;