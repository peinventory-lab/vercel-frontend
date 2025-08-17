// src/pages/InventoryPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// const API_BASE = 'http://localhost:5050/api';
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

// utility to normalize location strings
const norm = (v) => (v ?? '').toString().trim().toUpperCase();

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('view');
  const [filterRack, setFilterRack] = useState('All');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formQuantity, setFormQuantity] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/inventory`);
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/inventory/delete/${id}`); // ✅ add /api
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleEdit = (item) => {
    setSelectedItemId(item._id);
    setFormName(item.name || '');
    setFormDescription(item.description || '');
    setFormLocation(item.location || '');
    setFormQuantity(String(item.quantity ?? ''));
    if (mode !== 'update') setMode('update');
  };

  const handleUpdateItem = async () => {
    if (!selectedItemId) return;
    if (!formName || !formLocation || formQuantity === '') return;

    try {
      await axios.put(`${API_BASE}/api/inventory/edit/${selectedItemId}`, { // ✅ add /api
        name: formName.trim(),
        description: formDescription.trim(),
        location: formLocation.trim(),
        quantity: Number(formQuantity),
      });
      await fetchItems();
      resetForm();
      // setMode('view'); // optional: jump back to view after update
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const resetForm = () => {
    setSelectedItemId(null);
    setFormName('');
    setFormDescription('');
    setFormLocation('');
    setFormQuantity('');
  };

  // Build distinct, normalized, sorted list of locations for the dropdown
  const allLocations = Array.from(
    new Set(items.map((i) => norm(i.location)))
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Filter items by selected location (when in View Mode)
  const filteredItems =
    filterRack === 'All'
      ? items
      : items.filter((item) => norm(item.location) === norm(filterRack));

  // Decide which rows to show in the table:
  // - View Mode => filtered items
  // - Update Mode => show all items (so you can find + edit anything)
  const rows = mode === 'view' ? filteredItems : items;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}><span role="img" aria-label="box">📦</span> Inventory Items</h2>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => { setMode('view'); resetForm(); }}
          style={styles.button}
        >
          View Mode
        </button>
        <button
          onClick={() => { setMode('update'); }}
          style={styles.button}
        >
          Update Mode
        </button>
      </div>

      {/* Filter only shown in View Mode */}
      {mode === 'view' && (
        <>
          <label style={{ color: 'white', marginRight: 10 }}>Filter by Rack:</label>
          <select
            onChange={(e) => setFilterRack(e.target.value)}
            value={filterRack}
            style={styles.dropdown}
          >
            <option value="All">All</option>
            {allLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </>
      )}

      {/* Update Mode: show edit form */}
      {mode === 'update' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateItem();
          }}
          style={styles.editForm}
        >
          <h3 style={{ marginTop: 0 }}>Edit Item</h3>
          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Item Name"
            style={styles.input}
            required
          />
          <input
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Description (optional)"
            style={styles.input}
          />
          <input
            value={formLocation}
            onChange={(e) => setFormLocation(e.target.value)}
            placeholder="Location (e.g., A1)"
            style={styles.input}
            required
          />
          <input
            type="number"
            value={formQuantity}
            onChange={(e) => setFormQuantity(e.target.value)}
            placeholder="Quantity"
            style={styles.input}
            required
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="submit"
              style={styles.editBtn}
              disabled={!selectedItemId}
              title={!selectedItemId ? 'Click Edit on a row first' : 'Update the item'}
            >
              Update Item
            </button>
            {selectedItemId && (
              <button type="button" onClick={resetForm} style={styles.deleteBtn}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description || '—'}</td>
              <td>{item.location || '—'}</td>
              <td>{item.quantity ?? '—'}</td>
              <td>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: 16 }}>
                No items found for this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  page: {
    padding: '30px',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    minHeight: '100vh',
    color: '#fff',
  },
  heading: { marginBottom: '20px' },
  button: {
    padding: '8px 14px',
    marginRight: '10px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  dropdown: {
    padding: '6px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  editBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  editForm: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  input: {
    display: 'block',
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc'
  }
};

export default InventoryPage;