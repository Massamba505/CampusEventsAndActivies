import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category'); // Adjust the URL as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data); // Assuming data is an array of category objects
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='w-full'>
        <ul className="flex items-center gap-2 flex-wrap justify-center">
          {/* Category Buttons */}
          {categories.map((category) => (
            <li key={category._id} className="flex-shrink-0 border rounded-lg border-gray-500 shadow-md mx-2">
              <Link
                to={`/search?query=${category.name}`}
                className="flex items-center space-x-2 text-black text-decoration-none font-bold py-1 px-4 rounded-lg hover:scale-105 hover:bg-gray-100 transition-all duration-200" // Rectangle styles
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-8 h-8 md:w-12 md:h-12 rounded mr-2" // Small image with some margin
                />
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default CategoryList;
