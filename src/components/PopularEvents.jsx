import { useEffect, useState } from 'react';
import UpcomingEventCard from './UpcomingEventCard';
// import './styles/UpcomingEvents.css'; // Import CSS for styling
import { Spinner, Alert } from 'react-bootstrap'; // Optional: for loading and error handling
import toast from 'react-hot-toast';
import EventList from './EventList';

const PopularEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();

        if (response.ok) {
          setEvents(data.data.slice(0,4)); // Assuming your backend returns events in the `data` field
          console.log(data);
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
  }, []);
  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="upcoming-events-container  mb-3">
      <h3 className='text-decoration-underline underline-offset-4'>Popular Events Events</h3>
      <div className="upcoming-events mt-10">
        {events.length > 0 ? (
            <EventList events={events} />
        ) : (
          <p>No popular events available</p>
        )}
      </div>
    </div>
  );
};

export default PopularEvents;
