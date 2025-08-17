// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AUTH_API = 'http://localhost:5050/api/auth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      await axios.post(`${AUTH_API}/forgot-password`, { email });
      setStatus({ ok: true, msg: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ ok: false, msg });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '300px', padding: '8px', marginBottom: '1rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Send reset link
        </button>
      </form>

      {status && (
        <p style={{ color: status.ok ? 'green' : 'red', marginTop: '1rem' }}>
          {status.msg}
        </p>
      )}

      <p style={{ marginTop: '1rem' }}>
        <Link to="/">Back to login</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;