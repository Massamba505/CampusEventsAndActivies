import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel'; // Import the carousel
import { myConstant } from '../const/const';
import Navbar from './Navbar';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { UserIcon } from 'lucide-react';
import ReportIncident from './ReportIncident';
import MapComponent from './MapComponent';
import loadingGif from '../assets/loading.gif'

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState({
    name:"",
    capacity:0
  });
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];
  const [coords,setCoords]=useState("");
  const [busRoutes,setBusRoutes]=useState([]);
  const [show_report,setShow_report]=useState(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(myConstant + `/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
        setEvent(data.data);
        //console.log(event.location);
        //console.log(data.data);
        if (data.data.location){
          let out=await fetchVenue(data.data.location);
          //console.log(out);
          setCoords(out);
        }
        if (data.data.date && data.data.startTime && data.data.endTime) {
            // Parse the event date in DD/MM/YYYY format
            const [day, month, year] = data.data.date.split('/').map(Number);
            const eventDate = new Date(year, month - 1, day); // Note: month is 0-indexed in JavaScript
        
            // Parse start and end times in HH:MM format
            const [startHour, startMinute] = data.data.startTime.split(':').map(Number);
            const [endHour, endMinute] = data.data.endTime.split(':').map(Number);
        
            // Create Date objects for the start and end times on the event date
            const startDateTime = new Date(eventDate);
            startDateTime.setHours(startHour, startMinute, 0, 0);
        
            const endDateTime = new Date(eventDate);
            endDateTime.setHours(endHour, endMinute, 0, 0);
        
            // Get the current date and time
            const currentDateTime = new Date();
            console.log(startDateTime);
            console.log(endDateTime);
            console.log(currentDateTime);
            // Check if the current date and time is within the event time range
            if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
                console.log("happening")  ;
              setShow_report(true);
            } else {
                setShow_report(false);
            }
        }
        if (data.data["date"]){
          let temp_date = data.data["date"].replace(/\//g, '-').split('-');
          temp_date = temp_date.reverse().join('-');
          //console.log(temp_date);
          fetchBusses(temp_date,data.data.startTime,data.data.endTime);
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
          console.log("Not a Wits Venue");
          return where;
        }
        const data = await response.json();
        if (data.location){
          setDetails({name:data.name,capacity:data.capacity});
          return `${data.location[0]},${data.location[1]}`;
        }
        
      } catch (error) {
        console.error('Error fetching Venues:', error);
        //toast.error('Error fetching Venues');
      }
    };
    const fetchBusses = async (targetDate,start,end) => {
      try {
        const response = await fetch(`https://gateway.tandemworkflow.com/api/v1/bus-schedule/?date=${targetDate}&startTime=${start}&endTime=${end}`);
        if (!response.ok) throw new Error('Failed to fetch Bus Schedule');
        const data = await response.json();
        //console.log(data);
        if (data){
          let temp=[];
          for (let i=0;i<data.length;i++){
            if (data[i].routeName.toString()==="Wits Juction to Education Campuse"){
              temp.push("Wits Juction to Education Campus");
              continue;
            }
            temp.push(data[i].routeName.toString());
          }
          //console.log(temp);
          setBusRoutes(temp);
        }
      } catch (error) {
        //setError(error.message);
        toast.error("Error fetching Busses.");
        setBusRoutes(["Error fetching Busses from transport API"]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId, token]);
  const externalToken = "eUVIYir4daJCIheDkj4p7Xwt8i5idhTRw6sSZlUTbIJtJHwgOc4xDqjubTkAPmPdoeK4cHoGXYsO15RvtR0ajiOscwuQzMoMmhCxjOlElvq0KiLVYyFzTtdKXo1EtPq1qjRdpMotdzw5VlKGO3m";

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <img src={loadingGif} width={50} alt="loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-warning" role="alert">
          Event Details not found
        </div>
      </div>
    );
  }

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
          <img src={headerImage} alt={title} className="w-full rounded-lg shadow-md h-40 sm:h-72 object-cover" />
          <h1 className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg text-2xl font-bold">
            {title}
          </h1>
          <div className='absolute top-2 right-2 text-white'>
            {show_report&&<ReportIncident
                incidentDetails={{
                  title: title,
                  date: date,
                  time: `${startTime} - ${endTime}`, 
                  location: location,
                  group: "events"
                }}
                token={externalToken}
              />}
          </div>
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
              {/* <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-5 w-5 text-gray-500 m-0 p-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <small className="text-xs font-semibold text-gray-500">{eventAuthor}</small>
              </div> */}
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
            <div className='flex flex-col'>
              <div className='flex gap-1'>
                <UserIcon className="h-8 w-5 text-gray-500" />
                <h5 className="text-lg font-semibold">{eventAuthor || 'Anonymous'}</h5>
              </div>
              <p className="text-gray-600 pl-1"><FaEnvelope className="inline-block mr-1" /> {email || 'No email available'}</p>
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
            <p className="text-gray-600 text-sm sm:text-base sm:mb-5">
              Explore some memorable moments and glimpses of {"what's"} to come at this event. Take a look at our event highlights through these featured images.
            </p>
            <ImageCarousel images={carouselImages} />
          </div>

          <hr className="my-4" />
          
          {/* Buses */}
          <div className="mb-6">
            <h5 className="text-lg font-bold text-gray-800 mb-2">Available Buses</h5>
            <div className="flex flex-wrap space-x-2">
              {busRoutes && busRoutes.length > 0 ? (
                busRoutes.map((cat) => (
                  <div key={cat} style={{display:'flex', flexDirection:'column'}}>
                  <span className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm" style={{width:'fit-content'}}>
                    {cat}
                  </span>
                  <span style={{height:'2px'}}></span>
                  </div>
                ))
              ) : (
                <span className="text-gray-600">No Buses available</span>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* Event Location */}
          {/* <div className="mb-6">
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
          </div> */}
          <MapComponent details={details} location={coords}/>
          
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
