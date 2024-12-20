import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import { myConstant } from '../const/const';
import { Spinner } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import toast from 'react-hot-toast';
import TallEventCard from './TallEventCard';
import loadingGif from '../assets/loading.gif'

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Set loading to true before the fetch
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
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    if (!query) {
      navigate("/");
    } else {
      fetchEvents();
    }
  }, [navigate, query]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarComponent />
      <CategoryList />
      <SearchBar handleSearch={(search) => navigate(`/search?query=${search}`)} />
      <hr />
      <div className="w-full sm:px-10">
        <div className="mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">{`Search Results for "${query}"`}</h1>
          {loading ? (
            <div className="flex flex-col justify-center items-center">
              <img src={loadingGif} width={50} alt="loading..." />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex items-center flex-col">
              {events.length > 0 ? (
                <div className="flex items-center flex-col sm:flex-row flex-wrap gap-4">
                  {events.map(event => (
                    <TallEventCard key={event.event_id} event={event} onGetTickets={() => console.log('Get tickets')} />
                  ))}
                </div>
              ) : (
                <p>No events found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
