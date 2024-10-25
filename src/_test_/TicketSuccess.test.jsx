import { render, screen, waitFor } from '@testing-library/react';
import TicketSuccess from '../components/User/Stripe/TicketSuccess'; // Adjust the path as necessary
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest'; // Import vi for mocking
// Adjust the import based on your project structure

// Mock the AuthContext to prevent the auth error in Navbar
vi.mock('../context/AuthContext', () => ({
  useAuthContext: () => ({
    authUser: { username: 'testUser' }, // Mocked auth user
    setAuthUser: vi.fn(), // Mock setAuthUser function
  }),
}));



beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  // Mock localStorage with the required data for your Navbar
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'events-app') {
      return JSON.stringify({ token: 'mockToken' }); // Mock token value
    }
    return null;
  });

  global.fetch = vi.fn(); // Mock fetch for your tests
});

vi.mock('../components/Navbar', () => ({
  default: () => <div>Mocked Navbar</div>,
}));




describe('TicketSuccess Component', () => {
  it('should display no ticket details message if sessionId is not present', () => {
    render(
      <MemoryRouter initialEntries={['/ticket-success?session_id=']} >
        <TicketSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText(/No ticket details available./i)).toBeInTheDocument();
  });

  it('should display loading message while fetching ticket details', () => {
    render(
      <MemoryRouter initialEntries={['/ticket-success?session_id=123']} >
        <TicketSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading ticket details.../i)).toBeInTheDocument();
  });

  it('should display the SmallTicketCard if ticket details are available', async () => {
    // Mock the fetch call for successful ticket details
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ticket: {
          _id: 'ticket123',
          qr_code: 'path/to/qrcode.png',
          ticket_type: 'RSVP',
          price: 100,
          event_id: {
            event_id: 'event123',
            title: 'Test Event',
            date: '2024-10-24',
            start_time: '10:00 AM',
            end_time: '12:00 PM',
            location: 'Test Location'
          }
        }}),
      })
    );

    render(
      <MemoryRouter initialEntries={['/ticket-success?session_id=123']} >
        <TicketSuccess />
      </MemoryRouter>
    );

    // Wait for the ticket details to be displayed
    const ticketCard = await screen.findByText(/Test Event/i);
    expect(ticketCard).toBeInTheDocument();
    expect(screen.getByText(/ticket123/i));
  });

  it('should handle fetch error gracefully', async () => {
    // Mock the fetch call to return an error
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <MemoryRouter initialEntries={['/ticket-success?session_id=123']} >
        <TicketSuccess />
      </MemoryRouter>
    );

    // Wait for the loading state to complete
    await waitFor(() => expect(screen.getByText(/No ticket details available./i)).toBeInTheDocument());
  });
});
