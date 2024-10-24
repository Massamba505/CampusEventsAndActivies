import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Calendar from '../components/Calender/Calender'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

describe('Calendar Component', () => {
  // Mock props to pass to the Calendar component
  const mockEvents = [
    {
      title: 'Event 1',
      start: new Date(2024, 9, 1, 10, 0), // October 1, 2024, 10:00 AM
      end: new Date(2024, 9, 1, 12, 0), // October 1, 2024, 12:00 PM
    },
    {
      title: 'Event 2',
      start: new Date(2024, 9, 2, 14, 0), // October 2, 2024, 2:00 PM
      end: new Date(2024, 9, 2, 16, 0), // October 2, 2024, 4:00 PM
    },
  ];

  beforeEach(() => {
    // Reset any necessary state before each test
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Calendar events={mockEvents} />);

    // Check if the calendar is in the document
    expect(screen.getByRole('table')).toBeInTheDocument(); // Check for heading
  });

  it('displays events passed as props', () => {
    render(<Calendar events={mockEvents} />);

    // Check if the event titles are in the document
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  // it('handles empty events array gracefully', () => {
  //   render(<Calendar events={[]} />);

  //   // Check if a message or an empty calendar is displayed
  //   expect(screen.getByText('No events')).toBeInTheDocument(); // Adjust based on your actual implementation
  // });

  // Add more tests as necessary
});
