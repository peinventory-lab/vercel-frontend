// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (password.length < 8) {
      setStatus({ type: 'err', msg: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirm) {
      setStatus({ type: 'err', msg: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      // Backend route: POST /api/auth/reset-password/:token  { password }
      await axios.post(`${API_BASE}/api/auth/reset-password/${token}`, { password });

      setStatus({ type: 'ok', msg: 'Password updated successfully. Redirecting…' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Invalid or expired link. Please request a new reset email.';
      setStatus({ type: 'err', msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrap}>
      <h2 style={{ marginBottom: 12 }}>Set a New Password</h2>

      <form onSubmit={submit} style={form}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          style={input}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          style={input}
        />
        <button type="submit" style={btn} disabled={loading}>
          {loading ? 'Saving…' : 'Update password'}
        </button>
      </form>

      {status.msg && (
        <p style={{ color: status.type === 'ok' ? '#2e7d32' : '#ffcdc9', marginTop: 12 }}>
          {status.msg}
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        <Link to="/" style={{ color: '#cfe8ff', textDecoration: 'underline' }}>
          Back to login
        </Link>
      </div>
    </div>
  );
}

const wrap = {
  minHeight: '100vh',
  padding: 24,
  maxWidth: 420,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: '#fff',
  background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
  fontFamily: 'Arial, sans-serif',
};

const form = { display: 'flex', gap: 10, flexDirection: 'column' };

const input = {
  padding: 12,
  borderRadius: 8,
  border: '1px solid #ccc',
  color: '#000',
  background: '#fff',
};

const btn = {
  padding: 12,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  background: '#007bff',
  color: '#fff',
  fontWeight: 'bold',
};