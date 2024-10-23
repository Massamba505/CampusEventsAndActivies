import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EventCard from '../components/EventCard'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

describe('EventCard Component', () => {
  const mockEvent = {
    name: 'Sample Event',
    description: 'This is a sample event description.',
    date: '2024-10-23',
  };

  it('renders event details correctly', () => {
    render(<EventCard event={mockEvent} />);

    // Check if the event card is in the document
    const eventCard = screen.getByTestId('event-card');
    expect(eventCard).toBeInTheDocument();

    // Check if the event name is rendered
    expect(screen.getByText(mockEvent.name)).toBeInTheDocument();

    // Check if the event description is rendered
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();

    // Check if the event date is rendered
    expect(screen.getByText(mockEvent.date)).toBeInTheDocument();
  });

});
