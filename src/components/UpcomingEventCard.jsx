import { Link } from 'react-router-dom';
import truncateString from '../utils/truncate';

const UpcomingEventCard = ({ event }) => {
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
    <Link to={`/events/${event_id}`} className='  text-decoration-none w-96 px-3 sm:w-96'>
      <div className=" border border-gray-700 transition-transform transform px-3 hover:bg-gray-100 hover:cursor-pointer flex flex-row justify-center items-center rounded-lg shadow-md">
        {/* Image Section */}
        <div className='flex items-center justify-center w-28 sm:w-36 h-24 sm:h-32'> {/* Added fixed height to the container */}
          <img
            src={images[0]}
            alt={title}
            className="w-full object-cover" // Changed to h-full for better centering
          />
        </div>
  
        {/* Info Section */}
        <div className="py-2 pl-2 flex-1"> {/* Reduced padding */}
          <h3 className="text-lg font-semibold text-gray-800">
            {truncateString(title, 40)} {/* Shorter title truncation */}
          </h3>
  
          <div className="flex items-center mt-1 space-x-1">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <small className="text-xs  font-semibold text-gray-500">
              {date}
            </small>
          </div>
          <div className="flex items-center mt-1 space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 26 21"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5 text-gray-500 m-0 p-0" // Added m-0 and p-0
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
  
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-5 w-5 text-gray-500 m-0 p-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <small className="text-xs font-semibold text-gray-500">organizer: {organizer}</small>
          </div>
  
          <div className="flex items-center mt-1 space-x-1">
            <LocationIcon className="h-4 w-4 text-gray-500" />
            <small className="text-xs font-semibold text-gray-500">{location}</small>
          </div>
  
          {/* <div className="flex items-center mt-1 space-x-1">
            <CategoryIcon className="h-4 w-4 text-gray-500" />
            <small className="text-xs text-gray-500">
              Categories: {category?.map((cat) => cat.name).join(', ') || 'N/A'}
            </small>
          </div> */}
  
          {/* <div className="flex items-center mt-1 space-x-1">
            <AttendeesIcon className="h-4 w-4 text-gray-500" />
            <small className="text-xs text-gray-500">
              {currentAttendees}/{maxAttendees || 'Unlimited'} Attendees
            </small>
          </div> */}
  
          {/* {food_stalls && (
            <div className="flex items-center mt-1 space-x-1">
              <FoodIcon className="h-4 w-4 text-gray-500" />
              <small className="text-xs text-green-600">Food Stalls Available</small>
            </div>
          )} */}
  
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
