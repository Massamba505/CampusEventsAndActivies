import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { myConstant } from '../const/const';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import TallEventCard from './TallEventCard';
import comparing from '../utils/comparing';
import { useEventsContext } from '../context/EventsContext';

const PopularEvents = () => {
  const { popularEvents,setPopularEvents } = useEventsContext();
  const [events, setEvents] = useState(popularEvents);
  const [error, setError] = useState(null);

  const sliderRef = useRef(null);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + '/api/events/popular');
        const data = await response.json();
        if (response.ok) {
          if(!comparing(data.data,events)){
            setEvents(data.data);
            setPopularEvents(data.data);
          }
        } else {
          toast.error(`Error: ${data.error}`);
          setError(`${data.error}`);
        }
      } catch (error) {
        setError('Error fetching events');
        console.error('Error fetching events:', error);
        toast.error('Error fetching events');
      }
    };

    fetchEvents();
  }, []);

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
      <h4 className='text-decoration-underline underline-offset-4 ml-2 sm:ml-4'>Popular Events</h4>
      <div className='relative w-full flex items-center justify-start'>
        <MdChevronLeft 
          className='opacity-50 hidden sm:block cursor-pointer hover:opacity-100' 
          onClick={slideLeft} 
          size={40} 
        />
        <div
          ref={sliderRef}
          id='events-slider'
          className='flex items-center px-2 pt-2 gap-2 flex-1 overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar-hide'
        >
          {events.length > 0 ? (
              events.map((event, index) => (
                <TallEventCard key={event.event_id || index} event={event} />
              ))
          ) : (
            <p>No popular events available</p>
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

export default PopularEvents;
