import React, { useState, useEffect } from 'react';

const SearchFunction = ({ movies, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        const filteredMovies = movies.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        onSearch(filteredMovies);
      } else {
        onSearch(movies); // Show all movies when search is empty
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, movies, onSearch]);

  return (
    <div className="relative w-64 px-4 py-3">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <svg 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
    </div>
  );
};

export default SearchFunction;