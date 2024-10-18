import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

// Import the icons
import restaurantIcon from '../assets/icons/restaurant.png';
import lectureIcon from '../assets/icons/lecture.png';
import examIcon from '../assets/icons/exam.png';

const MapComponent = ({ details, location }) => {
  const [rentals, setRentals] = useState([]);
  const [pois, setPois] = useState([]);

  // Function to return the correct icon based on type
  const customIcon = (type) => {
    let iconUrl;
    switch (type) {
      case 'Restaurant':
        iconUrl = restaurantIcon;
        break;
      case 'Lecture':
        iconUrl = lectureIcon;
        break;
      case 'Exam':
        iconUrl = examIcon;
        break;
      default:
        iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
    }

    return new L.Icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  // Fetch rentals
  const fetchRentals = async () => {
    const response = await fetch("https://gateway.tandemworkflow.com/api/v1/rental/rentals");
    const data = await response.json();
    setRentals(data);
  };

  // Fetch POIs
  const fetchPois = async () => {
    const response = await fetch("https://gateway.tandemworkflow.com/api/v1/navigation/poi");
    const data = await response.json();
    setPois(data);
  };

  useEffect(() => {
    fetchRentals();
    fetchPois();
  }, []);

  const getPoiByPickupPoint = (pickupPoint) => {
    if (pickupPoint === undefined) {
      return undefined; // or handle the case as needed
    }
    return pois.find(poi => poi.name.includes(pickupPoint) || pickupPoint.includes(poi.name));
  };

  location = location.split(",").map(coord => parseFloat(coord));

  return (
    <MapContainer center={[-26.1903, 28.0256]} zoom={15} style={{ height: '30em', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <Marker position={location} icon={customIcon('Location')}>
        <Popup>
          {`Location: ${details.name}`} <br />
          {`Capacity: ${details.capacity}`}
        </Popup>
      </Marker>

      {rentals.map(rental => {
        const poi = getPoiByPickupPoint(rental.pickupPoint);
        if (poi) {
          const { latitude, longitude } = poi.coordinates;
          return (
            <Marker
              key={rental._id}
              position={[latitude, longitude]}
              icon={customIcon(poi.type)}
            >
              <Popup>
                {`Rental Amount: ${rental.amount}`} <br />
                {`Pickup Point: ${rental.pickupPoint}`} <br />
                {`Rented on: ${new Date(rental.rentTimestamp).toLocaleString()}`}
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
      
    </MapContainer>
  );
};

export default MapComponent;