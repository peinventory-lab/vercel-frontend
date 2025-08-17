import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestPage = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/inventory');
        setItems(res.data);
      } catch (err) {
        console.error('Failed to fetch items:', err);
      }
    };
    fetchItems();
  }, []);

  const handleAddToCart = () => {
    if (!selectedItem || !quantity) {
      setMessage('Please select an item and quantity.');
      return;
    }
    const itemExists = cart.find(item => item.itemName === selectedItem);
    if (itemExists) {
      setMessage('Item already in cart. Edit it instead.');
      return;
    }
    setCart([...cart, { itemName: selectedItem, quantity, note }]);
    setSelectedItem('');
    setQuantity('');
    setNote('');
    setMessage('Item added to cart.');
  };

  const handleRemoveFromCart = (itemName) => {
    setCart(cart.filter(item => item.itemName !== itemName));
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setMessage('Cart is empty.');
      return;
    }
    try {
      const payload = cart.map(item => ({ ...item, requestedBy: user?.username || 'Unknown' }));
      await axios.post('http://localhost:5050/api/requests/bulk', { requests: payload });
      setCart([]);
      setMessage('Requests submitted successfully!');
    } catch (err) {
      console.error('Failed to submit requests:', err);
      setMessage('Failed to submit requests.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🛒 Request Multiple Items</h2>
      <div style={styles.form}>
        <label style={styles.label}>Select Item:</label>
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          style={styles.input}
        >
          <option value="">-- Choose an item --</option>
          {items.map((item) => (
            <option key={item._id} value={item.name}>{item.name}</option>
          ))}
        </select>

        <label style={styles.label}>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={styles.input}
          min="1"
        />

        <label style={styles.label}>Note (optional):</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={styles.input}
          rows={3}
        />

        <button type="button" style={styles.button} onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <div style={styles.cartBox}>
        <h3>🧾 Cart</h3>
        {cart.length === 0 ? <p>No items in cart.</p> : (
          <ul>
            {cart.map((item, index) => (
              <li key={index} style={styles.cartItem}>
                <strong>{item.itemName}</strong> (x{item.quantity})
                {item.note && <span> - {item.note}</span>}
                <button style={styles.removeBtn} onClick={() => handleRemoveFromCart(item.itemName)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        <button style={styles.submitBtn} onClick={handleSubmit}>Submit Request</button>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    background: 'linear-gradient(to right, #1e3a8a, #2563eb, #3b82f6)',
    minHeight: '100vh',
    fontFamily: 'Arial',
    color: 'white'
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold'
  },
  form: {
    backgroundColor: 'white',
    color: 'black',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    marginTop: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cartBox: {
    marginTop: '30px',
    backgroundColor: '#fff',
    color: '#000',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '500px'
  },
  cartItem: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  removeBtn: {
    marginLeft: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer'
  },
  submitBtn: {
    marginTop: '15px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  message: {
    marginTop: '10px',
    fontWeight: 'bold'
  }
};

export default RequestPage;