import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Wrap component with Router
import ShortEventCard from '../components/ShortEventCard';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('ShortEventCard', () => {
  const mockEvent = {
    title: 'Sample Event',
    date: '12/10/2024',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    eventAuthor: 'John Doe',
    location: '123 Event St.',
    images: ['sample-image-url.jpg'],
    isPaid: true,
    ticketPrice: 100,
    event_id: '1',
  };

  it('renders event title, date, and time correctly', () => {
    render(
      <Router>
        <ShortEventCard event={mockEvent} />
      </Router>
    );

    // Title
    expect(screen.getByText('Sample Event')).toBeInTheDocument();

    // Date
    expect(screen.getByText('12/10/2024')).toBeInTheDocument();

    // Time
    expect(screen.getByText('10:00 AM - 12:00 PM')).toBeInTheDocument();
  });

  it('renders organizer, location, and ticket price correctly', () => {
    render(
      <Router>
        <ShortEventCard event={mockEvent} />
      </Router>
    );

    // Organizer
    expect(screen.getByText(/Organizer: John Doe/i)).toBeInTheDocument();

    // Location
    expect(screen.getByText('123 Event St.')).toBeInTheDocument();

    // Ticket price
    expect(screen.getByText(/Ticket Price: R100/i)).toBeInTheDocument();
  });

  it('displays "Free Event" when the event is not paid', () => {
    const freeEvent = { ...mockEvent, isPaid: false };
    render(
      <Router>
        <ShortEventCard event={freeEvent} />
      </Router>
    );

    // Free event text
    expect(screen.getByText('Free Event')).toBeInTheDocument();
  });

  it('renders the event image with a valid URL', () => {
    render(
      <Router>
        <ShortEventCard event={mockEvent} />
      </Router>
    );

    // Check if image is rendered with the correct src
    const image = screen.getByAltText('Sample Event');
    expect(image).toHaveAttribute('src', 'sample-image-url.jpg');
  });

  it('renders placeholder image if no image is provided', () => {
    const eventWithoutImage = { ...mockEvent, images: [] };
    render(
      <Router>
        <ShortEventCard event={eventWithoutImage} />
      </Router>
    );

    // Check if placeholder image is used
    const image = screen.getByAltText('Sample Event');
    expect(image).toHaveAttribute('src', 'placeholder-image-url');
  });

  it('links to the correct event URL', () => {
    render(
      <Router>
        <ShortEventCard event={mockEvent} />
      </Router>
    );

    // Check the link
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/events/1');
  });
});
