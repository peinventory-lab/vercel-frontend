// src/pages/ApprovePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

const ApprovePage = () => {
  const [requests, setRequests] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/requests`);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await axios.put(`${API_BASE}/api/requests/${newStatus.toLowerCase()}/${id}`);
      setMessage(`Request ${newStatus.toLowerCase()} successfully.`);
      fetchRequests();
    } catch (err) {
      console.error('Failed to update request:', err);
      setMessage('Something went wrong.');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Item Name', 'Quantity', 'Note', 'Requested By', 'Status'];
    const rows = requests.map(r => [
      r.itemName || r.itemId?.name || 'Unknown',
      r.quantity,
      r.note || '',
      r.requestedBy,
      r.status
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'requests_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <h2>✅ Review Item Requests</h2>

      <div style={styles.summary}>
        <p>📊 <strong>Request Summary</strong></p>

        <table style={styles.summaryTable}>
          <tbody>
            <tr>
              <td><strong>Total</strong></td>
              <td>{requests.length}</td>
              <td><strong>Approved</strong></td>
              <td>{requests.filter(r => r.status?.toLowerCase() === 'approved').length}</td>
            </tr>
            <tr>
              <td><strong>Pending</strong></td>
              <td>{requests.filter(r => r.status?.toLowerCase() === 'pending').length}</td>
              <td><strong>Rejected</strong></td>
              <td>{requests.filter(r => r.status?.toLowerCase() === 'rejected').length}</td>
            </tr>
          </tbody>
        </table>

        <button onClick={exportCSV} style={styles.exportBtn}>📥 Export as CSV</button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Note</th>
              <th>Requested By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const isPending = req.status?.toLowerCase() === 'pending';
              const isRecent = index < 5;
              return (
                <tr key={req._id} style={isRecent ? styles.recentRow : {}}>
                  <td>{req.itemName || req.itemId?.name || 'Unknown'}</td>
                  <td>{req.quantity}</td>
                  <td>{req.note || '—'}</td>
                  <td>{req.requestedBy}</td>
                  <td>
                    <span style={{
                      fontWeight: 'bold',
                      color:
                        req.status?.toLowerCase() === 'approved'
                          ? 'green'
                          : req.status?.toLowerCase() === 'rejected'
                          ? 'red'
                          : '#888'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {isPending ? (
                      <>
                        <button
                          style={{ ...styles.btn, backgroundColor: '#28a745' }}
                          onClick={() => updateStatus(req._id, 'Approved')}
                          disabled={updatingId === req._id}
                        >
                          Approve
                        </button>
                        <button
                          style={{ ...styles.btn, backgroundColor: '#dc3545' }}
                          onClick={() => updateStatus(req._id, 'Rejected')}
                          disabled={updatingId === req._id}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <em>—</em>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    minHeight: '100vh',
    color: 'white'
  },
  message: {
    backgroundColor: '#e0f7e9',
    padding: '10px',
    borderRadius: '5px',
    color: '#155724',
    fontWeight: 'bold',
    marginBottom: '10px',
    border: '1px solid #c3e6cb'
  },
  summary: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '15px',
    margin: '20px 0',
    borderRadius: '8px',
    boxShadow: '0 0 6px rgba(0,0,0,0.08)',
    fontSize: '16px',
    fontWeight: '500'
  },
  summaryTable: {
    width: '100%',
    marginTop: '10px',
    borderCollapse: 'collapse',
    fontSize: '16px'
  },
  exportBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  btn: {
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    marginRight: '5px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  recentRow: {
    backgroundColor: '#fffbe6'
  }
};

export default ApprovePage;