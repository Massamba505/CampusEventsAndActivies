import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom'; // Import for extended matchers
import DayView from '../components/Calender/DayView'; // Adjust the path as necessary
import React from 'react';

describe('DayView Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn(); // Mock the fetch function
    global.scrollTo = vi.fn(); // Mock scrollTo function
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocks after each test
  });

  it('should display "No events available" when there are no events on the selected date', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        data: [], // Simulate no events
      }),
    });

    const testDate = '12/10/2024';

    render(<DayView date={testDate} />);

    await waitFor(() => {
      expect(screen.getByText(/No events available/i)).toBeInTheDocument(); // Match the actual message
    });
  });

  it('should display a list of events for the selected date', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        data: [
          {
            title: 'Event 1',
            date: '12/10/2024',
            startTime: '10:00 AM',
            endTime: '11:00 AM',
          },
          {
            title: 'Event 2',
            date: '12/10/2024',
            startTime: '12:00 PM',
            endTime: '1:00 PM',
          },
        ],
      }),
    });

    const testDate = '12/10/2024';

    render(<DayView date={testDate} />);

    await waitFor(() => {
      expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
      expect(screen.getByText(/10:00 AM to 11:00 AM/i)).toBeInTheDocument();
      expect(screen.getByText(/Event 2/i)).toBeInTheDocument();
      expect(screen.getByText(/12:00 PM to 1:00 PM/i)).toBeInTheDocument();
    });
  });
});
