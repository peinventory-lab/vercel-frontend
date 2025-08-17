// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ✅ Use env var in prod, fallback to localhost in dev
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';
const AUTH_API = `${API_BASE}/api/auth`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { ok: boolean, msg: string }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await axios.post(`${AUTH_API}/forgot-password`, { email });
      setStatus({
        ok: true,
        msg: 'If that email exists, a reset link has been sent. (In development, check your server console for the preview URL.)',
      });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ ok: false, msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Forgot Password</h2>
        <p style={{ color: '#555' }}>
          Enter the email associated with your account. We’ll send a password reset link if it exists.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        {status && (
          <p style={{ color: status.ok ? 'green' : 'red', marginTop: '1rem' }}>
            {status.msg}
          </p>
        )}

        <p style={{ marginTop: '1rem' }}>
          <Link to="/" style={styles.link}>Back to login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    width: 360,
    background: '#fff',
    borderRadius: 12,
    padding: '24px 20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0 14px',
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 14,
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 15,
    cursor: 'pointer',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default ForgotPasswordPage;