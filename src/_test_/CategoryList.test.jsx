import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CategoryList from '../components/CategoryList'; // Adjust the path as necessary
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the fetch API globally
global.fetch = vi.fn();

describe('CategoryList Component', () => {
  const mockCategories = [
    { _id: '1', name: 'Category 1', image: 'cat1.jpg' },
    { _id: '2', name: 'Category 2', image: 'cat2.jpg' },
    { _id: '3', name: 'Category 3', image: 'cat3.jpg' },
  ];

  beforeEach(() => {
    fetch.mockClear();

    // Mock local storage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => JSON.stringify({ token: 'mockToken123' })),
      },
      writable: true,
    });
  });

  it('fetches and displays categories', async () => {
    // Mock the fetch response for categories
    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockCategories),
    });

    render(
      <Router>
        <CategoryList />
      </Router>
    );

    // Ensure the fetch is called with the correct URL and headers
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/category'), expect.any(Object));

    // Wait for the categories to be rendered
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
      expect(screen.getByText('Category 3')).toBeInTheDocument();
    });
  });

});
