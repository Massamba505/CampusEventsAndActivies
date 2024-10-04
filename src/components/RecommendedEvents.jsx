import { useEffect, useRef, useState } from 'react';
import RecommendedCard from './RecommendedCard';
import { Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { myConstant } from '../const/const';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const RecommendedEvents = () => {
  const [events, setEvents] = useState([]); // Ensure this is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPreferences, setHasPreferences] = useState(true);

  const sliderRef = useRef(null);
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + '/api/events/recommendation', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();

        if (response.ok) {
          if (data.count === 0) {
            setHasPreferences(false);
          }
          setEvents(data.data || []); // Ensure data.data is an array
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
  }, [token]);

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
        Recommended Events
      </h4>
      <div className="relative w-full flex items-center justify-start">
        <MdChevronLeft
          className="opacity-50 hidden sm:block mb-10 cursor-pointer hover:opacity-100"
          onClick={slideLeft}
          size={50}
        />
        <div
          ref={sliderRef}
          id="events-slider"
          className="flex items-center flex-1 pb-5 mt-2 overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide"
        >
          {hasPreferences ? (
            events.length > 0 ? (
              events.map((event, index) => (
                <RecommendedCard key={event.event_id || index} event={event} />
              ))
            ) : (
              <p>No recommended events available.</p>
            )
          ) : (
            <p>Go to your profile and enter your preferences.</p>
          )}
        </div>
        <MdChevronRight
          className="opacity-50 hidden mb-5 sm:block cursor-pointer hover:opacity-100"
          onClick={slideRight}
          size={50}
        />
      </div>
    </div>
  );
};

export default RecommendedEvents;
