import React from 'react';
import { useNavigate } from 'react-router-dom';

const DirectorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* PE Logo */}
      <div style={styles.logoWrapper}>
        <img src="/pe-logo.jpeg" alt="Project Exploration Logo" style={styles.logo} />
      </div>

      <div style={styles.header}>
        <div>
          <h2 style={styles.welcome}>Welcome, {user?.username}!</h2>
          <p style={styles.role}>Role: {user?.role}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.sections}>
        {/* Only inventory card remains */}
        <div style={styles.card}>
          <h3>📦 View Inventory Summary</h3>
          <p>Check stock status across all categories.</p>
          <button
            style={styles.cardBtn}
            onClick={() => navigate('/director/inventory')}
          >
            Go
          </button>
        </div>

        {/* 👇 This is the card to remove */}
        <div style={styles.card}>
          <h3>✅ Review Requests</h3>
          <p>Approve or reject item requests from STEMbassadors.</p>
          <button style={styles.cardBtn} onClick={() => navigate('/approve')}>Go</button>
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
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  logo: {
    width: '100px',
    borderRadius: '12px'
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
    minWidth: '280px'
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

export default DirectorDashboard;
