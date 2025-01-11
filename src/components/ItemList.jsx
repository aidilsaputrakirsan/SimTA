import React from 'react';

const ItemList = ({ items, onDelete, onEdit }) => {
  return (
    <div>
      <h2>Items List</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {new Date(item.date_of_birth).toLocaleDateString()}
            <button onClick={() => onDelete(item.id)}>Delete</button>
            <button onClick={() => onEdit(item.id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;