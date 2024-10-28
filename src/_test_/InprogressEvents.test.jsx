import { render, screen, waitFor } from '@testing-library/react';
import InprogressEvents from '../components/InprogressEvents';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import toast from 'react-hot-toast';

// Mock the toast function from react-hot-toast
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
  },
}));

describe('InprogressEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('renders loading spinner initially', () => {
    render(
      <BrowserRouter>
        <InprogressEvents />
      </BrowserRouter>
    );
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('fetches and displays in progress events', async () => {
    // Mock the fetch function
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                event_id: 1,
                title: 'In Progress Event 1',
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
                title: 'In Progress Event 2',
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

    render(
      <BrowserRouter>
        <InprogressEvents />
      </BrowserRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for the in-progress events rendered
    expect(screen.getByText(/In Progress Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress Event 2/i)).toBeInTheDocument();
  });

  it('shows an error message when fetch fails', async () => {
    // Mock fetch to simulate an error response
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(
      <BrowserRouter>
        <InprogressEvents />
      </BrowserRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Verify that an error toast is shown
    expect(toast.error).toHaveBeenCalledWith('Error fetching events');
  });

  /*it('displays a message when there are no in-progress events', async () => {
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

    render(
      <BrowserRouter>
        <InprogressEvents />
      </BrowserRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for the no events message
    expect(screen.getByText(/There are no available in progress events/i)).toBeInTheDocument();
  });*/
});
