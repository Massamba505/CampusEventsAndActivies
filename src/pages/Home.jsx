import NavbarComponent from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import UpcomingEvents from '../components/UpcomingEvents';
import CategoryList from '../components/CategoryList';
import PopularEvents from '../components/PopularEvents';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  function handleSearch(search){
    navigate(`/search?query=${search}`);

  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarComponent />
      <SearchBar handleSearch = {handleSearch} />
      <CategoryList />
      <hr></hr>
      <div className="flex-grow w-full px-5 mt-4">
        <UpcomingEvents />
        <hr/>
        <PopularEvents/>
        <hr/>
      </div>
    </div>
  );
};

export default Home;
