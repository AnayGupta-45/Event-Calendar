import React from 'react';

function SearchBar({ searchTerm, onSearch, selectedCategory, onCategoryChange }) {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'study', label: 'Study' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="form-input"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
