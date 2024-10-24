import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MyEvents from '../components/User/MyEvents';
import { myConstant } from '../const/const';
import { toast } from 'react-hot-toast';
import '@testing-library/jest-dom';

// Mock toast for displaying notifications
vi.mock('react-hot-toast', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));
vi.mock(import("react-hot-toast"), async (importOriginal) => {
    const actual = await importOriginal()
    return {
        toast: {
            error: vi.fn(),
            success: vi.fn(),
        },
      // your mocked methods
    }
  })
// Mock child component EventCard
vi.mock('./EventCard', () => ({
  default: ({ event, onDeleteEvent }) => (
    <div>
      <h2>{event.title}</h2>
      <button onClick={() => onDeleteEvent(event.event_id)}>Delete</button>
    </div>
  ),
}));

// Mock toast notifications
vi.mock('./EventCard', () => ({
    default: ({ event, onDeleteEvent }) => (
      <div>
        <h2>{event.title}</h2>
        <button onClick={() => onDeleteEvent(event.event_id)}>Delete</button>
      </div>
    ),
}));


// Mock localStorage token
beforeEach(() => {
    localStorage.setItem(
        'events-app',
        JSON.stringify({ token: 'mocked_token' })
    );
});

describe('MyEvents Component', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  it('should render loading spinner initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<MyEvents />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
  });

  it('should fetch and display events', async () => {
    const mockEvents = [
      {
        event_id: 1,
        title: 'Event 1',
      },
      {
        event_id: 2,
        title: 'Event 2',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    render(<MyEvents />);

    await waitFor(() => {
      expect(screen.getByText(/My Events/i)).toBeInTheDocument();
    });

    // Check if the events are displayed
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('should show an error message if the fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to fetch events.' }),
    });

    render(<MyEvents />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch events.');
      expect(screen.getByText(/You haven't created any events yet./i)).toBeInTheDocument();
    });
  });

});
