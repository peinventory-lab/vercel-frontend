// src/pages/FulfillRequestsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

const FulfillRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/requests`);
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(`${API_BASE}/api/requests/${action}/${id}`);
      setMessage(`Request ${action}ed successfully.`);
      fetchRequests();
    } catch (err) {
      console.error(`Error trying to ${action} request:`, err);
      setMessage(`Failed to ${action} request.`);
    }
  };

  const handleExport = () => {
    const fulfilled = requests.filter(r => r.status === 'approved' || r.status === 'rejected');
    const csvContent = [
      ['Item', 'Quantity', 'Requested By', 'Status'],
      ...fulfilled.map(r => [
        r.itemName || r.itemId?.name || 'Unknown',
        r.quantity,
        r.requestedBy,
        r.status || 'pending'
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fulfilled_requests.csv';
    a.click();
  };

  const filteredRequests = requests.filter(r =>
    (r.itemName || r.itemId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.requestedBy || '').toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredRequests.length;
  const approvedCount = filteredRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = filteredRequests.filter(req => req.status === 'rejected').length;
  const pendingCount = filteredRequests.filter(req => req.status === 'pending' || !req.status).length;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📬 Fulfill Requests</h2>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search by item or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleExport} style={styles.exportBtn}>Export</button>
      </div>

      <div style={styles.summaryBox}>
        <strong>Summary:</strong><br />
        Total Requests: {total} &nbsp; | &nbsp;
        ✅ Approved: {approvedCount} &nbsp; | &nbsp;
        ❌ Rejected: {rejectedCount} &nbsp; | &nbsp;
        ⏳ Pending: {pendingCount}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((req) => (
            <tr key={req._id}>
              <td>{req.itemName || req.itemId?.name || 'Unknown'}</td>
              <td>{req.quantity}</td>
              <td>{req.requestedBy}</td>
              <td>
                {req.status === 'approved' && <span style={{ color: 'green', fontWeight: 'bold' }}>Approved</span>}
                {req.status === 'rejected' && <span style={{ color: 'red', fontWeight: 'bold' }}>Rejected</span>}
                {(req.status === 'pending' || !req.status) && <span style={{ color: 'gray' }}>Pending</span>}
              </td>
              <td>
                <button
                  onClick={() => handleAction(req._id, 'approve')}
                  style={{
                    ...styles.approveBtn,
                    opacity: req.status !== 'pending' ? 0.5 : 1
                  }}
                  disabled={req.status !== 'pending'}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req._id, 'reject')}
                  style={{
                    ...styles.rejectBtn,
                    opacity: req.status !== 'pending' ? 0.5 : 1
                  }}
                  disabled={req.status !== 'pending'}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to right, #1e3c52, #294a5e)',
    minHeight: '100vh',
    color: '#fff'
  },
  heading: {
    color: 'white',
    fontWeight: 'bold'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px 0'
  },
  searchInput: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '250px'
  },
  exportBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  message: {
    padding: '10px',
    backgroundColor: '#c8e6c9',
    color: '#1b5e20',
    border: '1px solid #a5d6a7',
    borderRadius: '5px',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  summaryBox: {
    background: '#bbdefb',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#0d47a1'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '0 0 8px rgba(0,0,0,0.2)'
  },
  approveBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default FulfillRequestsPage;