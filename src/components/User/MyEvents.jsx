import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { myConstant } from '../../const/const';
import { Spinner } from 'react-bootstrap';
import {toast} from 'react-hot-toast';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = JSON.parse(localStorage.getItem('events-app'))?.token;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${myConstant}/api/events/myevents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch events.');
      }

      const data = await response.json();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error); 
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${myConstant}/api/events/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Delete error data:', data); // Log error details
        throw new Error(data.error || 'Failed to delete event.');
      }

      await fetchEvents();
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {error ? (
        <div className="mx-auto p-4">
          <p>You {"haven't"} created any events yet.</p>
        </div>
      ) : (
        <div className="flex items-center justify-center pt-4 flex-col">
          <h1 className="text-3xl text-center text-blue-500 font-bold mb-4">My Events</h1>
          {events.length > 0 ? (
            <div className="container flex items-center flex-col sm:flex-row sm:justify-start flex-wrap gap-4">
              {events.map(event => (
                <EventCard
                  key={event.event_id}
                  event={event}
                  onDeleteEvent={handleDelete}
                  onEditEvent={fetchEvents} // This can be adjusted if needed
                  onGetTickets={() => console.log('Get tickets')} // Placeholder
                />
              ))}
            </div>
          ) : (
            <p>No events found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
