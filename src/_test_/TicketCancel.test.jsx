import { render, screen, waitFor, act } from '@testing-library/react';
import TicketCancel from '../components/User/Stripe/TicketCancel'; // Adjust the path as necessary
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the Navbar component
vi.mock('../components/Navbar', () => ({
  default: () => <div>Mocked Navbar</div>,
}));

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  // Mock the fetch function
  global.fetch = vi.fn();
});

describe('TicketCancel Component', () => {
  
  it('should display loading message while fetching ticket details', async () => {
    // Mock fetch to simulate loading
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    act(() => {
      render(
        <MemoryRouter initialEntries={['/ticket-cancel?session_id=123']}>
          <TicketCancel />
        </MemoryRouter>
      );
    });

    // Check for loading indicator
    expect(screen.getByText(/Canceling your payment.../i)).toBeInTheDocument();
  });

  it('should display success message after cancellation', async () => {
    // Mock the fetch call for successful cancellation
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/ticket-cancel?session_id=123']}>
          <TicketCancel />
        </MemoryRouter>
      );
    });

    // Wait for the success message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Payment Canceled/i)).toBeInTheDocument();
      expect(screen.getByText(/Your transaction has been canceled successfully./i)).toBeInTheDocument();
    });
  });

  it('should handle fetch error gracefully', async () => {
    // Mock the fetch call to return an error
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/ticket-cancel?session_id=123']}>
          <TicketCancel />
        </MemoryRouter>
      );
    });

    // Wait for the loading state to complete and check for error message
    await waitFor(() => {
      expect(screen.getByText(/Payment Canceled/i)).toBeInTheDocument(); // Ensure the success message still renders
      expect(screen.getByText(/Your transaction has been canceled successfully./i)).toBeInTheDocument();
    });
  });
});
