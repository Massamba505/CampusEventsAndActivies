import { render, screen, fireEvent, getAllByTestId } from '@testing-library/react';
import { MemoryRouter,Route,Routes } from 'react-router-dom';
import LandingPage from '../pages/Landing'; // Adjust the path as necessary
 import '@testing-library/jest-dom';
describe('LandingPage Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  });

  test('renders the logo', () => {
    const logo = screen.getByAltText(/events and activities/i);
    expect(logo).toBeInTheDocument();
  });

  test('renders login and signup buttons', () => {
    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toBeInTheDocument();
    
    //const signupButton = screen.getByTestId('signup-button');
   // expect(signupButton).toBeInTheDocument();
  });


  
  



  /*test('navigates to signup page on get started button click', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<div>Signup Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  
    const getStartedButton = getByTestId('signup-button'); // Use getByTestId to find the button
    fireEvent.click(getStartedButton);
  
    // Assert that the signup page is rendered after clicking the button
    expect(getByText(/signup page/i)).toBeInTheDocument();
  });*/


  test('renders the key features section', () => {
    const featuresHeading = screen.getByText(/empower your event journey/i);
    expect(featuresHeading).toBeInTheDocument();
    
    const features = [
      'Discover Events',
      'Register & Get Tickets',
      'Receive Notifications',
      'Create & Manage Events'
    ];

    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  test('renders upcoming events section', () => {
    const upcomingEventsHeading = screen.getByText(/don't miss out/i);
    expect(upcomingEventsHeading).toBeInTheDocument();
  });

  test('renders footer section', () => {
    const aboutUsHeading = screen.getByText(/about us/i);
    expect(aboutUsHeading).toBeInTheDocument();
    
    const quickLinksHeading = screen.getByText(/quick links/i);
    expect(quickLinksHeading).toBeInTheDocument();
  });
});
