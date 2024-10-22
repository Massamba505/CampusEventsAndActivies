import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EventList from '../components/EventList'; // Adjust path according to your file structure
import React from 'react';

describe('EventList Component', () => {
  
  it('should display "No events found" when no events are passed', () => {
    const { getByText } = render(<EventList events={[]} />);
    expect(getByText('No events found')).toBeDefined();
  });

  it('should render the correct number of EventCard components', () => {
    const mockEvents = [
      { event_id: 1, name: 'Event 1', description: 'Description 1', date: '2024-10-12' },
      { event_id: 2, name: 'Event 2', description: 'Description 2', date: '2024-10-13' }
    ];

    const { getAllByTestId } = render(<EventList events={mockEvents} />);
    
    const eventCards = getAllByTestId('event-card');
    expect(eventCards.length).toBe(2);
  });
});
