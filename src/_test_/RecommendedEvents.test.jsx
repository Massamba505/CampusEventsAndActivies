import { render, screen, waitFor } from '@testing-library/react';
import RecommendedEvents from '../components/RecommendedEvents';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        count: 2,
        data: [
          {
            event_id: 1,
            title: 'Event1',
            date: '2024-10-23',
            startTime: '10:00 AM',
            endTime: '12:00 PM',
            eventAuthor: 'Organizer 1',
            location: 'Location 1',
            images: ['image-url-1'],
            isPaid: true,
            ticketPrice: 100
          },
          {
            event_id: 2,
            title: 'Event2',
            date: '2024-10-24',
            startTime: '01:00 PM',
            endTime: '03:00 PM',
            eventAuthor: 'Organizer 2',
            location: 'Location 2',
            images: ['image-url-2'],
            isPaid: false,
            ticketPrice: 0
          }
        ]
      }),
    })
);

describe('RecommendedEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockLocalStorage = {
      getItem: vi.fn().mockImplementation((key) => {
        if (key === 'events-app') {
          return JSON.stringify({ token: 'mockToken' }); // Return a mock token
        }
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  it('renders loading spinner initially', () => {
    render(
      <BrowserRouter>
        <RecommendedEvents />
      </BrowserRouter>
    );
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('fetches and displays events', async () => {
    render(
      <BrowserRouter>
        <RecommendedEvents />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Debug the current screen
    screen.debug(); // Check what is rendered

    // Check for event titles rendered in the ShortEventCard
    expect(screen.getByText(/Event1/i)).toBeInTheDocument();
    expect(screen.getByText(/Event2/i)).toBeInTheDocument();
  });

  it('shows an error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    render(
      <BrowserRouter>
        <RecommendedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Error fetching events');
  });

  it('handles no preferences case', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ count: 0, data: [] }) }));
    render(
      <BrowserRouter>
        <RecommendedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Go to your profile and enter your preferences/i)).toBeInTheDocument();
  });
});
