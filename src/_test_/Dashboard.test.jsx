// Dashboard.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Dashboard from "../components/User/Dashboard";
import "@testing-library/jest-dom";

describe("Dashboard Component", () => {
  it("should render the Dashboard heading", () => {
    // Render the Dashboard component
    render(<Dashboard />);

    // Look for the Dashboard heading
    const headingElement = screen.getByText(/Dashboard/i);

    // Assert that the heading is in the document
    expect(headingElement).toBeInTheDocument();
  });
});
