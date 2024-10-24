import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MyTickets from '../components/User/MyTickets';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import '@testing-library/jest-dom';
import { toast } from 'react-hot-toast';

// Mock token and tickets data
const mockToken = 'mock-token';
const mockTickets = [
  {
    _id: 'ticket1',
    ticket_type: 'General',
    price: 50.0,
    qr_code: 'https://example.com/qrcode1.png',
    event_date: '2024-11-25',
    payment_status: 'Paid',
    refund_status: 'Not Requested',
    event_id: 'event1',
  },
  {
    _id: 'ticket2',
    ticket_type: 'VIP',
    price: 100.0,
    qr_code: 'https://example.com/qrcode2.png',
    event_date: '2024-12-01',
    payment_status: 'Paid',
    refund_status: 'Not Requested',
    event_id: 'event2',
  },
];

// Mock localStorage and toast
vi.spyOn(global.localStorage, 'getItem').mockReturnValue(JSON.stringify({ token: mockToken }));
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MyTickets Component', () => {
  beforeEach(() => {
    // Mock localStorage
    localStorage.setItem(
      'events-app',
      JSON.stringify({ token: 'mocked_token' })
    );

    // Mock fetch calls
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/tickets')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTickets),
        });
      } else if (url.includes('/cancel')) {
        return Promise.resolve({ ok: true });
      } else if (url.includes('/refund')) {
        return Promise.resolve({ ok: true });
      } else {
        return Promise.reject(new Error('API error'));
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it('renders tickets fetched from API', async () => {
    render(
      <MemoryRouter> {/* Wrap in MemoryRouter */}
        <MyTickets />
      </MemoryRouter>
    );

    // Wait for fetch call and check if it was called with correct URL
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/tickets'), expect.any(Object)));

    // Check if ticket details are rendered
    expect(await screen.findByText(/General/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP/i)).toBeInTheDocument();
  });

  it('displays a message when no tickets are available', async () => {
    // Mock the API to return an empty list
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    }));

    render(
      <MemoryRouter> {/* Wrap in MemoryRouter */}
        <MyTickets />
      </MemoryRouter>
    );

    // Wait for fetch call and verify
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check for no tickets message
    expect(await screen.findByText(/You have no tickets/i)).toBeInTheDocument();
  });
});
