// src/_test_/Home.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Home from "../pages/Home"; // Adjust the import based on your file structure

describe("Home Component", () => {
  it("renders the Navbar, CategoryList, SearchBar, and event sections", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check if components are rendered
    expect(screen.getByText(/navbar/i)).toBeInTheDocument();
    expect(screen.getByText(/category list/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument(); // Assuming there's a placeholder in the SearchBar
    expect(screen.getByText(/upcoming events/i)).toBeInTheDocument();
    expect(screen.getByText(/popular events/i)).toBeInTheDocument();
    expect(screen.getByText(/recommended events/i)).toBeInTheDocument();
    expect(screen.getByText(/in-progress events/i)).toBeInTheDocument();
  });

  it("navigates to the search page with the query when a search is performed", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Home />
      </MemoryRouter>
    );

    const searchBar = screen.getByPlaceholderText(/search/i); // Adjust based on your SearchBar's placeholder
    fireEvent.change(searchBar, { target: { value: "test" } });
    fireEvent.keyDown(searchBar, { key: "Enter", code: "Enter" }); // Simulate pressing Enter

    expect(window.location.pathname).toBe("/search");
    expect(window.location.search).toBe("?query=test");
  });
});
