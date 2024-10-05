import { useEffect, useRef, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { myConstant } from '../const/const';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import TallEventCard from './TallEventCard';

const InprogressEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderRef = useRef(null);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + '/api/events/inprogress-events');
        const data = await response.json();

        if (response.ok) {
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
  }, []);
  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -1000, behavior: 'smooth' }); // Adjust the scroll amount as needed
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 1000, behavior: 'smooth' }); // Adjust the scroll amount as needed
    }
  };

  return (
    <div className="flex flex-col mb-3 px-2">
      <h4 className='text-decoration-underline underline-offset-4 mb-4 ml-11'>In progress Events</h4>
      <div className='relative w-full flex items-center justify-start'>
        <MdChevronLeft 
          className='opacity-50 hidden sm:block cursor-pointer hover:opacity-100' 
          onClick={slideLeft} 
          size={40} 
        />
        <div
          ref={sliderRef}
          id='events-slider'
          className='flex items-center gap-2 flex-1 overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide'
        >
          {events.length > 0 ? (
              <>
                {events.map((event) => (
                  <TallEventCard key={event.event_id} event={event} />
                ))}
              </>
          ) : (
            <p>There are no available in progress events.</p>
          )}
        </div>
        <MdChevronRight 
          className='opacity-50 hidden sm:block cursor-pointer hover:opacity-100' 
          onClick={slideRight} 
          size={40} 
        />
      </div>
    </div>
  );
};

export default InprogressEvents;