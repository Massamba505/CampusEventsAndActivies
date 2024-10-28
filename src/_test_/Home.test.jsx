// Home.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import '@testing-library/jest-dom';

// Mock components
vi.mock('../components/Navbar', () => ({
  default: () => <div>Navbar</div>,
}));
vi.mock('../components/SearchBar', () => ({
  default: ({ handleSearch }) => (
    <input data-testid="search-input" onChange={(e) => handleSearch(e.target.value)} />
  ),
}));
vi.mock('../components/UpcomingEvents', () => ({
  default: () => <div>Upcoming Events</div>,
}));
vi.mock('../components/CategoryList', () => ({
  default: () => <div>Category List</div>,
}));
vi.mock('../components/PopularEvents', () => ({
  default: () => <div>Popular Events</div>,
}));
vi.mock('../components/RecommendedEvents', () => ({
  default: () => <div>Recommended Events</div>,
}));
vi.mock('../components/InprogressEvents', () => ({
  default: () => <div>In Progress Events</div>,
}));

// Create a mock function for navigate
const mockNavigate = vi.fn();

// Mock the useNavigate hook before all tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
   // screen.debug();

    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Category List')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Popular Events')).toBeInTheDocument();
    expect(screen.getByText('Recommended Events')).toBeInTheDocument();
    expect(screen.getByText('In Progress Events')).toBeInTheDocument();
  });

  it('navigates to search page on search input', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.blur(searchInput); 

    // Assert that navigate was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith('/search?query=test');
  });
});

