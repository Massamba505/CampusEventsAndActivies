import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import InfiniteCategory from '../components/InfintyCategory'; // Adjust the path to your component
import '@testing-library/jest-dom';

describe('InfiniteCategory Component', () => {
  it('renders the list of visible categories', () => {
    render(
      <BrowserRouter>
        <InfiniteCategory />
      </BrowserRouter>
    );

    // Target only the first visible set of categories
    const categories = [
      'Technology',
      'Education',
      'Health',
      'Business',
      'Entertainment',
      'Sports',
    ];

    categories.forEach(category => {
      // Ensure we're only targeting visible elements
      const visibleCategory = screen.getAllByText(category).find(el => el.closest('[aria-hidden="true"]') === null);
      expect(visibleCategory).toBeInTheDocument();
    });
  });

  it('renders the visible category icons', () => {
    render(
      <BrowserRouter>
        <InfiniteCategory />
      </BrowserRouter>
    );

    // Ensure the icons for visible categories are being targeted correctly
    const visibleIcons = ['💻', '📚', '🩺', '💼', '🎉', '🏆'];
    
    visibleIcons.forEach(icon => {
      const visibleIcon = screen.getAllByText(icon).find(el => el.closest('[aria-hidden="true"]') === null);
      expect(visibleIcon).toBeInTheDocument();
    });
  });

  it('renders the category links correctly', () => {
    render(
      <BrowserRouter>
        <InfiniteCategory />
      </BrowserRouter>
    );

    // Check if each category link is rendered with the correct path
    expect(screen.getByRole('link', { name: /Technology/i })).toHaveAttribute('href', '/technology');
    expect(screen.getByRole('link', { name: /Education/i })).toHaveAttribute('href', '/education');
    expect(screen.getByRole('link', { name: /Health/i })).toHaveAttribute('href', '/health');
    expect(screen.getByRole('link', { name: /Business/i })).toHaveAttribute('href', '/business');
    expect(screen.getByRole('link', { name: /Entertainment/i })).toHaveAttribute('href', '/entertainment');
    expect(screen.getByRole('link', { name: /Sports/i })).toHaveAttribute('href', '/sports');
  });
});
