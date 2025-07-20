import React from "react";

function SearchBar({
  searchTerm,
  onSearch,
  selectedCategory,
  onCategoryChange,
}) {
  const categories = [
    { value: "", label: "All Categories" },
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "study", label: "Study" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="bg-white rounded-lg p-4 mb-5 shadow border border-blue-200">
      <div className="flex gap-4 flex-col sm:flex-row items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none"
            style={{ fontFamily: "'Comic Sans MS', cursive" }}
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none"
            style={{ fontFamily: "'Comic Sans MS', cursive" }}
          >
            {categories.map((cat) => (
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
