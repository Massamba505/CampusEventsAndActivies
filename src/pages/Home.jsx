import NavbarComponent from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import UpcomingEvents from '../components/UpcomingEvents';
import CategoryList from '../components/CategoryList';
import PopularEvents from '../components/PopularEvents';
import { useNavigate } from 'react-router-dom';
import RecommendedEvents from '../components/RecommendedEvents';
import InprogressEvents from '../components/InprogressEvents';
import { useEventsContext } from '../context/EventsContext';
import loadingGif from '../assets/loading.gif';

const Home = () => {
  const navigate = useNavigate();
  const { loading } = useEventsContext();

  const handleSearch = (search) => {
    if (search.trim()) {
      navigate(`/search?query=${search}`);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <img src={loadingGif} alt="loading..." className="w-16 h-16 mb-4" />
        <p className="text-blue-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <NavbarComponent />
      <CategoryList />
      <SearchBar handleSearch={handleSearch} />
      <hr />
      <div className="w-full mb-10">
        <UpcomingEvents />
        <hr />
        <PopularEvents />
        <hr />
        <RecommendedEvents />
        <InprogressEvents />
      </div>
    </>
  );
};

export default Home;
