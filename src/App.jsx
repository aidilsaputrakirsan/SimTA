import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/items');
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async (data) => {
    console.log('Creating item with data:', data); // Debugging
    try {
      const response = await axios.post('http://localhost:3000/items', data);
      fetchItems(); // Refetch items setelah create
      setEditItemId(null);
    } catch (err) {
      console.error('Error creating item:', err);
      setError(err.response?.data?.error || 'Failed to create item');
    }
  };

  const handleUpdate = async (id, data) => {
    console.log(`Updating item ${id} with data:`, data); // Debugging
    try {
      await axios.put(`http://localhost:3000/items/${id}`, data);
      fetchItems(); // Refetch items setelah update
      setEditItemId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>CRUD App</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={() => setEditItemId('new')}>Create New Item</button>
      <ItemList items={items} onDelete={handleDelete} onEdit={setEditItemId} />
      {editItemId === 'new' ? (
        <ItemForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setEditItemId(null)}
        />
      ) : (
        editItemId && (
          <ItemForm
            mode="update"
            item={items.find(item => item.id === editItemId)}
            onSubmit={handleUpdate}
            onCancel={() => setEditItemId(null)}
          />
        )
      )}
    </div>
  );
}

export default App;