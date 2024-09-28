import NavbarComponent from '../components/Navbar';
import EventList from '../components/EventList';
import UpcomingEvents from '../components/UpcomingEvents';
import CategoryList from '../components/CategoryList';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PopularEvents from '../components/PopularEvents';

const Home = () => {
  
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (!events || events.length == 0) {
      const fetchEvents = async () => {
        try {
          const response = await fetch('/api/events'); // Make sure this endpoint is correct
          const data = await response.json();

          if (response.ok) {
            // Assuming your backend returns events in the `data` field
            setEvents(data.data);
          } else {
            toast.error(`Error: ${data.error}`);
          }
        } catch (error) {
          console.error('Error fetching events:', error);
          toast.error('Error fetching events');
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    } else {
      setLoading(false); // If events are passed as prop, no need to set loading
    }
  }, [events]);

  if (loading) {
    return <div className="text-center">Loading events...</div>; // Better user experience
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarComponent />
      <CategoryList />
      <div className="flex-grow w-full px-5 mt-4">
        {/* <hr></hr> */}
        <UpcomingEvents />
        <hr/>
        <PopularEvents/>
        <hr/>
        <div>
          <h2 className='text-decoration-underline underline-offset-4'>All Events</h2>
          {events && <EventList events={events} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
