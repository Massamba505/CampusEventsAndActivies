import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom'; // Import for extended matchers like toBeInTheDocument
import EventList from '../components/EventList'; // Adjust the path as necessary
import React from 'react';

describe('EventList Component', () => {
  it('should display "No events found" when the events list is empty or undefined', () => {
    // Render the component without events
    render(<EventList events={[]} />);
    
    // Check if the "No events found" message is displayed
    expect(screen.getByText(/No events found/i)).toBeInTheDocument(); // Now this matcher works
  });

  it('should render the correct number of EventCard components when events are passed', () => {
    const mockEvents = [
      {
        event_id: 1,
        title: 'Event 1',
        date: '2024-10-23',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
      },
      {
        event_id: 2,
        title: 'Event 2',
        date: '2024-10-24',
        startTime: '12:00 PM',
        endTime: '1:00 PM',
      },
    ];

    // Mock the EventCard component
    vi.mock('../components/EventCard', () => ({
      default: ({ event }) => <div>{event.title}</div>,
    }));

    // Render the component with the mock events
    render(<EventList events={mockEvents} />);

    // Assert that the correct number of event titles is displayed
    expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Event 2/i)).toBeInTheDocument();

    // Check the count of rendered EventCard components (or event titles in this case)
    const eventCards = screen.getAllByText(/Event/i);
    expect(eventCards.length).toBe(2); // Ensure there are 2 EventCard components
  });
});
