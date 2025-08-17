// src/pages/director/DirectorInventoryView.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ Use env var in prod, fallback to localhost for dev
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

const up = (v) => (v ?? '').toString().trim().toUpperCase();

const DirectorInventoryView = () => {
  const [items, setItems] = useState([]);
  const [filteredRack, setFilteredRack] = useState('');
  const [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/inventory/all`);
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const groupByRack = (itemsList) => {
    const grouped = {};
    itemsList.forEach((item) => {
      const rackKey = up(item.location) || 'UNKNOWN RACK';
      if (!grouped[rackKey]) grouped[rackKey] = [];
      grouped[rackKey].push(item);
    });
    return grouped;
  };

  useEffect(() => {
    const filteredItems = filteredRack
      ? items.filter((item) => up(item.location) === filteredRack)
      : items;
    setGroupedItems(groupByRack(filteredItems));
  }, [items, filteredRack]);

  const downloadCSV = () => {
    const headers = ['Item Name', 'Description', 'Location', 'Count'];
    const rows = items.map((item) => [
      item.name,
      item.description || '',
      item.location,
      item.quantity,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((row) => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inventory_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Build unique, normalized, naturally sorted rack list
  const allRackOptions = Array.from(new Set(items.map((i) => up(i.location))))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const sortedRackKeys = Object.keys(groupedItems).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.heading}>📦 Inventory Summary by Rack</h2>
        <div>
          <label style={styles.label}>Filter by Rack: </label>
          <select
            style={styles.select}
            value={filteredRack}
            onChange={(e) => setFilteredRack(e.target.value)}
          >
            <option value="">All</option>
            {allRackOptions.map((rack) => (
              <option key={rack} value={rack}>
                {rack}
              </option>
            ))}
          </select>
          <button onClick={downloadCSV} style={styles.downloadBtn}>
            ⬇️ Download CSV
          </button>
        </div>
      </div>

      {sortedRackKeys.map((rack) => (
        <div key={rack} style={styles.rackSection}>
          <h3 style={styles.rackTitle}>📍 Rack {rack} ({groupedItems[rack].length} items)</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.leftAlign}>Item Name</th>
                <th style={styles.leftAlign}>Description</th>
                <th style={styles.leftAlign}>Location</th>
                <th style={styles.leftAlign}>Count</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems[rack].map((item) => (
                <tr key={item._id} style={styles.rowBorder}>
                  <td>{item.name}</td>
                  <td>{item.description || '—'}</td>
                  <td>{item.location}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {sortedRackKeys.length === 0 && (
        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          No inventory found.
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to right, #e0f7fa, #fdfdfd)',
    minHeight: '100vh',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: { margin: 0 },
  label: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  select: {
    padding: '5px',
    marginRight: '10px',
  },
  downloadBtn: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  rackSection: {
    marginBottom: '40px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 0 8px rgba(0,0,0,0.08)',
  },
  rackTitle: {
    marginBottom: '10px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  rowBorder: {
    borderBottom: '1px solid #ddd',
  },
  leftAlign: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '2px solid #ccc',
    backgroundColor: '#f9f9f9',
  },
};

export default DirectorInventoryView;