import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import NavbarComponent from '../components/Navbar';
import { myConstant } from '../const/const';
import { Spinner } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + `/api/events/search?query=${query}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
        const data = await response.json();
        setEvents(data.data);
      } catch (error) {
        toast.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if(!query){
      navigate("/");
    }
    fetchEvents();
  }, [navigate, query]);

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  function handleSearch(search){
    navigate(`/search?query=${search}`);
  }

  return (

    <div className="min-h-screen flex flex-col bg-white">
      <NavbarComponent />
      <CategoryList />
      <SearchBar handleSearch = {handleSearch} />
      <hr></hr>
      <div className="w-full sm:px-10">
        {error?(
          <div className="mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{`Search Results for "${query}"`}</h1>
            <p>No events found.</p>
          </div>
        ):(
        <div className="mx-auto p-4 flex items-center flex-col">
          <h1 className="text-2xl font-bold mb-4">{`Search Results for "${query}"`}</h1>
          {events.length > 0 ? (
            <div className="flex items-center flex-col sm:flex-row flex-wrap gap-4">
              {events.map(event => (
                <EventCard key={event.event_id} event={event} onGetTickets={() => console.log('Get tickets')} />
              ))}
            </div>
          ) :(
            <p>No events found.</p>
          )}
        </div>)}
      </div>
    </div>
    
  );
};

export default SearchResults;
