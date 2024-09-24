import { Link } from 'react-router-dom';
import './styles/CategoryList.css'; // Import the CSS for styling

const categories = [
  { name: 'Technology', path: '/technology', icon: '💻' },
  { name: 'Education', path: '/education', icon: '📚' },
  { name: 'Health', path: '/health', icon: '🩺' },
  { name: 'Business', path: '/business', icon: '💼' },
  { name: 'Entertainment', path: '/entertainment', icon: '🎉' },
  { name: 'Sports', path: '/sports', icon: '🏆' },
  // Add more categories as needed
];

const CategoryList = () => {
  return (
    <div className="sticky-top category-list bg-light mb-5">
      {categories.map((category) => (
        <Link key={category.name} to={category.path} className="category-item">
          <span className="category-icon">{category.icon}{" "}</span>
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
