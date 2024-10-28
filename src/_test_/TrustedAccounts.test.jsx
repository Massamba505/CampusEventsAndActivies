import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import UserAccount from '../components/Admin/TrustedAccounts';
import { myConstant } from '../const/const';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

// Mocking fetch
global.fetch = vi.fn();

describe('UserAccount Component', () => {
  beforeEach(() => {
    // Set up localStorage
    localStorage.setItem('events-app', JSON.stringify({ token: 'test_token', id: 'test_id' }));

    // Mock the fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          _id: '1',
          fullname: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          profile_picture: '',
          about: 'Test user'
        },
        {
          _id: '2',
          fullname: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
          profile_picture: '',
          about: ''
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('fetches and displays users', async () => {
    render(<UserAccount />);
    
    // Check if the users are rendered
    const userNames = await screen.findAllByText(/Doe|Smith/i);
    expect(userNames).toHaveLength(2);
  });

  test('opens and closes modal when a user is clicked', async () => {
    render(<UserAccount />);

    // Open modal
    const userCard = await screen.findByText('John Doe');
    fireEvent.click(userCard);

    expect(screen.getByText('User Details')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('User Details')).not.toBeInTheDocument();
    });
  });

 /* test('updates user role', async () => {
    render(<UserAccount />);
    const userCard = await screen.findByText('John Doe');
    fireEvent.click(userCard);

    // Update to 'organizer'
    const makeOrganizerButton = screen.getByRole('button', { name: /Make Organizer/i });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: '1',
        fullname: 'John Doe',
        email: 'john@example.com',
        role: 'organizer',
        profile_picture: '',
        about: 'Test user'
      }),
    });
    fireEvent.click(makeOrganizerButton);

    await waitFor(() => {
      expect(screen.getByText(/User role changed successfully/i)).toBeInTheDocument();
    });

    // Check if the user role is updated in the modal
    expect(screen.getByText(/Role: organizer/i)).toBeInTheDocument();
  });*/
});
