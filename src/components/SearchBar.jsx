import { useState } from 'react';
import toast from 'react-hot-toast';

function SearchBar({ handleSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
    if(!searchTerm.trim()){
      toast.error("input a keyword");
      return;
    }
    handleSearch(searchTerm);
  };

  return (
    <div className="flex items-center justify-center my-3">
      <form onSubmit={onSubmit} className="flex text-sm sm:text-lg w-full justify-center">
        {/* Input Field */}
        <input
          id="q"
          name="q"
          className="inline rounded-md sm:text-xl sm:w-2/5 border p-2 rounded-r-none bg-white leading-5"
          placeholder="Keyword"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search Button */}
        <button
          type="submit"
          className="inline-flex p-2 sm:px-10 items-center rounded-l-none justify-center rounded-md border border-transparent bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
      </div>
  );
}

export default SearchBar;
