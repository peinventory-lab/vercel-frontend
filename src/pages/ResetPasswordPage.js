// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5050/api/auth';

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
      await axios.post(`${API}/reset-password`, { token, password });
      setStatus({ type: 'ok', msg: 'Password updated successfully. Redirecting…' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setStatus({
        type: 'err',
        msg: err.response?.data?.message || 'Invalid or expired link.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrap}>
      <h2>Set a New Password</h2>
      <form onSubmit={submit} style={form}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={input}
        />
        <button type="submit" style={btn} disabled={loading}>
          {loading ? 'Saving…' : 'Update password'}
        </button>
      </form>
      {status.msg && (
        <p style={{ color: status.type === 'ok' ? '#2e7d32' : '#c62828' }}>{status.msg}</p>
      )}
      <Link to="/" style={{ color: '#fff' }}>Back to login</Link>
    </div>
  );
}

const wrap = { padding: 24, maxWidth: 420, margin: '40px auto', color: '#fff' };
const form = { display: 'flex', gap: 8, flexDirection: 'column' };
const input = { padding: 12, borderRadius: 8, border: '1px solid #ccc', color: '#000' };
const btn = { padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer' };