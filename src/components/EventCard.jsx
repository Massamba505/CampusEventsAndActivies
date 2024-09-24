import truncateString from '../utils/truncate';

const EventCard = ({ event, onGetTickets }) => {
  const { title, description, eventAuthor:organizer, date, location, images } = event;

  return (
    <div className="rounded-lg max-h-max max-w-md border bg-white p-6 shadow-lg transition-transform transform hover:scale-105">
      <div className="flex flex-col h-full items-start space-y-4">
        <img
          src={images[0]?images[0]:" "}
          alt="Event"
          className="mx-auto aspect-video rounded-xl object-cover w-full h-48"
          width="300"
          height="200"
        />
        <div className="flex-1 flex flex-col space-y-2 max-h-64">
          <h3 className="text-xl font-bold text-gray-800">
            {truncateString(title, 80)}
          </h3>
          <p className="text-gray-600">
            {truncateString(description, 120)}
          </p>
          
          <div className="flex mt-3 items-center space-x-2">
            <OrganizerIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">{organizer}</small>
          </div>
          <div className="flex mt-2 items-center space-x-2">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">{date}</small>
          </div>
          <div className="flex mt-2 items-center space-x-2">
            <LocateIcon className="h-4 w-4 text-gray-500" />
            <small className="text-sm text-gray-500">{location}</small>
          </div>
          <div className="mt-3 w-full">
            <button
              onClick={onGetTickets}
              className="self-start inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
            >
              Get Tickets
            </button>
          </div>
        </div>
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
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}

// function CalendarIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M8 2v4" />
//       <path d="M16 2v4" />
//       <rect width="18" height="18" x="3" y="4" rx="2" />
//       <path d="M3 10h18" />
//     </svg>
//   )
// }



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
  )
}

export default EventCard;
