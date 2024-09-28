import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EventCard from './EventCard'; // Make sure to adjust this import based on your file structure
import NavbarComponent from '../components/Navbar';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // Get the search query from the URL
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events/search?query=${query}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
        const data = await response.json();
        setEvents(data.data); // Adjust this according to the structure of your response
      } catch (error) {
        // toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if(!query){
      navigate("/");
    }
    fetchEvents();
  }, [navigate, query]);

  if (loading) return <p>Loading...</p>;

  return (

    <div className="min-h-screen flex flex-col bg-white">
      <NavbarComponent />
      {error?(<h3>{error}</h3>):(<div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{`Search Results for "${query}"`}</h1>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <EventCard key={event.event_id} event={event} onGetTickets={() => console.log('Get tickets')} />
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </div>)}
  </div>
    
  );
};

export default SearchResults;
