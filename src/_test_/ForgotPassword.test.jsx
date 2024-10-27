// ForgotPassword.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Use MemoryRouter for testing routing
import ForgotPassword from "../pages/FogotPassword/ForgotPassword"; // Adjust the import path as necessary
import toast from 'react-hot-toast';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
vi.mock('react-hot-toast');

// Mocking react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(), // Mocking useNavigate
    MemoryRouter: ({ children }) => <div>{children}</div>, // Mocking MemoryRouter
  };
});

// Mocking fetch
beforeEach(() => {
  vi.clearAllMocks();
});

describe("ForgotPassword Component", () => {
  test("renders forgot password form", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset password/i })).toBeInTheDocument();
  });

  test("displays error message when email is empty", async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Reset password/i }));

    expect(await screen.findByText(/Please provide a valid email address/i)).toBeInTheDocument();
  });

  test("calls fetch and navigates on successful submission", async () => {
    const email = "test@example.com";
    const mockResponse = { message: "Reset email sent." };

    // Mocking the fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      })
    );

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Fill in the email input
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: email } });
    
    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Reset password/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/forgot-password"),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email }),
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Check your email for the reset code!');
    });
  });

  test("displays error message on failed fetch", async () => {
    const email = "test@example.com";
    const mockErrorResponse = { error: "Failed to send email" };

    // Mocking the fetch API for error case
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: vi.fn().mockResolvedValue(mockErrorResponse),
      })
    );

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: email } });
    fireEvent.click(screen.getByRole("button", { name: /Reset password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(mockErrorResponse.error);
    });
  });
});