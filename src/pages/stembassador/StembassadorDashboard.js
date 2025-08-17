import React from 'react';
import { useNavigate } from 'react-router-dom';

const StembassadorDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* PE Logo */}
      <div style={styles.logoContainer}>
        <img src="/pe-logo.jpeg" alt="PE Logo" style={styles.logo} />
      </div>

      {/* Header Card */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.welcome}>Welcome, {user?.username || 'STEMbassador'}!</h2>
          <p style={styles.role}>Role: {user?.role}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Action Cards */}
      <div style={styles.sections}>
        <div style={styles.card}>
          <h3>📦 View Inventory</h3>
          <p>Browse and manage items in stock.</p>
          <button onClick={() => navigate('/inventory')} style={styles.cardBtn}>Go</button>
        </div>

        <div style={styles.card}>
          <h3>📝 Request Items</h3>
          <p>Request items for events or programs.</p>
          <button onClick={() => navigate('/request-items')} style={styles.cardBtn}>Go</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    fontFamily: 'Arial, sans-serif',
    color: '#fff'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  logo: {
    height: '90px',
    width: '90px',
    borderRadius: '8px',
    objectFit: 'contain'
  },
  header: {
    marginBottom: '40px',
    backgroundColor: '#ffffff',
    color: '#333',
    padding: '20px 30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  welcome: {
    margin: '0 0 5px 0',
    fontSize: '24px'
  },
  role: {
    margin: 0,
    fontSize: '14px',
    color: '#666'
  },
  logoutBtn: {
    padding: '10px 18px',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  sections: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  card: {
    flex: '1 1 300px',
    backgroundColor: '#ffffff',
    color: '#333',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
    minWidth: '280px',
    textAlign: 'center'
  },
  cardBtn: {
    marginTop: '12px',
    padding: '10px 14px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default StembassadorDashboard;