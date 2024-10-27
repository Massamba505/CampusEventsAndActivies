import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CodeInput from '../pages/FogotPassword/EnterCode';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

// Mock the toast functions
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock fetch API
global.fetch = vi.fn();

describe('CodeInput Component', () => {
  const email = 'test@example.com';

  beforeEach(() => {
    fetch.mockClear();
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(
      <MemoryRouter initialEntries={[`/enter-code/${email}`]}>
        <CodeInput />
      </MemoryRouter>
    );

    expect(screen.getByText(/We’ve sent a 4-digit code to your email/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter 4-Digit Code/i)).toBeInTheDocument();
  });

  it('submits OTP correctly', async () => {
    render(
      <MemoryRouter initialEntries={[`/enter-code/${email}`]}>
        <CodeInput />
      </MemoryRouter>
    );

    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ userId: '123' }),
    });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });

    fireEvent.click(screen.getByText('Verify'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/reset-password/1234'),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith('OTP verified successfully!');
    });
  });

  it('handles error on OTP submission', async () => {
    render(
      <MemoryRouter initialEntries={[`/enter-code/${email}`]}>
        <CodeInput />
      </MemoryRouter>
    );

    fetch.mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Invalid OTP' }),
    });

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });

    fireEvent.click(screen.getByText('Verify'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid OTP');
    });
  });

  it('resends OTP correctly', async () => {
    render(
      <MemoryRouter initialEntries={[`/enter-code/${email}`]}>
        <CodeInput />
      </MemoryRouter>
    );

    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    fireEvent.click(screen.getByText('Resend OTP'));
    console.log('Resend OTP button clicked'); // Debug log

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/forgot-password'),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith('Check your email for the reset code!');
    });

    // Additional debug log
    console.log('Fetch call:', fetch.mock.calls);
  });
});
