import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryList from '../components/CategoryList';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock fetch response for categories
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { _id: '1', name: 'Music', image: '/images/music.png' },
        { _id: '2', name: 'Sports', image: '/images/sports.png' },
        { _id: '3', name: 'Tech', image: '/images/tech.png' },
      ]),
  })
);

describe('CategoryList Component', () => {
  it('renders categories from the API', async () => {
    // Render the component inside Router for Link functionality
    render(
      <Router>
        <CategoryList />
      </Router>
    );

    // Wait for categories to be fetched and rendered
    const musicCategory = await screen.findByText('Music');
    const sportsCategory = await screen.findByText('Sports');
    const techCategory = await screen.findByText('Tech');

    // Check if the categories are in the document
    expect(musicCategory).toBeInTheDocument();
    expect(sportsCategory).toBeInTheDocument();
    expect(techCategory).toBeInTheDocument();

    // Check if images are rendered correctly
    const musicImage = screen.getByAltText('Music');
    expect(musicImage).toHaveAttribute('src', '/images/music.png');
  });

  it('slides the categories when left and right buttons are clicked', () => {
    render(
      <Router>
        <CategoryList />
      </Router>
    );

    const slider = screen.getByRole('list'); // The <ul> containing categories

    const slideRightButton = screen.getByRole('button', { name: /MdChevronRight/i });
    const slideLeftButton = screen.getByRole('button', { name: /MdChevronLeft/i });

    // Mock scrollBy functionality for the slider
    slider.scrollBy = vi.fn();

    // Simulate right button click
    fireEvent.click(slideRightButton);
    expect(slider.scrollBy).toHaveBeenCalledWith({ left: 220, behavior: 'smooth' });

    // Simulate left button click
    fireEvent.click(slideLeftButton);
    expect(slider.scrollBy).toHaveBeenCalledWith({ left: -220, behavior: 'smooth' });
  });
});
