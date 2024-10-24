import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChangePassword from '../components/User/ChangePassword';
import { toast } from 'react-hot-toast';
import '@testing-library/jest-dom';

// Mock toast for displaying notifications
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock localStorage
beforeEach(() => {
  localStorage.setItem(
    'events-app',
    JSON.stringify({ token: 'mocked_token' })
  );
});

describe('ChangePassword Component', () => {
  const mockSetModalVisible = vi.fn();

  it('should render the change password modal when visible', () => {
    render(<ChangePassword modalVisible={true} setModalVisible={mockSetModalVisible} />);
    expect(screen.getByTestId('old-pass')).toBeInTheDocument();
    expect(screen.getByText(/Old Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm New Password/i)).toBeInTheDocument();
  });

  it('should close the modal when Close button is clicked', () => {
    render(<ChangePassword modalVisible={true} setModalVisible={mockSetModalVisible} />);

    fireEvent.click(screen.getByText(/Close/i));

    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });

  it('should show error when new password and confirm password do not match', async () => {
    render(<ChangePassword modalVisible={true} setModalVisible={mockSetModalVisible} />);
    fireEvent.change(screen.getByTestId('old-pass'), { target: { value: 'passwordold' } });
    fireEvent.change(screen.getByTestId("new-pass2"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId("new-pass2"), { target: { value: 'password124' } });

    fireEvent.click(screen.getByTestId('newPassButton'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('New passwords do not match.');
    });
  });

  it('should show error when no token is found in localStorage', async () => {
    // Clear token from localStorage
    localStorage.clear();

    render(<ChangePassword modalVisible={true} setModalVisible={mockSetModalVisible} />);

    fireEvent.change(screen.getByTestId('old-pass'), { target: { value: 'passwordold' } });
    fireEvent.change(screen.getByTestId("new-pass1"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId("new-pass2"), { target: { value: 'password123' } });

    fireEvent.click(screen.getByTestId('newPassButton'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User not authenticated. Please log in again.');
    });
  });

  it('should show error when API returns an error', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to change password' }),
    });
    global.fetch = mockFetch;

    render(<ChangePassword modalVisible={true} setModalVisible={mockSetModalVisible} />);

    fireEvent.change(screen.getByTestId('old-pass'), { target: { value: 'passwordold' } });
    fireEvent.change(screen.getByTestId("new-pass1"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId("new-pass2"), { target: { value: 'password123' } });

    fireEvent.click(screen.getByTestId('newPassButton'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to change password');
    });
  });
});
