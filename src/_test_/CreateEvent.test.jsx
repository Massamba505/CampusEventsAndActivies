import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CreateEvent from '../components/CreateEvent';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom';

import { useAuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuthContext: vi.fn(),
}));

// Mocking fetch API and localStorage for testing
global.fetch = vi.fn();
global.URL.createObjectURL = vi.fn(() => 'mockImageURL');
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  global.ResizeObserver = ResizeObserver;

describe('CreateEvent Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    fetch.mockClear();
    localStorage.clear();
    localStorage.setItem(
      'events-app',
      JSON.stringify({ token: 'mockToken' })
    );
  });

  test('renders form fields correctly', () => {
    useAuthContext.mockReturnValue({
      authUser: { id: '123', name: 'Test User' },
    });

    render(
      <MemoryRouter>
        <CreateEvent />
      </MemoryRouter>
    );

    // Check for form fields
    expect(screen.getByPlaceholderText('Event Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter event description...')).toBeInTheDocument();
    expect(screen.getByText('Is Paid?')).toBeInTheDocument();
  });

  test('allows user to type and fill the form', async () => {
    useAuthContext.mockReturnValue({
      authUser: { id: '123', name: 'Test User' },
    });

    render(
      <MemoryRouter>
        <CreateEvent />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Event Title'), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByPlaceholderText('Search Location'), { target: { value: 'FNB36' } });
    fireEvent.change(screen.getByPlaceholderText('Enter event description...'), { target: { value: 'Test description' } });

    // Ensure inputs are updated
    expect(screen.getByPlaceholderText('Event Title')).toHaveValue('Test Event');
    expect(screen.getByPlaceholderText('Search Location')).toHaveValue('FNB36');
    expect(screen.getByPlaceholderText('Enter event description...')).toHaveValue('Test description');

  });

//   test('fetches categories and venues on mount', async () => {
//     // Mock API responses for categories and venues
//     fetch
//       .mockResolvedValueOnce({
//         ok: true,
//         json: () => Promise.resolve([{ _id: '1', name: 'Music' }]),
//       })
//       .mockResolvedValueOnce({
//         ok: true,
//         json: () => Promise.resolve([{ name: 'FNB36', status: true }]),
//       });

//     render(
//       <MemoryRouter>
//         <CreateEvent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledTimes(4);
//       //screen.debug();
//       expect(screen.getByText('Music')).toBeInTheDocument();
//     });
//   });

  //passes
  test('displays error toast if categories fetch fails', async () => {
    vi.spyOn(toast, 'error');

    // Mock fetch with error response
    fetch.mockRejectedValueOnce(new Error('Failed to fetch categories'));
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

    render(
      <MemoryRouter>
        <CreateEvent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error fetching categories');
    });
  });

//   test('displays the dropdown and allows venue selection', async () => {
//     // Mock API response for venues
//     fetch
//       .mockResolvedValueOnce({
//         ok: true,
//         json: () => Promise.resolve([{ name: 'FNB36', status: true }]),
//       })
//       .mockResolvedValueOnce({
//         ok: true,
//         json: () => Promise.resolve([{ _id: '1', name: 'Music' }]),
//       });

//     render(
//       <MemoryRouter>
//         <CreateEvent />
//       </MemoryRouter>
//     );

//     // Simulate user typing in location input
//     const locationInput = screen.getByPlaceholderText('Search Location');
//     fireEvent.change(locationInput, { target: { value: 'FNB' } });

//     await waitFor(() => {
//       expect(screen.getByText('FNB36')).toBeInTheDocument();
//     });

//     // Simulate selecting a venue from the dropdown
//     fireEvent.mouseDown(screen.getByText('FNB36'));
//     expect(locationInput).toHaveValue('FNB36');
//   });

//   test('disables submit button while loading', async () => {
//     useAuthContext.mockReturnValue({
//       authUser: { id: '123', name: 'Test User' },
//     });

//     render(
//       <MemoryRouter>
//         <CreateEvent />
//       </MemoryRouter>
//     );

//     const submitButton = screen.getByText('Create Event');
//     expect(submitButton).not.toBeDisabled();

//     // Simulate loading state
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(submitButton).toHaveTextContent('Creating...');
//       expect(submitButton).toBeDisabled();
//     });
//   });

  //passes
  test('displays image preview after file selection', () => {
    render(
      <MemoryRouter>
        <CreateEvent />
      </MemoryRouter>
    );

    const fileInput = screen.getByLabelText('Select a Header Image');

    // Simulate file selection
    const file = new File(['dummy image'], 'example.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByAltText('Header Preview')).toHaveAttribute('src', 'mockImageURL');
  });
});
