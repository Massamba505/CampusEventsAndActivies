import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DayView from '../components/Calender/DayView';
import '@testing-library/jest-dom';
import React from 'react';
import moment from 'moment';

describe('DayView Component', () => {
  const testDate = '12/10/2024'; // Test date

  beforeEach(() => {
    global.fetch = vi.fn(); // Mock the global fetch function
    global.scrollTo = vi.fn(); // Mock scrollTo for the smooth scroll effect
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore mocks after each test
  });

  it('should display a loading spinner while events are being fetched', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<DayView date={testDate} />);

    // Check that loading spinner is visible
    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('should display "No events available" when there are no events for the selected date', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [], // No events
      }),
    });

    render(<DayView date={testDate} />);

    // Wait for the loading to finish
    await waitFor(() => {
      expect(screen.getByText(/No events available/i)).toBeInTheDocument();
    });
  });

  // it('should display a list of events for the selected date', async () => {
  //   global.fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({
  //       data: [
  //         {
  //           "event_id": 1052,
  //           "eventAuthor": "abc123 abc",
  //           "email": "abc123@gmail.com",
  //           "title": "Testing default status",
  //           "description": "No descripto",
  //           "location": "yes",
  //           "date": "12/10/2024",
  //           "startTime": "16:51",
  //           "endTime": "17:52",
  //           "isPaid": false,
  //           "ticketPrice": 0,
  //           "maxAttendees": 50,
  //           "currentAttendees": 0,
  //           "category": [],
  //           "status": "approved",
  //           "isCancelled": false,
  //           "discount": 0,
  //           "images": [
  //             "https://eventsimages.blob.core.windows.net/events/1729173156729.jpg"
  //           ]
  //         },
  //         {
  //           "event_id": 1051,
  //           "eventAuthor": "abc123 abc",
  //           "email": "abc123@gmail.com",
  //           "title": "Try",
  //           "description": "No descripto",
  //           "location": "WSS2",
  //           "date": "12/10/2024",
  //           "startTime": "14:52",
  //           "endTime": "15:52",
  //           "isPaid": true,
  //           "ticketPrice": 50,
  //           "maxAttendees": 47,
  //           "currentAttendees": 0,
  //           "category": [],
  //           "status": "approved",
  //           "isCancelled": false,
  //           "discount": 0,
  //           "images": [
  //             "https://eventsimages.blob.core.windows.net/events/1728820415307.png"
  //           ]
  //         },
  //       ],
  //     }),
  //   });

  //   render(<DayView date={testDate} />);
    
  //   await waitFor(() => {
  //     screen.debug();
  //     expect(screen.getByText(/Testing default status/i)).toBeInTheDocument();
  //     expect(screen.getByText(/16:51 - 17:52/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Try/i)).toBeInTheDocument();
  //     expect(screen.getByText(/14:52 - 15:52/i)).toBeInTheDocument();
      
  //   });
  // });

  it('should display an error message when there is a fetch error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Failed to load events',
      }),
    });

    render(<DayView date={testDate} />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to load events/i)).toBeInTheDocument();
    });
  });

  it('should scroll to the bottom of the page after events are fetched', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            event_id: 1,
            title: 'Event 1',
            date: '12/10/2024',
            startTime: '10:00 AM',
            endTime: '11:00 AM',
          },
        ],
      }),
    });

    render(<DayView date={testDate} />);

    await waitFor(() => {
      expect(global.scrollTo).toHaveBeenCalledWith({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    });
  });
});
