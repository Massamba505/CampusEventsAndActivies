import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContextProvider } from '../context/AuthContext.jsx'; // Adjust the path as needed
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Signup from '../pages/SignUp'; // Adjust the path as needed
import { signInWithGoogle } from '../utils/auth'; // Mock this function
import toast from 'react-hot-toast'; // Import toast for mocking
import "@testing-library/jest-dom";

// Mocking the signInWithGoogle function and toast
vi.mock('../utils/auth');
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('Signup Component', () => {
  const setup = () => {
    return render(
      <MemoryRouter>
        <AuthContextProvider>
          <Signup />
        </AuthContextProvider>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    // Cleanup mocks and localStorage
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('renders signup form', () => {
    setup();

    expect(screen.getByTestId(/firstname/i)).toBeInTheDocument();
    expect(screen.getByTestId(/lastname/i)).toBeInTheDocument();
    expect(screen.getByTestId(/email/i)).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId(/confirmPassword/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account?/i)).toBeInTheDocument();
  });

 /* test('validates password strength', async () => {
    setup(); 
    
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    screen.debug();
    
    await waitFor(() => {
      expect(screen.getByText(/password should be at least 4 characters long/i)).toBeInTheDocument();
    });
  });*/
  
 
  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

 /* test('shows error if passwords do not match', async () => {
    setup();

    fireEvent.change(screen.getByTestId("password"), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: 'DifferentPassword!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match.');
    });
  });*/


  
  
  test('submits form with valid data', async () => {
    // Mocking fetch for a successful signup response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Signup successful!' }),
      })
    );

    setup();

    fireEvent.change(screen.getByTestId(/firstname/i), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByTestId(/lastname/i), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByTestId(/email/i), {
        target: { value: 'john.doe@example.com' },
      });
      fireEvent.change(screen.getByTestId("password"), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByTestId(/confirmPassword/i), {
        target: { value: 'Password123!' },
      });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Signup successful!');
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    });
  });

  test('displays error on failed signup', async () => {
    // Mocking fetch to simulate signup failure
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Signup failed' }),
      })
    );

    setup();

    fireEvent.change(screen.getByTestId(/firstname/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByTestId(/lastname/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByTestId(/email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByTestId(/confirmPassword/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed');
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
