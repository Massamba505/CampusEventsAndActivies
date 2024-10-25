import { render, screen, waitFor } from '@testing-library/react';
import UpcomingEvents from '../components/UpcomingEvents';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

// Mock the toast function from react-hot-toast
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
  },
}));

describe('UpcomingEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <UpcomingEvents />
      </BrowserRouter>
    );
  };

  it('renders loading spinner initially', () => {
    renderComponent();
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('fetches and displays upcoming events', async () => {
    // Mock the fetch function
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                event_id: 1,
                title: 'Upcoming Event 1',
                date: '2024-10-23',
                startTime: '10:00 AM',
                endTime: '12:00 PM',
                eventAuthor: 'Organizer 1',
                location: 'Location 1',
                images: ['image-url-1'],
                isPaid: true,
                ticketPrice: 100,
              },
              {
                event_id: 2,
                title: 'Upcoming Event 2',
                date: '2024-10-24',
                startTime: '01:00 PM',
                endTime: '03:00 PM',
                eventAuthor: 'Organizer 2',
                location: 'Location 2',
                images: ['image-url-2'],
                isPaid: false,
                ticketPrice: 0,
              },
            ],
          }),
      })
    );

    renderComponent();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for the upcoming events rendered
    expect(screen.getByText(/Upcoming Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Event 2/i)).toBeInTheDocument();
  });

  it('shows an error message when fetch fails', async () => {
    // Mock fetch to simulate an error response
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    renderComponent();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Verify that an error toast is shown
    expect(toast.error).toHaveBeenCalledWith('Error fetching events');
    expect(screen.getByText(/Error fetching events/i)).toBeInTheDocument();
  });

  it('displays a message when there are no upcoming events', async () => {
    // Mock the fetch function to return no events
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [],
          }),
      })
    );

    renderComponent();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for the no events message
    expect(screen.getByText(/No upcoming events available/i)).toBeInTheDocument();
  });
});
