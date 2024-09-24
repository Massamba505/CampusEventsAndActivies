import truncateString from '../utils/truncate';

const UpcomingEventCard = ({ event, onGetTickets }) => {
  const { title, date, eventAuthor:organizer, location, images } = event;

  return (
    <div className="hover:scale-105 hover:cursor-pointer flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden max-w-2xl my-4">
      {/* Image Section */}
      <img
        src={images[0]}
        alt={title}
        className="w-full md:w-48 h-32 md:h-auto object-cover"
      />

      {/* Info Section */}
      <div className="p-4 flex-1">
        <h3 className="text-xl font-bold text-gray-800">
          {truncateString(title, 60)}
        </h3>

        <div className="flex items-center mt-2 space-x-2">
          <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
          <small className="text-sm text-gray-500">{date}</small>
        </div>

        <div className="flex items-center mt-2 space-x-2">
          <OrganizerIcon className="h-4 w-4 text-gray-500" />
          <small className="text-sm text-gray-500">Organizer: {organizer}</small>
        </div>

        <div className="flex items-center mt-2 space-x-2">
          <LocationIcon className="h-4 w-4 text-gray-500" />
          <small className="text-sm text-gray-500">{location}</small>
        </div>

        <button
          onClick={onGetTickets}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
        >
          Get Tickets
        </button>
      </div>
    </div>
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

export default UpcomingEventCard;
