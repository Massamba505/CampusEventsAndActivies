import { useEffect, useState } from 'react';
import UpcomingEventCard from './UpcomingEventCard';
import { Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { myConstant } from '../const/const';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + '/api/events');
        const data = await response.json();

        if (response.ok) {
          setEvents(data.data.slice(0,4));
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
    <div className="upcoming-events-containermb-3">
      <h3 className='text-decoration-underline underline-offset-4'>Upcoming Events</h3>
      <div className="upcoming-events flex flex-wrap flex-col justify-center md:justify-start items-center md:flex-row gap-3 mt-10">
        {events.length > 0 ? (
          events.map((event, index) => (
            <UpcomingEventCard key={index} event={event} />
          ))
        ) : (
          <p>No upcoming events available</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
