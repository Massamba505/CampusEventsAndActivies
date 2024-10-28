import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import MapComponent from '../components/MapComponent';
import '@testing-library/jest-dom';

// Mock fetch for rentals and POIs
global.fetch = vi.fn((url) => {
  if (url === "https://gateway.tandemworkflow.com/api/v1/rental/rentals") {
    return Promise.resolve({
      json: () => Promise.resolve([{ _id: '1', pickupPoint: 'Test Point', amount: 100, rentTimestamp: Date.now() }]),
    });
  } else if (url === "https://gateway.tandemworkflow.com/api/v1/navigation/poi") {
    return Promise.resolve({
      json: () => Promise.resolve([{ id: 'poi1', name: 'Test Restaurant', type: 'Restaurant', coordinates: { latitude: -26.1903, longitude: 28.0256 } }]),
    });
  }
  return Promise.reject(new Error('Unknown URL'));
});

describe('MapComponent', () => {
  const details = { name: 'Test Location', capacity: 50 };
  const location = '-26.1903,28.0256';

  beforeEach(() => {
    render(<MapComponent details={details} location={location} />);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear fetch mocks after each test
  });

  /*it('renders correctly', () => {
  
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('fetches rentals and displays markers', async () => {
   
      expect(screen.getByText('Rental Amount: 100')).toBeInTheDocument();
      expect(screen.getByText('Pickup Point: Test Point')).toBeInTheDocument();
   
  });

  it('fetches POIs and displays markers', async () => {
   
      expect(screen.getByText('Restaurant')).toBeInTheDocument();
    
  });*/

  it('uses the correct icon for the POI', async () => {
    await waitFor(() => {
      // Check if the custom icon is rendered
      const icon = document.querySelector('img[src*="restaurant.png"]');
      expect(icon).toBeInTheDocument();
    });
  });
});
