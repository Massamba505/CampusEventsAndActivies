import { useState } from "react";
import truncateString from "../../utils/truncate";
import { XIcon } from "lucide-react";

const EventCard = ({ event, onReject, onApprove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    description, // Assuming event has a description field
  } = event;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div
        className="relative text-decoration-none bg-white"
        onClick={openModal}
      >
        <div className="relative rounded-lg w-[300px] sm:w-80 border p-2 transition-transform transform hover:bg-gray-100 cursor-pointer">
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
              {/* Additional Info */}
              <div className="flex mt-1 items-center space-x-2">
                <small className="text-sm text-gray-500">{eventAuthor}</small>
              </div>
              <div className="flex mt-2 items-center space-x-2">
                <small className="text-sm text-gray-500">
                  {date} {startTime} - {endTime}
                </small>
              </div>
              <div className="flex mt-2 items-center space-x-2">
                <small className="text-sm text-gray-500">{location}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 sm:w-3/4 lg:w-1/2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{title}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <img
                className="aspect-video rounded-lg w-full h-48 object-cover"
                src={images[0]}
                alt={title}
              />
              <p className="text-gray-700">
                <strong>Organizer:</strong> {eventAuthor}
              </p>
              <p className="text-gray-700">
                <strong>Date & Time:</strong> {date} {startTime} - {endTime}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> {location}
              </p>
              <p className="text-gray-700">
                <strong>Attendees:</strong> {currentAttendees}/
                {maxAttendees || "Unlimited"}
              </p>
              <p className="text-gray-700">
                <strong>Categories:</strong>{" "}
                {category?.map((cat) => cat.name).join(", ") || "N/A"}
              </p>
              {food_stalls && (
                <p className="text-gray-700">
                  <strong>Food Stalls:</strong> Available
                </p>
              )}
              {!isCancelled ? (
                <p className="text-green-600">
                  <strong>Ticket Price:</strong> ${ticketPrice}
                </p>
              ) : (
                <p className="text-red-600 font-bold">Event Canceled</p>
              )}

              {/* Event Description */}
              <p className="text-gray-700">
                <strong>Description:</strong> {description || "No description available."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => onReject(event_id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(event_id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
