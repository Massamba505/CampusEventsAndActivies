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

  function handleSearch(search){
    if(search.trim()){
      navigate(`/search?query=${search}`);
    }
  }
  const {loading } = useEventsContext();

  if(loading){
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <img src={loadingGif} alt="loading..." />
        <p className="text-blue-500">loading...</p>
      </div>
    )
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
        <InprogressEvents/>
      </div>
    </div>
  );
};

export default Home;
