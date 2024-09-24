import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const categories = [
  { name: 'Technology', path: '/technology', icon: '💻' },
  { name: 'Education', path: '/education', icon: '📚' },
  { name: 'Health', path: '/health', icon: '🩺' },
  { name: 'Business', path: '/business', icon: '💼' },
  { name: 'Entertainment', path: '/entertainment', icon: '🎉' },
  { name: 'Sports', path: '/sports', icon: '🏆' },
  // Add more categories as needed
];

function InfiniteCategory() {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Duplicate the list for the infinite scroll effect
    const scrollContainer = scrollContainerRef.current;
    const list = scrollContainer.querySelector('ul');
    list.insertAdjacentHTML('afterend', list.outerHTML); // Clone the list
    list.nextSibling.setAttribute('aria-hidden', 'true');

    // Animate scroll
    const animateScroll = () => {
      scrollContainer.scrollLeft += 1;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0; // Reset the scroll position
      }
    };
    
    const interval = setInterval(animateScroll, 20); // Adjust scroll speed here
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='mt-0'>
      {/* Scrollable Categories and Logos */}
      <div ref={scrollContainerRef} className="w-full inline-flex flex-nowrap overflow-hidden">
        <ul className="flex items-center justify-center [&_li]:mx-4">
          {/* Category Buttons */}
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                to={category.path}
                className="flex text-decoration-none items-center space-x-0 bg-blue-500 text-white font-bold py-2 px-2 rounded hover:bg-blue-600 transition-all duration-200"
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InfiniteCategory;
