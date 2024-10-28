import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from '../components/Navbar'; // Adjust the path as needed
import { MemoryRouter, useNavigate } from 'react-router-dom'; // Importing useNavigate directly
import { useAuthContext } from '../context/AuthContext';

import '@testing-library/jest-dom';
//NavBar testing
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  global.ResizeObserver = ResizeObserver;

// Mock Auth Context
vi.mock('../context/AuthContext', () => ({
  useAuthContext: vi.fn(),
}));

// Mock Toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch API and localStorage for testing
global.fetch = vi.fn();
global.localStorage = {
  getItem: vi.fn(() => JSON.stringify({ token: 'mockToken' })),
  removeItem: vi.fn(),
};

// Mock the react-router-dom module to include MemoryRouter and useNavigate
vi.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => <div>{children}</div>, // Simple mock for MemoryRouter
  useNavigate: vi.fn(), // Mock useNavigate
  Link: ({ children }) => <a>{children}</a>,
}));

describe('Navbar Component', () => {
  let mockedUseNavigate;

  beforeEach(() => {
    // Clear mocks before each test
    fetch.mockClear();
    localStorage.getItem.mockClear();
    localStorage.removeItem.mockClear();

    mockedUseNavigate = vi.mocked(useNavigate); // Get the mocked version of useNavigate

    useAuthContext.mockReturnValue({
      authUser: { id: '123', name: 'Test User', photoUrl: 'mockPhotoUrl' },
      setAuthUser: vi.fn(),
    });
  });

  test('renders the navbar correctly', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for logo
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    // Check for notifications and calendar icons
    expect(screen.getByRole('button', { name: /open user menu/i })).toBeInTheDocument();
  });

  test('fetches user data on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ photoUrl: 'newMockPhotoUrl' }),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/user'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object),
        })
      );
    });
  });

//   test('handles logout', async () => {
//     fetch.mockResolvedValueOnce({ ok: true });

//     render(
//       <MemoryRouter>
//         <Navbar />
//       </MemoryRouter>
//     );
//     const logoutButton1 = screen.getByTestId("menuThing");
//     //console.log(logoutButton1);
//     fireEvent.click(logoutButton1);
//     const logoutButton = screen.getByTestId("logoutButton2");
//     //console.log(logoutButton);
//     // const logoutButton2=screen.getByText(/Logout/i);
//     // console.log(logoutButton2);
//     fireEvent.click(logoutButton);

//     await waitFor(() => {
//       expect(localStorage.removeItem).toHaveBeenCalledWith('events-app');
//       expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
//     });
//   });

  test('fetches notifications on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notifications: ['Notification 1', 'Notification 2'] }),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/user/notifications/latest'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object),
        })
      );
    });
  });

  test('navigates to create event on button click', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton1 = screen.getByTestId("menuThing");
    //console.log(logoutButton1);
    fireEvent.click(logoutButton1);

    //const createEventButton = screen.getByText(/create event/i);
    const createEventButton = screen.getByTestId("createButton");
    fireEvent.click(createEventButton);

    expect(mockedUseNavigate).toHaveBeenCalled();
  });

});
