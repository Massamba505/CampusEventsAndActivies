import { Link } from 'react-router-dom';
import { CalendarDaysIcon, UserIcon, TicketIcon } from '@heroicons/react/24/outline'; // Adjust the import based on your icon library
import truncateString from '../utils/truncate';
import { MapIcon } from 'lucide-react';

const ShortEventCard = ({ event }) => {
  const {
    title,
    date,
    startTime,
    endTime,
    eventAuthor: organizer,
    location,
    images = [],
    isPaid,
    ticketPrice,
    event_id
  } = event;

  return (
    <Link to={`/events/${event_id}`} className='text-decoration-none w-96 px-3 sm:w-96'>
      <div className="border border-gray-700 transition-transform transform px-3 hover:bg-gray-100 hover:cursor-pointer flex flex-row justify-center items-center rounded-lg shadow-md">
        {/* Image Section */}
        <div className='flex items-center justify-center w-28 sm:w-36 h-24 sm:h-32'>
          <img
            src={images[0] || 'placeholder-image-url'}
            alt={title}
            className="mx-auto aspect-video rounded-md object-cover w-full h-28 sm:h-32"
          />
        </div>

        {/* Info Section */}
        <div className="py-1 pl-2 flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {truncateString(title, 40)}
          </h3>

          <div className="flex items-center mt-0 space-x-1">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <small className="text-xs font-semibold text-gray-500">{date}</small>
          </div>

          <div className="flex items-center mt-1 space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 26 21"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <small className="text-xs font-semibold text-gray-500">
              {startTime} - {endTime}
            </small>
          </div>

          <div className="flex items-center mt-1 space-x-1">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <small className="text-xs font-semibold text-gray-500">Organizer: {organizer}</small>
          </div>

          <div className="flex items-center mt-1 space-x-1">
            <MapIcon className="h-4 w-4 text-gray-500" />
            <small className="text-xs font-semibold text-gray-500">{location}</small>
          </div>

          <div className="flex items-center mt-1 space-x-1">
            <TicketIcon className="h-4 w-4 text-gray-500" />
            <small className={`text-xs font-bold ${isPaid ? "text-green-600" : "text-blue-800"}`}>
              {isPaid ? `Ticket Price: R${ticketPrice}` : 'Free Event'}
            </small>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShortEventCard;
