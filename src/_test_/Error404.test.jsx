import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Error404 from '../components/Error404'; // Adjust the path to your file
import '@testing-library/jest-dom'; // For custom matchers like toBeInTheDocument()

describe('Error404 Component', () => {
  it('renders the 404 error message', () => {
    render(
      <BrowserRouter>
        <Error404 />
      </BrowserRouter>
    );

    // Check if the "404" text is rendered
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the "Page not found" heading', () => {
    render(
      <BrowserRouter>
        <Error404 />
      </BrowserRouter>
    );

    // Check if the "Page not found" heading is present
    expect(screen.getByRole('heading', { name: /Page not found/i })).toBeInTheDocument();
  });

  it('renders the "Go back home" link with SVG icon', () => {
    render(
      <BrowserRouter>
        <Error404 />
      </BrowserRouter>
    );

    // Check if the link is present and points to the "/home" path
    const linkElement = screen.getByRole('link', { name: /Go back home/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/home');

    // Check if the SVG icon is present within the link
    const svgElement = screen.getByRole('img', { hidden: true });
    expect(svgElement).toBeInTheDocument();
  });

  it('renders the 404 image', () => {
    render(
      <BrowserRouter>
        <Error404 />
      </BrowserRouter>
    );

    // Check if the image with alt text "404 Not Found" is present
    const imgElement = screen.getByAltText('404 Not Found');
    expect(imgElement).toBeInTheDocument();
  });
});
