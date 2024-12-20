import { Link } from 'react-router-dom';
import truncateString from '../utils/truncate';
import { UserIcon } from 'lucide-react';

const TallEventCard = ({ event = {}, onGetTickets }) => {
  const {
    event_id,
    title,
    eventAuthor,
    date,
    startTime,
    endTime,
    location,
    images = [],
    isPaid,
    ticketPrice,
    maxAttendees,
    currentAttendees,
    food_stalls,
    discount = 0,
    category = [],
  } = event;

  return (
    <Link to={`/events/${event_id}`} className='text-decoration-none bg-white'>
      <div className="rounded-lg w-60 sm:w-80  border  p-2 transition-transform transform hover:bg-gray-100">
        <div className="flex flex-col h-full items-start space-y-4">
          {/* Image Section */}        
          <div className='relative flex justify-center w-full'>
            <div className="relative">
              <img className="mx-auto aspect-video rounded-xl object-cover w-full h-32 sm:h-40" src={images[0]} alt={title} />
              <p className={`absolute top-0 ${!isPaid ? "bg-blue-600" : "bg-green-600"} text-white font-semibold py-1 px-3 rounded-br-lg rounded-tl-lg`}>
                {!isPaid ? "FREE" : `R${ticketPrice}`}
              </p>
              {discount > 0 && (
                <p className="absolute top-0 right-0 bg-yellow-300 text-gray-800 font-semibold py-1 px-3 rounded-tr-lg rounded-bl-lg">
                    {discount}%
                </p>
              )}
            </div>
          </div>
          

          {/* Info Section */}
          <div className="flex-1 flex flex-col w-full space-y-2">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800">
              {truncateString(title, 30)}
            </h3>

            {/* Organizer */}
            <div className="flex mt-0 items-center space-x-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">{eventAuthor}</small>
            </div>

            {/* Date and Time */}
            <div className="flex mt-1 items-center space-x-2">
              <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">{date} {startTime} - {endTime}</small>
            </div>

            {/* Location */}
            <div className="flex mt-1 items-center space-x-2">
              <LocateIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">{location}</small>
            </div>

            {/* Categories */}
            <div className="flex mt-1 items-center space-x-2">
              <CategoryIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">{category?.map((cat) => cat.name).join(', ') || 'N/A'}</small>
            </div>

            {/* Attendees */}
            <div className="flex mt-1 items-center space-x-2">
              <AttendeesIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">{currentAttendees}/{maxAttendees || 'Unlimited'} Attendees</small>
            </div>

            {/* Food Stalls */}
            {food_stalls && (
              <div className="flex mt-1 items-center space-x-2">
                <FoodIcon className="h-4 w-4 text-gray-500" />
                <small className="text-sm text-gray-500">Food Stalls Available</small>
              </div>
            )}

            {/* Get Tickets Button */}
            <div className="mt-0 w-full">
              <button onClick={onGetTickets} className={`self-start inline-flex justify-center mt-4 text-xl w-full text-white ${!isPaid ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}  py-2 rounded-xl shadow-md  transition duration-200`}>{!isPaid ? "Get Ticket" : "Buy Ticket"}</button>
            </div>
          </div>
        </div>
      </div>
    </Link>

  );
};

// Icon Components

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

function LocateIcon(props) {
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
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
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
      <path d="M3 12h18M3 6h18M5 6v16M19 6v16" />
      <path d="M3 6h18v4M8 6v12" />
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
      <rect x="3" y="8" width="18" height="8" rx="2" ry="2" />
      <path d="M8 12h2M14 12h2M4 12h.01M20 12h.01" />
    </svg>
  );
}

export default TallEventCard;
