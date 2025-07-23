import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get('http://localhost:8000/api/items/')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/items/', { name, description })
      .then(() => {
        setName('');
        setDescription('');
        fetchItems();
      })
      .catch(error => console.error('Error creating item:', error));  
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/items/${id}/`)
      .then(() => fetchItems())
      .catch(error => console.error('Error deleting item:', error));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDescription(item.description);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8000/api/items/${editingId}/`, {
      name: editName,
      description: editDescription
    })
      .then(() => {
        setEditingId(null);
        setEditName('');
        setEditDescription('');
        fetchItems();
      })
      .catch(error => console.error('Error updating item:', error));
  };

  return (
    <div className="container">
      <h1 className="title">Django + React CRUD App</h1>
      <form className="item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <ul className="item-list">
        {items.map(item => (
          <li key={item.id} className="item">
            {editingId === item.id ? (
              <form className="edit-form" onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <span className="item-name">{item.name}</span>
                <span className="item-desc">{item.description}</span>
                <button className="edit-btn" onClick={() => startEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;