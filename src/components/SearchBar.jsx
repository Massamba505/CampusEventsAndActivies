import { useState } from 'react';

function SearchBar({ handleSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div className="flex justify-center mt-3 mb-4">
      <form onSubmit={onSubmit} className="flex w-10/12 md:w-1/2"> {/* Changed to w-3/4 for 75% width */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trim())}
          className="flex-1 h-12 md:h-14 px-4 rounded-l-md text-lg bg-white text-black placeholder-black border focus:outline-none border-gray-700 shadow-md"
        />
        <button
          type="submit"
          className="h-12 px-4 md:h-14 rounded-r-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
