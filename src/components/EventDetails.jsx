import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaEnvelope } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel'; // Import the carousel

const EventDetails = () => {
  const { eventId } = useParams(); // Get the eventId from the route parameters
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
        console.log(data.data)
        setEvent(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!event) return <p>No event found</p>;

  const {
    title,
    date,
    startTime,
    endTime,
    location,
    eventAuthor,
    ticketPrice,
    description,
    images,
    isPaid,
    category,  // Categories array
    maxAttendees,
    currentAttendees,
    email
  } = event;

  const headerImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/350x150';
  const carouselImages = images && images.length > 1 ? images.slice(1) : [];
  const organizerImage = eventAuthor?.profilePicture || 'https://via.placeholder.com/100';

  return (
    <div className="container mx-auto p-4">
      {/* Header Image */}
      <div className="relative mb-4">
        <img src={headerImage} alt={title} className="w-full rounded-lg shadow-md h-96 object-cover" />
        <h1 className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg text-2xl font-bold">
          {title}
        </h1>
      </div>

      {/* Event Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Event Title and Date */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-5xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-600">{date}, {startTime} - {endTime}</p>
          </div>
          <div className="text-right">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">{isPaid ? `Buy Ticket for R${ticketPrice}` : 'Get Ticket'}</button>
            <span className="block font-semibold text-green-600 mt-2">{currentAttendees}/{maxAttendees || ''} Going</span>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center mb-6">
          <img src={organizerImage} alt="Organizer" className="w-16 h-16 rounded-full object-cover mr-4" />
          <div>
            <h5 className="text-lg font-semibold">Organizer: {eventAuthor || 'Anonymous'}</h5>
            <p className="text-gray-600"><FaEnvelope className="inline-block mr-1" /> {email || 'No email available'}</p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Event Categories */}
        <div className="mb-6">
          <h5 className="text-lg font-bold text-gray-800 mb-2">Categories</h5>
          <div  className="flex flex-wrap space-x-2">
            {category && category.length > 0 ? (
              category.map((cat) => (
                <span key={cat._id} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm">
                  {cat.name}
                </span>
              ))
            ) : (
              <span className="text-gray-600">No categories available</span>
            )}
          </div>
        </div>


        <hr className="my-4" />

        {/* Event Description */}
        <div className="mb-6">
          <h5 className="text-xl font-bold text-gray-800 mb-2">About the Event</h5>
          <p className="text-gray-600">{description}</p>
        </div>

        <hr className="my-4" />
        {/* Carousel for additional images */}
        <div className="container mx-auto my-6">
          <h5 className="text-xl font-bold text-gray-800 mb-2">Event Highlights</h5>
          <p className="text-gray-600 text-m mb-5">
            Explore some memorable moments and glimpses of {"what's"} to come at this event. Take a look at our event highlights through these featured images.
          </p>
          <ImageCarousel images={carouselImages} />
        </div>

        <hr className="my-4" />

        {/* Event Location */}
        <div className="mb-6">
          <h5 className="text-lg font-bold text-gray-800 mb-2"><FaMapMarkerAlt className="inline-block mr-2" /> Event Location</h5>
          <div className="w-full h-64">
            <iframe
              width="100%"
              height="100%"
              className="rounded-lg"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
              allowFullScreen
              title="Event Location"
            ></iframe>
          </div>
        </div>

        {/* Ticket Section */}
        <div className="mt-6">
          <button className={`w-full py-3 rounded-lg text-white font-bold transition ${isPaid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isPaid ? `Buy Ticket for R${ticketPrice}` : 'Get Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
