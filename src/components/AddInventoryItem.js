// src/components/AddInventoryItem.js
import React, { useState } from 'react';
import axios from 'axios';

const AddInventoryItem = ({ onItemAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    quantity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5050/api/inventory/add', formData);
      alert('Item added successfully!');
      setFormData({ name: '', description: '', location: '', quantity: '' });

      if (onItemAdded) onItemAdded(); // Refresh inventory table if callback is passed
    } catch (err) {
      console.error(err);
      alert('Error adding item');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Add New Inventory Item</h3>
      <input
        type="text"
        name="name"
        placeholder="Item Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="text"
        name="description"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="text"
        name="location"
        placeholder="Location (e.g., A1, B2)"
        value={formData.location}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Add Item</button>
    </form>
  );
};

const styles = {
  form: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  input: {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default AddInventoryItem;