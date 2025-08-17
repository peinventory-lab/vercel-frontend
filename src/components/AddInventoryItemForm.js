// src/components/AddInventoryItemForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddInventoryItemForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    quantity: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/inventory/add', formData);
      setMessage('Item added successfully!');
      setFormData({ name: '', description: '', location: '', quantity: '' });
      onAdd();
    } catch (err) {
      console.error('Error adding item:', err);
      setMessage('Failed to add item.');
    }
  };

  return (
    <div style={styles.formWrapper}>
      <h3>Add New Inventory Item</h3>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="location" placeholder="Location (e.g., A1)" value={formData.location} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
        <button type="submit" style={styles.button}>Add Item</button>
      </form>
    </div>
  );
};

const styles = {
  formWrapper: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  message: {
    fontWeight: 'bold',
    color: '#155724'
  }
};

export default AddInventoryItemForm;