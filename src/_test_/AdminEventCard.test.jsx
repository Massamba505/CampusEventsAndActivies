// EventCard.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EventCard from "../components/Admin/AdminEventCard"; // Adjust the path if necessary
import "@testing-library/jest-dom";
// Mock functions for onReject and onApprove
const mockOnReject = vi.fn();
const mockOnApprove = vi.fn();

// Sample event data for testing
const mockEvent = {
  event_id: "1",
  title: "Sample Event",
  eventAuthor: "Author Name",
  date: "2024-10-28",
  startTime: "10:00 AM",
  endTime: "12:00 PM",
  location: "123 Event St.",
  images: ["https://via.placeholder.com/300"],
  isPaid: true,
  ticketPrice: 20,
  maxAttendees: 100,
  currentAttendees: 50,
  food_stalls: true,
  isCancelled: false,
  discount: null,
  category: [{ name: "Music" }, { name: "Art" }],
  description: "This is a sample event description.",
};

describe("EventCard Component", () => {
  it("renders the event card with the correct information", () => {
    render(<EventCard event={mockEvent} onReject={mockOnReject} onApprove={mockOnApprove} />);

    // Check if the event title is displayed
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    // Check if the event author is displayed
    expect(screen.getByText(mockEvent.eventAuthor)).toBeInTheDocument();
    // Check if the date and time is displayed
    expect(screen.getByText(`${mockEvent.date} ${mockEvent.startTime} - ${mockEvent.endTime}`)).toBeInTheDocument();
    // Check if the location is displayed
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    // Check if the ticket price is displayed
    expect(screen.getByText(`$${mockEvent.ticketPrice}`)).toBeInTheDocument();
  });

 /* it("opens and closes the modal when clicking on the card", () => {
    render(<EventCard event={mockEvent} onReject={mockOnReject} onApprove={mockOnApprove} />);

    // Click to open the modal
    fireEvent.click(screen.getByText(mockEvent.title));
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument(); // Modal title should be visible

    // Click to close the modal
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText(mockEvent.title)).not.toBeInTheDocument(); // Modal should not be visible
  });*/

  it("calls the onReject function when the reject button is clicked", () => {
    render(<EventCard event={mockEvent} onReject={mockOnReject} onApprove={mockOnApprove} />);

    // Open the modal
    fireEvent.click(screen.getByText(mockEvent.title));

    // Click the reject button
    fireEvent.click(screen.getByRole("button", { name: /reject/i }));
    expect(mockOnReject).toHaveBeenCalledWith(mockEvent.event_id);
  });

  it("calls the onApprove function when the approve button is clicked", () => {
    render(<EventCard event={mockEvent} onReject={mockOnReject} onApprove={mockOnApprove} />);

    // Open the modal
    fireEvent.click(screen.getByText(mockEvent.title));

    // Click the approve button
    fireEvent.click(screen.getByRole("button", { name: /approve/i }));
    expect(mockOnApprove).toHaveBeenCalledWith(mockEvent.event_id);
  });
});
