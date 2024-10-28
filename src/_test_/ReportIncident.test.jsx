import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as necessary
import ReportIncident from "../components/ReportIncident"; // Adjust the path as necessary
import { vi } from "vitest";
import toast from "react-hot-toast";
import "@testing-library/jest-dom";
// Mocking the useAuthContext
const mockAuthContext = (authUser) => ({
  authUser,
});

global.fetch = vi.fn();

describe("ReportIncident Component", () => {
  const token = "mock-token"; // mock token
  const incidentDetails = {
    title: "Incident Title",
    description: "Incident Description",
    location: "Incident Location",
    date: "2024/10/01",
    time: "10:00 - 11:00",
    group: "Incident Group",
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear any previous mocks
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext({ email: "test@example.com", firstname: "Test", lastname: "User" })}>
          <ReportIncident token={token} incidentDetails={incidentDetails} />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });

  it("should render the Report button", () => {
    expect(screen.getByText(/Report/i)).toBeInTheDocument();
  });

  it("should open the modal when the Report button is clicked", () => {
    fireEvent.click(screen.getByText(/Report/i));
    expect(screen.getByText(/Report an Incident/i)).toBeInTheDocument();
  });

  it("should close the modal when Cancel button is clicked", () => {
    fireEvent.click(screen.getByText(/Report/i)); // Open modal
    fireEvent.click(screen.getByText(/Cancel/i)); // Close modal
    expect(screen.queryByText(/Report an Incident/i)).not.toBeInTheDocument();
  });

  it("should allow user to input a description", () => {
    fireEvent.click(screen.getByText(/Report/i));
    const descriptionInput = screen.getByPlaceholderText(/report to us/i);
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });
    expect(descriptionInput.value).toBe("Test description");
  });

  it("should allow user to upload an image", async () => {
    fireEvent.click(screen.getByText(/Report/i));
    const fileInput = screen.getByLabelText(/Image \(Optional\):/i);
    const file = new File(["image content"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(fileInput.files[0]).toBe(file));
  });

  it("should submit the form and show success message", async () => {
    fireEvent.click(screen.getByText(/Report/i)); // Open modal

    // Fill in the description
    const descriptionInput = screen.getByPlaceholderText(/report to us/i);
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });

    // Mock fetch call for submission
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Incident reported successfully!" }),
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`https://campus-safety.azurewebsites.net/incidentReporting/reportExternalIncident/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.any(String), // Check if body is sent as string
      });
      expect(screen.getByText(/Thank you!/i)).toBeInTheDocument(); // Check success message
    });
  });

  it("should show an error message if the API call fails", async () => {
    fireEvent.click(screen.getByText(/Report/i)); // Open modal

    // Fill in the description
    const descriptionInput = screen.getByPlaceholderText(/report to us/i);
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });

    // Mock fetch call for submission to fail
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to report incident" }),
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`https://campus-safety.azurewebsites.net/incidentReporting/reportExternalIncident/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.any(String), // Check if body is sent as string
      });
      expect(screen.queryByText(/Thank you!/i)).not.toBeInTheDocument(); // Check that success message is not displayed
    });
  });
});
