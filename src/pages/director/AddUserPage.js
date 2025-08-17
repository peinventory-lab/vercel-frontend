import React, { useState } from 'react';
import axios from 'axios';

const AddUserPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    role: 'stembassador' // default role
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/auth/signup', userData);
      setMessage('✅ User added successfully!');
      setUserData({ username: '', password: '', role: 'stembassador' });
    } catch (error) {
      setMessage('❌ Failed to add user. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>➕ Add New User</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
            style={styles.input}
          />
          <select
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            style={styles.input}
          >
            <option value="director">Director</option>
            <option value="inventoryManager">Inventory Manager</option>
            <option value="stembassador">STEMbassador</option>
          </select>
          <button type="submit" style={styles.button}>Add User</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(to right, #d4fc79, #96e6a1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial'
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    width: '350px',
    textAlign: 'center'
  },
  title: {
    marginBottom: '20px',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  message: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#155724',
    fontWeight: 'bold'
  }
};

export default AddUserPage;