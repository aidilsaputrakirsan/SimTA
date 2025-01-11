import React, { useState } from 'react';

const ItemForm = ({ mode, item, onSubmit, onCancel }) => {
  const [name, setName] = useState(item ? item.name : '');
  const [dateOfBirth, setDateOfBirth] = useState(item ? item.date_of_birth : '');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validasi input
    if (!name || !dateOfBirth) {
      alert('Name and Date of Birth are required!');
      return;
    }
  
    // Format tanggal ke ISO string (YYYY-MM-DD)
    const formattedDate = new Date(dateOfBirth).toISOString().split('T')[0];
    const data = { name, date_of_birth: formattedDate };
  
    if (mode === 'create') {
      onSubmit(data); // Benar: handleCreate di App.jsx menerima satu argumen
    } else {
      onSubmit(item.id, data); // Benar untuk update
    }    
    
  };

  return (
    <div>
      <h2>{mode === 'create' ? 'Create Item' : 'Update Item'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">{mode === 'create' ? 'Create' : 'Update'}</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;