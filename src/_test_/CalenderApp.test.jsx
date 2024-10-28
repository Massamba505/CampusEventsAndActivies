// CalendarApp.test.jsx
import { render, screen, waitFor, act } from '@testing-library/react';
import CalendarApp from '../components/Calender/CalenderApp'; // Adjust the path as necessary
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuthContext: () => ({
    authUser: { username: 'testUser' }, // Mocked auth user
    setAuthUser: vi.fn(), // Mock setAuthUser function
  }),
}));

// Mocking Navbar component
vi.mock('../components/Navbar', () => ({
  default: () => <div>Mocked Navbar</div>,
}));

// Mocking Customize component
vi.mock('../components/Calender/Customize', () => ({
  default: () => <div>Mocked Customize</div>,
}));

// Mock the fetch API globally
beforeEach(() => {
  global.fetch = vi.fn(); // Mock fetch for your tests
});

describe('CalendarApp Component', () => {
  it('renders Navbar and Customize components', () => {
    render(
      <MemoryRouter>
        <CalendarApp />
      </MemoryRouter>
    );

    // Check if Navbar is rendered
    expect(screen.getByText(/Mocked Navbar/i)).toBeInTheDocument();

    // Check if Customize is rendered
    expect(screen.getByText(/Mocked Customize/i)).toBeInTheDocument();
  });

 
  


  
});
