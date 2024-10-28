import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { vi } from "vitest";
import App from "../App"; // Adjust the path as necessary
import { AuthContext } from "../context/AuthContext"; // Adjust the path as necessary
import '@testing-library/jest-dom';

// Mocking the useAuthContext
const mockAuthContext = (authUser) => ({
  authUser,
});

// src/setupTests.js
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};


describe("App Routing", () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem(key) {
          return store[key] || null;
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
        removeItem(key) {
          delete store[key];
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
  });

 /* test('renders Landing page for the root route', () => {
    const mockAuthContextValue = {
      authUser: null, // Simulate logged out state
    };
  
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Router>
          <App />
        </Router>
      </AuthContext.Provider>
    );
  
    expect(screen.getByText(/Find Events to/i)).toBeInTheDocument();
  });

  /*it("should redirect to Home if user is authenticated when accessing /login", () => {
    localStorage.setItem("events-app", JSON.stringify({ token: "valid-token" }));

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthContext.Provider value={mockAuthContext({ id: 1 })}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });*/

  it("should render ForgotPassword if user is not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <AuthContext.Provider value={mockAuthContext(null)}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
  });

 /* it("should render EventDetails if authenticated", () => {
    localStorage.setItem("events-app", JSON.stringify({ token: "valid-token" }));

    render(
      <MemoryRouter initialEntries={["/events/123"]}>
        <AuthContext.Provider value={mockAuthContext({ id: 1 })}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Event Details/i)).toBeInTheDocument();
  });*/

  it("should render Error404 for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <AuthContext.Provider value={mockAuthContext(null)}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  /*it("should show Profile or AdminProfile based on user role", () => {
    localStorage.setItem("events-app", JSON.stringify({ token: "valid-token" }));

    // Test for user role
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <AuthContext.Provider value={mockAuthContext({ id: 1, role: "user" })}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/User Profile/i)).toBeInTheDocument();

    // Test for admin role
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <AuthContext.Provider value={mockAuthContext({ id: 1, role: "admin" })}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin Profile/i)).toBeInTheDocument();
  });*/
});
