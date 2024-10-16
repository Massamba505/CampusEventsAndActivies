import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { myConstant } from '../const/const';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import "../components/categoryList.css"

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(myConstant + '/api/category',{
          method:"GET",
          headers:{
            "Authorization":`Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [token]);
  
  const sliderRef = useRef(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -220, behavior: 'smooth' }); // Adjust the scroll amount as needed
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 220, behavior: 'smooth' }); // Adjust the scroll amount as needed
    }
  };

  return (
    <div className='relative w-full flex items-center justify-start'>
      <MdChevronLeft className='opacity-50 hidden sm:block cursor-pointer hover:opacity-100' onClick={slideLeft} size={40} />
      <div
        ref={sliderRef}
        id='category-slider'
        className='flex items-center flex-1 sm:justify-center overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide'
      >
        <ul className="flex p-0 mb-0 px-3 justify-start items-center gap-2">
          {/* Category Buttons */}
          {categories.map((category) => (
            <li key={category._id} className="flex-shrink-0 text-sm sm:text-base border rounded-lg border-gray-500 shadow-md">
              <Link
                to={`/search?query=${category.name}`}
                className="flex items-center sm:space-x-3 text-black text-decoration-none font-bold py-1 px-4 rounded-lg hover:scale-105 hover:bg-gray-100 transition-all duration-200"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-8 h-8 md:w-12 md:h-12 rounded mr-2"
                />
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <MdChevronRight className='opacity-50 hidden sm:block cursor-pointer hover:opacity-100' onClick={slideRight} size={40} />
    </div>
  );
  
};

export default CategoryList;
