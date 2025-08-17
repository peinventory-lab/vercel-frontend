// src/pages/RequestItemsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

const RequestItemsPage = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [requestHistory, setRequestHistory] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/inventory`);
        setInventory(res.data || []);
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
    };
    fetchInventory();
  }, []);

  const fetchRequestHistory = async () => {
    try {
      if (!user?.username) return;
      const res = await axios.get(`${API_BASE}/api/requests/user/${user.username}`);
      setRequestHistory(res.data || []);
    } catch (err) {
      console.error('Error fetching request history:', err);
    }
  };

  useEffect(() => {
    fetchRequestHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRequest = () => {
    if (!selectedItem || quantity < 1) return;
    const item = inventory.find(i => i._id === selectedItem);
    if (!item) return;
    setRequests(prev => [...prev, { itemId: selectedItem, name: item.name, quantity }]);
    setQuantity(1);
    setSelectedItem('');
  };

  const submitRequests = async () => {
    try {
      if (!user?.username || requests.length === 0) return;
      await axios.post(`${API_BASE}/api/requests`, {
        requests: requests.map(({ itemId, quantity }) => ({ itemId, quantity })),
        requestedBy: user.username,
      });
      setMessage('✅ Request submitted successfully!');
      setRequests([]);
      fetchRequestHistory();
    } catch (err) {
      console.error('Error submitting request:', err);
      setMessage('❌ Failed to submit request.');
    }
  };

  const groupedHistory = requestHistory.reduce((acc, req) => {
    const key = req.itemId?.name || 'Unknown';
    if (!acc[key]) acc[key] = { quantity: 0, status: req.status, date: req.requestedAt };
    acc[key].quantity += req.quantity;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
          📚 Request Inventory Items
        </h1>

        {/* Request Form */}
        <div className="bg-blue-950/60 text-white rounded-lg shadow-lg p-6 mb-6 border border-blue-900">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedItem}
              onChange={e => setSelectedItem(e.target.value)}
              className="p-2 border rounded w-full md:w-1/2 bg-blue-900 text-white"
            >
              <option value="">Select Item</option>
              {inventory.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name} (Available: {item.quantity ?? 0})
                </option>
              ))}
            </select>

            <input
              type="number"
              value={quantity}
              min="1"
              onChange={e => setQuantity(Number(e.target.value))}
              className="p-2 border rounded w-full md:w-1/4 text-black"
            />

            <button
              onClick={addRequest}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full md:w-auto"
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Items to Request */}
        {requests.length > 0 && (
          <div className="bg-blue-950/60 text-white rounded-lg shadow-lg p-6 mb-6 border border-blue-900">
            <h2 className="text-xl font-semibold mb-3">📝 Items to Request:</h2>
            <ul className="list-disc pl-6 space-y-1">
              {requests.map((r, idx) => (
                <li key={idx}>
                  {r.name} — Quantity: {r.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={submitRequests}
          disabled={requests.length === 0}
          className={`px-6 py-2 rounded transition duration-300 ${
            requests.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Submit Request
        </button>

        {message && <p className="mt-4 text-yellow-200 font-medium">{message}</p>}

        {/* Past Request History */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">📜 Past Requests</h2>
          {Object.keys(groupedHistory).length === 0 ? (
            <p className="text-white">No past requests found.</p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(groupedHistory).map(([name, details], index) => (
                <li
                  key={index}
                  className="bg-blue-900/90 text-white rounded shadow p-4 border border-blue-900"
                >
                  <p><strong>🗞️ Item:</strong> {name}</p>
                  <p><strong>🔢 Quantity:</strong> {details.quantity}</p>
                  <p><strong>⏳ Status:</strong> {details.status}</p>
                  <p><strong>📅 Date:</strong> {new Date(details.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestItemsPage;