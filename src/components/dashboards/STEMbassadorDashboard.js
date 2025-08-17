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
      {/* Header Card */}
      <div style={styles.headerCard}>
        <div>
          <h2>Welcome, {user?.username}!</h2>
          <p>Role: <strong>{user?.role}</strong></p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      {/* Main Cards */}
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>📦 View Inventory</h3>
          <p>Browse and manage items in stock.</p>
          <button onClick={() => navigate('/inventory')} style={styles.goButton}>Go</button>
        </div>

        <div style={styles.card}>
          <h3>📝 Request Items</h3>
          <p>Request items for events or programs.</p>
          <button onClick={() => navigate('/request-items')} style={styles.goButton}>Go</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    color: '#000'
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: '20px 30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cardContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    flex: '1',
    minWidth: '280px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  goButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default StembassadorDashboard;