import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';
// import './styles/EventDetails.css'; // Ensure you have this file for custom styles

const EventDetails = () => {
  const { eventId } = useParams(); // Get the event eventId from the route parameters
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
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
  } = event;

  const imageUrl = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/350x150';
  const hostImage = images && images.length >= 2 ? images[1] : 'https://via.placeholder.com/150';

  return (
    <Container className="mt-4">
      <Card className="shadow-lg p-3 mb-5 bg-white rounded">
        <Card.Img variant="top" src={imageUrl} alt={title} />
        <Card.Body>
          <Row>
            <Col>
              <h2>{title}</h2>
              <p className="text-muted">{date}, {startTime} - {endTime}</p>
            </Col>
            <Col className="text-end">
              <Button variant="outline-primary" className="me-2">Invite</Button>
              <span className="fw-bold">+20 Going</span>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <h5><i className="bi bi-geo-alt-fill"></i> {location}</h5>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={2}>
              <Image src={hostImage} roundedCircle alt="Host" />
            </Col>
            <Col>
              <h5>About Event</h5>
              <p>
                <strong>{eventAuthor?.name}</strong>, {eventAuthor?.profession}
              </p>
              <Button variant="primary">Follow</Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <p>{description}</p>
            </Col>
          </Row>
          <Row className="my-3">
            <h5>Location</h5>
            <div style={{ width: '100%', height: '300px' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                allowFullScreen
                title="Event Location"
              ></iframe>
            </div>
          </Row>
          <Button variant="primary" className="mt-3 w-100">
            Buy Ticket {ticketPrice ? `R${ticketPrice}` : 'Free'}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventDetails;
