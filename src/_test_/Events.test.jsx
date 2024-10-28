import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Events from '../components/Admin/Events';
import EditEventStatus from '../components/Admin/EditEventStatus';
import { myConstant } from '../const/const';
import '@testing-library/jest-dom';

// Mock localStorage
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: () => JSON.stringify({ token: 'mocked_token' }),
    },
    writable: true,
  });
});

// Mock fetch
global.fetch = vi.fn();

// Mock EditEventStatus function
vi.mock('../components/Admin/EditEventStatus', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('Events Component', () => {
  beforeEach(() => {
    // Clear previous fetch mocks
    fetch.mockClear();
    vi.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    render(<Events />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('fetches and displays events', async () => {
    const mockEvents = {
      data: [
        { event_id: '1', title: 'Event 1' },
        { event_id: '2', title: 'Event 2' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    render(<Events />);

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    expect(screen.getByText('Event Management')).toBeInTheDocument();
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  /*it('shows an error message when fetching fails', async () => {
    const mockError = { error: 'Failed to fetch events' };
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    render(<Events />);

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

console.log(screen.debug());

    expect(screen.getByText('Error fetching events')).toBeInTheDocument();
  });

  it('handles approve event action', async () => {
    const mockEvents = {
      data: [
        { event_id: '1', title: 'Event 1' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    render(<Events />);

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    const approveButton = screen.getByText('approve'); // Adjust based on your button text
    fireEvent.click(approveButton);

    // Ensure EditEventStatus was called
    expect(EditEventStatus).toHaveBeenCalledWith('1', 'approved');

    // Mock the EditEventStatus resolve
    EditEventStatus.mockResolvedValueOnce({ success: true });

    await waitFor(() => {
      expect(screen.queryByText('Event 1')).not.toBeInTheDocument(); // Check if event is removed
      expect(screen.getByText('Event approved successfully!')).toBeInTheDocument();
    });
  });

  it('handles reject event action', async () => {
    const mockEvents = {
      data: [
        { event_id: '1', title: 'Event 1' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    render(<Events />);

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    const rejectButton = screen.getByText('reject'); // Adjust based on your button text
    fireEvent.click(rejectButton);

    // Ensure EditEventStatus was called
    expect(EditEventStatus).toHaveBeenCalledWith('1', 'rejected');

    // Mock the EditEventStatus resolve
    EditEventStatus.mockResolvedValueOnce({ success: true });

    await waitFor(() => {
      expect(screen.getByText('Event rejected successfully!')).toBeInTheDocument();
    });
  });*/
});
