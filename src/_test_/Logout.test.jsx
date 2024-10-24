import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Logout from '../components/User/Logout';
import {toast} from 'react-hot-toast';
import { myConstant } from '../const/const';
import { useAuthContext } from '../context/AuthContext';
import '@testing-library/jest-dom';

// Mock toast for displaying notifications
vi.mock('react-hot-toast', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mocking AuthContext
const mockSetAuthUser = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuthContext: () => ({ setAuthUser: mockSetAuthUser }),
}));

describe('Logout Component', () => {
  const mockSetActiveIndex = vi.fn();
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    localStorage.removeItem('events-app');
  });

  it('renders the modal and displays correct text', () => {
    render(<Logout setActiveIndex={mockSetActiveIndex} />);

    expect(screen.getByText(/Are you sure you want to logout?/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout account/i)).toBeInTheDocument();
  });

  it('calls handleLogout and successfully logs out', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<Logout setActiveIndex={mockSetActiveIndex} />);

    const logoutButton = screen.getByTestId("logoutButton");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`${myConstant}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(localStorage.getItem('events-app')).toBeNull();
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
      expect(mockSetAuthUser).toHaveBeenCalledWith(null);
    });
  });

  it('shows error message if logout fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Logout failed' }),
    });

    render(<Logout setActiveIndex={mockSetActiveIndex} />);

    const logoutButton = screen.getByTestId("odd");
    //console.log(logoutButton);
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Logout failed');
    });
  });

  it('calls setActiveIndex(0) when cancel button is clicked', () => {
    render(<Logout setActiveIndex={mockSetActiveIndex} />);

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(mockSetActiveIndex).toHaveBeenCalledWith(0);
  });
});
