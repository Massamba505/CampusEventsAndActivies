import { useEffect, useRef, useState } from 'react';
import UpcomingEventCard from './UpcomingEventCard';
import { Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { myConstant } from '../const/const';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + '/api/events');
        const data = await response.json();

        if (response.ok) {
          setEvents(data.data);
        } else {
          setError(`Error: ${data.error}`);
          toast.error(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events');
        toast.error('Error fetching events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 800, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col mb-3 mt-4 px-2">
      <h4 className="text-decoration-underline underline-offset-4 mb-2 sm:ml-11">
        Upcoming Events
      </h4>
      <div className="relative w-full flex items-center justify-start">
        <MdChevronLeft
          className="opacity-50 hidden sm:block  mb-5  cursor-pointer hover:opacity-100"
          onClick={slideLeft}
          size={40}
        />
        <div
          ref={sliderRef}
          id="events-slider"
          className="flex items-centerflex-1 pb-5 mt-2 overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide"
        >
          {events.length > 0 ? (
            events.map((event, index) => (
              <UpcomingEventCard key={event.event_id || index} event={event} />
            ))
          ) : (
            <p>No upcoming events available</p>
          )}
        </div>
        <MdChevronRight
          className="opacity-50 hidden  mb-5  sm:block cursor-pointer hover:opacity-100"
          onClick={slideRight}
          size={40}
        />
      </div>
    </div>
  );
};

export default UpcomingEvents;
