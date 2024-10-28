import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from '../components/SearchResults';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock the fetch API globally
global.fetch = vi.fn();

// Mock Navbar and CategoryList to prevent them from affecting your tests
vi.mock('../components/Navbar', () => ({
  default: () => <div>Navbar</div>, // Ensure you return an object with a default key
}));

vi.mock('../components/CategoryList', () => ({
  default: () => <div>CategoryList</div>, // Same for CategoryList
}));

// Mocking react-router-dom to include MemoryRouter and useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    MemoryRouter: actual.MemoryRouter, // Make sure to return MemoryRouter
  };
});

// Mock ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mocked auth context
vi.mock('../context/AuthContext', () => ({
  useAuthContext: () => ({
    authUser: { username: 'testUser' },
    setAuthUser: vi.fn(),
  }),
}));

const mockEvents = [
  {
    event_id: 1,
    title: 'Event 1',
    eventAuthor: 'Author 1',
    date: '2024-10-30',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    location: 'Location 1',
    images: ['https://example.com/image1.jpg'],
    isPaid: false,
    ticketPrice: 0,
    maxAttendees: 100,
    currentAttendees: 50,
    food_stalls: true,
    discount: 0,
    category: [{ name: 'Category 1' }],
  },
  {
    event_id: 2,
    title: 'Event 2',
    eventAuthor: 'Author 2',
    date: '2024-10-31',
    startTime: '11:00 AM',
    endTime: '3:00 PM',
    location: 'Location 2',
    images: ['https://example.com/image2.jpg'],
    isPaid: true,
    ticketPrice: 20,
    maxAttendees: 200,
    currentAttendees: 150,
    food_stalls: false,
    discount: 10,
    category: [{ name: 'Category 2' }],
  },
];

describe('SearchResults Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage for the tests
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'events-app') {
        return JSON.stringify({ token: 'mockToken' }); // Mock token value
      }
      return null;
    });
  });

  it('should render loading spinner initially', () => {
    fetch.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValueOnce({ data: [] }) });

    render(
      <MemoryRouter initialEntries={['/search?query=Event 2']}>
        <SearchResults />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument(); // Check for spinner
  });

  it('should display events when fetched successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ data: mockEvents }), // Confirm this matches your response structure
    });

    render(
      <MemoryRouter initialEntries={['/search?query=Event 2']}>
        <SearchResults />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Search Results for "Event 2"/)).toBeInTheDocument());
    //screen.debug();

    // Check event titles
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument(); // Check Event 2 as well

    // Check additional event details for Event 1
    expect(screen.getByText('Author 1')).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    
  });

  it('should display "No events found" if there are no events', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValueOnce({ data: [] }) });

    render(
      <MemoryRouter initialEntries={['/search?query=test']}>
        <SearchResults />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/No events found/)).toBeInTheDocument());
  });
});
