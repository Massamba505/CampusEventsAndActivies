import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EditEvent from '../components/User/EditModal'; // Adjust the import path as necessary
import { Dialog } from '@headlessui/react';
import '@testing-library/jest-dom';

// Mock the fetch API globally
global.fetch = vi.fn();

describe('EditEvent Component', () => {
  const mockEventId = '1';
  const mockSetModalVisible = vi.fn();
  const mockOnUpdate = vi.fn();

  const mockEventData = {
    title: "Sample Event",
    description: "This is a sample event.",
    location: "New York",
    date: "2024-10-23",
    start_time: "10:00",
    end_time: "12:00",
    is_paid: true,
    ticket_price: 20,
    max_attendees: 100,
    category: ["category1"],
    discount: 10,
    food_stalls: true,
  };

  beforeEach(() => {
    // Reset mocks
    mockSetModalVisible.mockClear();
    mockOnUpdate.mockClear();

    // Mock local storage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => JSON.stringify({ token: 'mockToken123' })),
      },
      writable: true,
    });
  });

  it('renders correctly with provided props', async () => {
    // Mock the fetch response for event data
    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ data: mockEventData }),
    });

    render(
      <EditEvent
        eventId={mockEventId}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onUpdate={mockOnUpdate}
      />
    );

    // Check if the title is rendered
    expect(screen.getByText(/Edit Event/i)).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

  it('handles form input changes correctly', async () => {
    // Mock the fetch response for event data
    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ data: mockEventData }),
    });

    render(
      <EditEvent
        eventId={mockEventId}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onUpdate={mockOnUpdate}
      />
    );

    // Input changes
    fireEvent.change(screen.getByLabelText(/event title/i), { target: { value: 'Updated Event Title' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Los Angeles' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Updated description' } });

    expect(screen.getByLabelText(/event title/i).value).toBe('Updated Event Title');
    expect(screen.getByLabelText(/location/i).value).toBe('Los Angeles');
    expect(screen.getByLabelText(/description/i).value).toBe('Updated description');
  });

});
