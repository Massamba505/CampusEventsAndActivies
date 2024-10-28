import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventDetails from '../components/EventDetails';
import { myConstant } from '../const/const';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
// Mock the fetch function
global.fetch = vi.fn();

describe('EventDetails', () => {
  const mockEvent = {
    title: 'Test Event',
    date: '2024-10-30',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    location: 'Test Location',
    eventAuthor: 'Author Name',
    ticketPrice: 100,
    description: 'This is a test event.',
    images: ['image1.jpg', 'image2.jpg'],
    isPaid: true,
    category: [{ _id: 'cat1', name: 'Category 1' }],
    maxAttendees: 100,
    currentAttendees: 50,
    profile_picture: '',
    email: 'author@example.com',
  };
  

  beforeEach(() => {
    fetch.mockClear();

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ token: 'your_test_token' })),
      setItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <EventDetails />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

 

  it('handles error state', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error: Failed to fetch event'));
  });

 

});
