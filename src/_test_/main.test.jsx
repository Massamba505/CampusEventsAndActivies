// src/index.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter as MockBrowserRouter } from 'react-router-dom';
import { AuthContextProvider as MockAuthContextProvider } from '../context/AuthContext.jsx';
import App from '../App.jsx'; // Adjust path if needed
import '@testing-library/jest-dom';

describe('App Component', () => {
  test('renders the App component correctly', () => {
    // Render App with mocked context and router
    render(
      <MockBrowserRouter>
        <MockAuthContextProvider>
          <App />
        </MockAuthContextProvider>
      </MockBrowserRouter>
    );

    // Check for text in the title
    const titleElement = screen.getByText(/Find Events to/i); // Adjust the regex to match the title
    expect(titleElement).toBeInTheDocument();

    // Check for welcome message
    const welcomeText = screen.getByText(/Welcome to the Campus Events and Activities App/i); // Adjust accordingly
    expect(welcomeText).toBeInTheDocument();

    // You can add more assertions as needed
  });
});
