import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContextProvider } from '../context/AuthContext.jsx'; // Adjust the path as needed
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Login from '../pages/Login'; // Adjust the path as needed
import { signInWithGoogle } from '../utils/auth'; // Mock this function
import toast from 'react-hot-toast'; // Import the toast library
import "@testing-library/jest-dom";

// Mocking the signInWithGoogle function and toast
vi.mock('../utils/auth');
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
  },
}));

describe('Login Component', () => {
  const setup = () => {
    return render(
      <MemoryRouter>
        <AuthContextProvider>
          <Login />
        </AuthContextProvider>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    // Cleanup mocks and localStorage
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('renders login form', () => {
    setup();

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password?/i)).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  test('submits form with email and password', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('events-app')).toBeDefined();
      // You can also check that setAuthUser is called if needed
    });
  });

  test('displays error on failed login', async () => {
    // Mock fetch to simulate login failure
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Login failed' }),
      })
    );

    setup();

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed');
    });
  });

  test('handles Google login', async () => {
    setup();
    signInWithGoogle.mockImplementation(() => Promise.resolve());

    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalled();
    });
  });
});
