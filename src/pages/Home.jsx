import NavbarComponent from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import UpcomingEvents from '../components/UpcomingEvents';
import CategoryList from '../components/CategoryList';
import PopularEvents from '../components/PopularEvents';
import { useNavigate } from 'react-router-dom';
import RecommendedEvents from '../components/RecommendedEvents';
import InprogressEvents from '../components/InprogressEvents';

const Home = () => {

  const navigate = useNavigate();

  function handleSearch(search){
    navigate(`/search?query=${search}`);
  }

  return (
    <div className="flex flex-col">
      <NavbarComponent />
      <CategoryList />
      <SearchBar handleSearch = {handleSearch} />
      <hr/>
      <div className="w-full mb-10">
        <UpcomingEvents />
        <hr/>
        <PopularEvents/>
        <hr/>
        <RecommendedEvents/>
        <hr/>
        <InprogressEvents/>
        <hr/>
      </div>
    </div>
  );
};

export default Home;
