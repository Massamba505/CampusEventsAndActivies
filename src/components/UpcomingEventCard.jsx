import { Link } from 'react-router-dom';
import truncateString from '../utils/truncate';

const UpcomingEventCard = ({ event, onGetTickets }) => {
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
    maxAttendees,
    currentAttendees,
    food_stalls,
    category,
    event_id
  } = event;

  return (
    <Link to={`/events/${event_id}`} className='text-decoration-none'>
      <div className="hover:scale-105 hover:cursor-pointer flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden max-w-xl my-4">
        {/* Image Section */}
        <div className='flex items-center justify-center w-full md:w-48'>
          <img
            src={images[0]}
            alt={title}
            className="w-full h-48 object-contain"
          />
        </div>

        {/* Info Section */}
        <div className="p-4 flex-1">
          <h3 className="text-xl font-bold text-gray-800">
            {truncateString(title, 60)}
          </h3>

          <div className="flex items-center mt-2 space-x-2">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">
              {date} {startTime} - {endTime}
            </small>
          </div>

          <div className="flex items-center mt-2 space-x-2">
            <OrganizerIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">Organizer: {organizer}</small>
          </div>

          <div className="flex items-center mt-2 space-x-2">
            <LocationIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">{location}</small>
          </div>

          <div className="flex items-center mt-2 space-x-2">
            <CategoryIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">
              Categories: {category?.map((cat) => cat.name).join(', ') || 'N/A'}
            </small>
          </div>

          <div className="flex items-center mt-2 space-x-2">
            <AttendeesIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">
              {currentAttendees}/{maxAttendees || 'Unlimited'} Attendees
            </small>
          </div>

          {food_stalls && (
            <div className="flex items-center mt-2 space-x-2">
              <FoodIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">Food Stalls Available</small>
            </div>
          )}

          <div className="flex items-center mt-2 space-x-2">
            <TicketIcon className="h-4 w-4 text-gray-500" />
            <small className={`text-sm text-gray-500 font-bold ${isPaid? "text-green-600": "text-blue-800"}`}>
              {isPaid ? `Ticket Price: $${ticketPrice}` : 'Free Event'}
            </small>
          </div>

          <button
            onClick={onGetTickets}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
          >
            Get Tickets
          </button>
        </div>
      </div>
    </Link>
  );
};

function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function OrganizerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20v-6M6 20v-6M18 20v-6M2 10h20" />
    </svg>
  );
}

function LocationIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2a9 9 0 0 1 9 9c0 5-9 13-9 13s-9-8-9-13a9 9 0 0 1 9-9z" />
    </svg>
  );
}

function CategoryIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 3h4v4M8 3h8v4M2 3h4v4" />
    </svg>
  );
}


function AttendeesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 20.5a8.38 8.38 0 0 1 13 0" />
    </svg>
  );
}
function FoodIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8l16 0M4 16l16 0" />
    </svg>
  );
}

function TicketIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <path d="M6 10h12v4H6z" />
    </svg>
  );
}

export default UpcomingEventCard;
