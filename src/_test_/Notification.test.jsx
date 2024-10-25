import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Notification from '../components/User/Notification'; // Adjust path as necessary
import { MemoryRouter,useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; // Mock the context
import { toast } from 'react-hot-toast';
import '@testing-library/jest-dom';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  global.ResizeObserver = ResizeObserver;
// Mock the toast notifications
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuthContext: vi.fn(),
}));

// Mock the react-router-dom module
vi.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => <div>{children}</div>, // Mock MemoryRouter
  useNavigate: vi.fn(),
  Link: ({ children }) => <a>{children}</a>,
}));

global.fetch=vi.fn();
global.localStorage = {
    getItem: vi.fn(() => JSON.stringify({ token: 'mockToken' })),
    removeItem: vi.fn(),
  };

describe('Notification Component', () => {
  let mockedUseNavigate;

  beforeEach(() => {
    mockedUseNavigate = vi.mocked(useNavigate); // Get the mocked version of useNavigate

    useAuthContext.mockReturnValue({
      authUser: { id: '123', name: 'Test User', photoUrl: 'mockPhotoUrl' }, // Mock user data
      setAuthUser: vi.fn(), // Mock the setAuthUser function
    });

    // Clear mocks before each test
    global.fetch.mockClear();
    localStorage.getItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  test('renders the navbar with user data', () => {
    render(
      <MemoryRouter>
        <Notification />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  // Test for No Notifications
//   test('displays message when there are no notifications', async () => {
//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => ({ data: [] }), 
//     });

//     render(
//       <MemoryRouter>
//         <Notification />
//       </MemoryRouter>
//     );

//     // Simulate fetching notifications
//     // await waitFor(() => {
//     //   expect(fetch).toHaveBeenCalledWith(
//     //     expect.stringContaining('/api/user/notifications'),
//     //     expect.objectContaining({
//     //       method: 'GET',
//     //       headers: expect.any(Object),
//     //     })
//     //   );
//     // });

//     // Check that the "No notifications available" message is displayed
//     await waitFor(() => {
//         expect(screen.getByText('No notifications available.')).toBeInTheDocument();
//       });
//     screen.debug();
//     //expect(screen.getByText('No notifications available.')).toBeInTheDocument();
//   });

//   test('displays mock notifications correctly', async () => {
//     const mockNotifications = [
//       {
//         _id: 'notif1',
//         message: 'This is a test notification',
//         event_id: { event_id: 'event1', title: 'Test Event 1' },
//       },
//       {
//         _id: 'notif2',
//         message: 'Another test notification',
//         event_id: { event_id: 'event2', title: 'Test Event 2' },
//       },
//     ];

//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => ({ data: mockNotifications }), // Mock notifications array
//     });

//     render(
//       <MemoryRouter>
//         <Notification />
//       </MemoryRouter>
//     );

//     // Simulate fetching notifications
//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         expect.stringContaining('/api/user/notifications'),
//         expect.objectContaining({
//           method: 'GET',
//           headers: expect.any(Object),
//         })
//       );
//     });

//     // Check that the notifications are displayed
//     mockNotifications.forEach((notification) => {
//       expect(screen.getByText(notification.message)).toBeInTheDocument();
//       expect(screen.getByText(notification.event_id.title)).toBeInTheDocument();
//     });
//   });

});
