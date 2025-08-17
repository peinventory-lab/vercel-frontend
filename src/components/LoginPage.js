// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5050/api/auth';

const roleRouteMap = {
  director: '/dashboard/director',
  inventory_manager: '/dashboard/inventory', // snake_case
  inventoryManager: '/dashboard/inventory',  // camelCase (if your DB has this)
  stembassador: '/dashboard/stembassador',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/login`, { username, password });

      // Persist session
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Route by role
      const role = res.data.user?.role;
      const route = roleRouteMap[role];
      if (route) {
        navigate(route, { replace: true });
      } else {
        setError('Unknown role. Contact admin.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          {/* Logo */}
          <img
            src="/pe-logo.jpeg"
            alt="Project Exploration Logo"
            style={{ width: '80px', marginBottom: '20px' }}
          />

          <h1 style={styles.title}>🔐 Project Exploration</h1>
          <p style={styles.subtitle}>Sign in to access the inventory portal</p>

          <form onSubmit={handleLogin} noValidate>
            <input
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />

            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={styles.toggleBtn}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div style={styles.linkContainer}>
              <Link to="/forgot-password" style={styles.link}>
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.signupLink}>
              <span>New here? </span>
              <Link to="/signup" style={styles.link}>
                Create an account
              </Link>
            </div>
          </form>
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
    fontFamily: 'Arial, sans-serif',
  },
  overlay: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
  card: {
    width: '360px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px 30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  title: {
    fontSize: '26px',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: '15px',
    color: '#555',
    marginBottom: '25px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  passwordWrapper: {
    position: 'relative',
  },
  toggleBtn: {
    position: 'absolute',
    top: '50%',
    right: '12px',
    transform: 'translateY(-50%)',
    fontSize: '12px',
    color: '#007bff',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: 0,
  },
  linkContainer: {
    textAlign: 'right',
    marginBottom: '10px',
  },
  link: {
    fontSize: '12px',
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
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
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    marginTop: '12px',
    fontSize: '13px',
  },
  signupLink: {
    marginTop: '15px',
    fontSize: '13px',
    color: '#333',
  },
};

export default LoginPage;