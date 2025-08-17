import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'stembassador'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/auth/signup', formData);
      navigate('/');
    } catch (err) {
      setError('Signup failed. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          {/* 🟢 PE Logo image */}
          <img
            src="/pe-logo.jpeg"
            alt="Project Exploration Logo"
            style={{ width: '80px', marginBottom: '20px' }}
          />

          <h1 style={styles.title}>Sign Up</h1>
          <p style={styles.subtitle}>Create your account to access the system</p>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="stembassador">STEMbassador</option>
              <option value="inventoryManager">Inventory Manager</option>
              <option value="director">Director</option>
            </select>
            <button type="submit" style={styles.button}>Sign Up</button>
            {error && <p style={styles.error}>{error}</p>}
          </form>

          <p style={styles.loginLink}>
            Already have an account?{' '}
            <span onClick={() => navigate('/')} style={styles.link}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  overlay: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
  },
  card: {
    width: '360px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px 30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    textAlign: 'center'
  },
  title: {
    fontSize: '26px',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  subtitle: {
    fontSize: '15px',
    color: '#555',
    marginBottom: '25px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontSize: '13px'
  },
  loginLink: {
    marginTop: '15px',
    fontSize: '13px',
    color: '#333'
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default SignupPage;