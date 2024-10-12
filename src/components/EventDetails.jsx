import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel'; // Import the carousel
import { myConstant } from '../const/const';
import Navbar from './Navbar';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { eventId } = useParams(); // Get the eventId from the route parameters
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];
  const [coords,setCoords]=useState("");
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(myConstant + `/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
        setEvent(data.data);
        //console.log(event.location);
        //console.log(data.data.location);
        if (data.data.location){
          let out=await fetchVenue(data.data.location);
          console.log(out);
          setCoords(out);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchVenue = async (where) => {
      try {
        const response = await fetch(myConstant + `/api/venues/${where}`,
          {
            method:"GET",
            headers:{
              "Authorization":`Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
        if (!response.ok) {
          //throw new Error('Failed to fetch Venues');
          console.log("Venue not found");
          return where;
        }
        const data = await response.json();
        console.log(data);
        if (data.location){
          return `${data.location[0]},${data.location[1]}`;
        }
        
      } catch (error) {
        console.error('Error fetching Venues:', error);
        //toast.error('Error fetching Venues');
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
    discount = 0,
    profile_picture,
    email,
  } = event;
  
  // Initialize Stripe
  const stripePromise = loadStripe("pk_test_51Q5JRhGx52yvRFk8wYiDUQ0qC2bWSul1gvALpu09WQBTsiJxW3l4NaRq5puPjoJbCpCELOBTa23B3QMp2LKxVAyC00eoeGmm9O");
  const headerImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/350x150';
  const carouselImages = images && images.length > 1 ? images.slice(1) : [];
  const organizerImage = profile_picture || 'https://via.placeholder.com/100';

  // Function to handle ticket purchase or RSVP
  const handleTickets = async () => {
    const token = JSON.parse(localStorage.getItem('events-app'))["token"];
    const ticketType = isPaid ? 'Paid' : 'RSVP';
    const price = isPaid ? ticketPrice : 0;
    try {
      const response = await fetch(myConstant + '/api/tickets/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify({
          eventId,
          ticketType,
          price,
          eventDate: date, // Or format it as needed
        }),
      });
  
      if (!response.ok){
        const data = await response.json();
        throw new Error(data.error);
      }
  
      const data = await response.json();
  
      if (isPaid) {
        const { sessionId } = data;

        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });
        setError(error);
      } else {
        const { ticket } = data;
        navigate(`/tickets/success?session_id=${ticket._id}`);
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast.error(error.message)
    }
  };

  return (
    <div>
      <Navbar/>   
      <div className="container mx-auto">
        {/* Header Image */}
        <div className="relative mb-4">
          <img src={headerImage} alt={title} className="w-full rounded-lg shadow-md h-96 object-cover" />
          <h1 className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg text-2xl font-bold">
            {title}
          </h1>
        </div>

        {/* Event Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">{title}</h1>
          {/* Event Title and Date */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center mt-1 space-x-1">
                <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                <small className="text-xs font-semibold text-gray-500">{date}</small>
              </div>
              <div className="flex items-center mt-1 space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 21" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-gray-500 m-0 p-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <small className="text-xs font-semibold text-gray-500">{startTime} - {endTime}</small>
              </div>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-5 w-5 text-gray-500 m-0 p-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <small className="text-xs font-semibold text-gray-500">Organizer: {eventAuthor}</small>
              </div>
              <div className="flex items-center mt-1 space-x-1">
                <LocationIcon className="h-4 w-4 text-gray-500" />
                <small className="text-xs font-semibold text-gray-500">{location}</small>
              </div>
            </div>
            <div className="text-right">
              <button onClick={handleTickets} className={`${isPaid ? "bg-green-500 hover:bg-green-600" : 'bg-blue-500 hover:bg-blue-600'}   text-xs  sm:text-lg  text-white py-2 px-3 sm:px-4 rounded-lg`}>
                {isPaid ? `Buy Ticket for R${ticketPrice}` : 'Get Ticket'}
              </button>
              {discount > 0 && (
                <>
                  <span className="block text-xs sm:text-lg font-semibold text-gray-600 mt-2">{discount}% dicount</span>
                  <span className="block text-xs sm:text-lg text-decoration-line-through decoration-black font-bold text-blue-400 mt-2">R{parseFloat((ticketPrice - ((discount*0.01)* ticketPrice)).toFixed(2))}</span>
                </>
              )}
              <span className="block text-xs sm:text-lg font-semibold text-green-600 mt-2">{currentAttendees}/{maxAttendees || ''} Attendance</span>
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
            <div className="flex flex-wrap space-x-2">
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
            <div className="event-description">
              {description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
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
            <h5 className="text-lg font-bold text-gray-800 mb-2"><FaMapMarkerAlt className="inline-block mr-1" /> Event Location</h5>
            <div className="w-full h-64">
              <iframe
                width="100%"
                height="100%"
                className="rounded-lg"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(coords)}&output=embed`}
                allowFullScreen
                title="Event Location"
              ></iframe>
            </div>
          </div>

          {/* Ticket Section */}
          <div className="mt-6">
            <button onClick={handleTickets} className={`w-full py-3 rounded-lg text-white font-bold transition ${isPaid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isPaid ? `Buy Ticket for R${ticketPrice}` : 'Get Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

// Helper Icons
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
