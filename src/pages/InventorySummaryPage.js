// src/pages/InventorySummaryPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';
const norm = (v) => (v ?? '').toString().trim().toUpperCase();

const InventorySummaryPage = () => {
  const [items, setItems] = useState([]);
  const [filteredRack, setFilteredRack] = useState('');
  const [groupedItems, setGroupedItems] = useState({});

  // Define all racks (A1–I4)
  const allRacks = [
    'A1','A2','A3',
    'B1','B2','B3',
    'C1','C2','C3',
    'D1','D2','D3',
    'E1','E2','E3',
    'F1','F2','F3',
    'G1','G2','G3',
    'H1','H2','H3',
    'I1','I2','I3','I4'
  ];

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
    // initialize all known racks with empty arrays
    allRacks.forEach(rack => { grouped[rack] = []; });
    // keep a bucket for unknown/misc locations
    grouped['Unknown'] = [];

    itemsList.forEach((item) => {
      const loc = norm(item.location);
      if (grouped[loc]) {
        grouped[loc].push(item);
      } else {
        grouped['Unknown'].push(item);
      }
    });

    return grouped;
  };

  useEffect(() => {
    const filteredItems = filteredRack
      ? items.filter((item) => norm(item.location) === filteredRack)
      : items;

    setGroupedItems(groupByRack(filteredItems));
  }, [items, filteredRack]);

  const downloadCSV = () => {
    const headers = ['Item', 'Description', 'Location', 'Quantity'];
    const rows = items.map((item) => [
      item.name,
      item.description || '',
      item.location || '',
      item.quantity ?? ''
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

  // order: all racks in defined order, then Unknown at the end if present
  const racksToRender = [
    ...allRacks,
    ...(groupedItems['Unknown'] && groupedItems['Unknown'].length > 0 ? ['Unknown'] : [])
  ];

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
            {allRacks.map((rack) => (
              <option key={rack} value={rack}>{rack}</option>
            ))}
            <option value="Unknown">Unknown</option>
          </select>
          <button onClick={downloadCSV} style={styles.downloadBtn}>
            ⬇️ Download CSV
          </button>
        </div>
      </div>

      {racksToRender.map((rack) => (
        <div key={rack} style={styles.rackSection}>
          <h3 style={styles.rackTitle}>
            📍 Rack {rack} ({(groupedItems[rack] || []).length} items)
          </h3>
          {(groupedItems[rack] || []).length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.leftAlign}>Item</th>
                  <th style={styles.leftAlign}>Description</th>
                  <th style={styles.leftAlign}>Location</th>
                  <th style={styles.leftAlign}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {groupedItems[rack].map((item) => (
                  <tr key={item._id} style={styles.rowBorder}>
                    <td>{item.name}</td>
                    <td>{item.description || '—'}</td>
                    <td>{item.location || '—'}</td>
                    <td>{item.quantity ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ marginLeft: '10px', color: '#ddd' }}>No items in this rack.</p>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    minHeight: '100vh',
    color: '#fff'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  heading: { margin: 0 },
  label: { marginRight: '10px', fontWeight: 'bold' },
  select: { padding: '5px', marginRight: '10px' },
  downloadBtn: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  rackSection: {
    marginBottom: '40px',
    backgroundColor: '#ffffff',
    color: '#333',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 0 8px rgba(0,0,0,0.08)'
  },
  rackTitle: { marginBottom: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  rowBorder: { borderBottom: '1px solid #ddd' },
  leftAlign: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '2px solid #ccc',
    backgroundColor: '#f9f9f9'
  }
};

export default InventorySummaryPage;