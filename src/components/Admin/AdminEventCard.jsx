import { useState } from "react";
import truncateString from "../../utils/truncate";
import EditEventStatus from "./EditEventStatus";
import DeleteEvent from "../User/DeleteEvent";
import { XIcon } from "lucide-react";

const EventCard = ({ event, onDeleteEvent, onEditEvent }) => {
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
    isCancelled = false,
    discount = null,
    category = [],
    status,
  } = event;

  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [modalVisibleD, setModalVisibleD] = useState(false); // Control delete modal visibility
  const [eventId, setEventId] = useState(null); // Control event ID

  // Function to handle rejecting the event
  const handleRejectClick = async (id) => {
    try {
      await EditEventStatus(id, -1); // Set status to -1 (rejected)
      //onEditEvent(); // Refresh the event status
      alert("Event rejected successfully!");
    } catch (error) {
      console.error("Error rejecting event:", error);
      alert("Error rejecting event");
    }
  };

  // Function to handle approving the event
  const handleApproveClick = async (id) => {
    try {
      await EditEventStatus(id, 1); // Set status to 1 (approved)
      //onEditEvent(); // Refresh the event status
      alert("Event approved successfully!");
    } catch (error) {
      console.error("Error approving event:", error);
      alert("Error approving event");
    }
  };

  // Function to handle event deletion
  const handleDelete = () => {
    onDeleteEvent(event_id); // Trigger event delete
    setModalVisibleD(false);
  };

  return (
    <div className="relative text-decoration-none bg-white">
      <div className="relative rounded-lg w-80 border p-2 transition-transform transform hover:bg-gray-100">
        <div className="flex flex-col h-full items-start space-y-4">
          {/* Image Section */}
          <div className="relative flex justify-center w-full">
            <div className="relative">
              <img
                className="mx-auto aspect-video rounded-xl object-cover w-full h-40"
                src={images[0]}
                alt={title}
              />
              <p
                className={`absolute top-0 ${
                  !isPaid ? "bg-blue-600" : "bg-green-600"
                } text-white font-semibold py-1 px-3 rounded-br-lg rounded-tl-lg`}
              >
                {!isPaid ? "FREE" : `$${ticketPrice}`}
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
            <div className="flex mt-1 items-center space-x-2">
              <OrganizerIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">{eventAuthor}</small>
            </div>

            {/* Date and Time */}
            <div className="flex mt-2 items-center space-x-2">
              <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">
                {date} {startTime} - {endTime}
              </small>
            </div>

            {/* Location */}
            <div className="flex mt-2 items-center space-x-2">
              <LocateIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">{location}</small>
            </div>

            {/* Categories */}
            <div className="flex mt-2 items-center space-x-2">
              <CategoryIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">
                Categories:{" "}
                {category?.map((cat) => cat.name).join(", ") || "N/A"}
              </small>
            </div>

            {/* Attendees */}
            <div className="flex mt-2 items-center space-x-2">
              <AttendeesIcon className="h-4 w-4 text-gray-500" />
              <small className="text-sm text-gray-500">
                {currentAttendees}/{maxAttendees || "Unlimited"} Attendees
              </small>
            </div>

            {/* Food Stalls */}
            {food_stalls && (
              <div className="flex mt-2 items-center space-x-2">
                <FoodIcon className="h-4 w-4 text-gray-500" />
                <small className="text-sm text-gray-500">
                  Food Stalls Available
                </small>
              </div>
            )}

            {/* Ticket Info */}
            <div className="flex mt-2 items-center space-x-2">
              {isCancelled ? (
                <>
                  <XIcon className="h-4 w-4 text-red-500" />
                  <small className="text-sm text-red-500 font-bold">
                    Event Canceled
                  </small>
                </>
              ) : (
                <>
                  <TicketIcon className="h-4 w-4 text-green-600" />
                  <small className={`text-sm font-bold text-green-600`}>
                    Ticket Price: ${ticketPrice}
                  </small>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {!isCancelled ? (
              <div className="mt-3 w-full flex space-x-2">
                <button
                  onClick={() => handleRejectClick(event_id)}
                  className="self-start inline-flex justify-center text-xl w-full bg-red-500 hover:bg-yellow-600 text-white py-2 rounded-xl shadow-md transition duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveClick(event_id)}
                  className="self-start inline-flex justify-center text-xl w-full bg-green-500 hover:bg-red-600 text-white py-2 rounded-xl shadow-md transition duration-200"
                >
                  Approve
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {/* Delete Event Modal */}
      {modalVisibleD && (
        <DeleteEvent
          modalVisible={modalVisibleD}
          setModalVisible={setModalVisibleD}
          onDeleteEvent={handleDelete}
        />
      )}
    </div>
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
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2C6.5 2 2 6.5 2 12v8c0 1.5 1.5 2 2 2h16c1.5 0 2-.5 2-2v-8c0-5.5-4.5-10-10-10z" />
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
      <rect width="6" height="6" x="3" y="3" rx="2" />
      <rect width="6" height="6" x="15" y="3" rx="2" />
      <rect width="6" height="6" x="9" y="15" rx="2" />
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
      <path d="M12 20v-6M6 20v-6M18 20v-6M2 10h20" />
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
      <path d="M12 7v10" />
      <path d="M5 12h14" />
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
      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6z" />
      <path d="M8 10l4 4M12 10l4 4" />
    </svg>
  );
}

export default EventCard;
