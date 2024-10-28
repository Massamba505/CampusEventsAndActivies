import { describe, it, expect, vi } from 'vitest';
import EditEventStatus from '../components/Admin/EditEventStatus';
import { myConstant } from '../const/const';

// Mock localStorage
beforeAll(() => {
  // Set up mock localStorage
  const mockToken = JSON.stringify({ token: 'mocked_token' });
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: () => mockToken,
    },
    writable: true,
  });
});

// Mock fetch
global.fetch = vi.fn();

describe('EditEventStatus', () => {
  it('should successfully update event status', async () => {
    const eventId = '123';
    const newStatus = 'approved';
    const mockResponse = { success: true, updatedStatus: newStatus };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await EditEventStatus(eventId, newStatus);

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`${myConstant}/api/events/${eventId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer mocked_token`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
  });

  it('should throw an error for invalid status', async () => {
    const eventId = '123';
    const newStatus = 'invalid-status';

    await expect(EditEventStatus(eventId, newStatus)).rejects.toThrow('Invalid status provided.');
  });

  it('should handle fetch errors gracefully', async () => {
    const eventId = '123';
    const newStatus = 'approved';
    const mockErrorResponse = { error: 'Network error' };

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    await expect(EditEventStatus(eventId, newStatus)).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalledWith(`${myConstant}/api/events/${eventId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer mocked_token`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
  });
});
