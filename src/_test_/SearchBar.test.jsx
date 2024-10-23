import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
  error: vi.fn(),
}));

describe('SearchBar Component', () => {
  const handleSearchMock = vi.fn();

  beforeEach(() => {
    handleSearchMock.mockClear();
    toast.error.mockClear();
  });

  it('renders input and button correctly', () => {
    render(<SearchBar handleSearch={handleSearchMock} />);

    const inputElement = screen.getByPlaceholderText('Keyword');
    const buttonElement = screen.getByRole('button', { name: /search/i });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it('updates the search term correctly when typing', () => {
    render(<SearchBar handleSearch={handleSearchMock} />);

    const inputElement = screen.getByPlaceholderText('Keyword');
    fireEvent.change(inputElement, { target: { value: 'React' } });

    expect(inputElement.value).toBe('React');
  });

  it('triggers an error toast if the input is empty on submit', () => {
    render(<SearchBar handleSearch={handleSearchMock} />);

    const buttonElement = screen.getByRole('button', { name: /search/i });
    fireEvent.click(buttonElement);

    expect(toast.error).toHaveBeenCalledWith('input a keyword');
    expect(handleSearchMock).not.toHaveBeenCalled();
  });

  it('calls handleSearch with the correct term when form is submitted', () => {
    render(<SearchBar handleSearch={handleSearchMock} />);

    const inputElement = screen.getByPlaceholderText('Keyword');
    const buttonElement = screen.getByRole('button', { name: /search/i });

    fireEvent.change(inputElement, { target: { value: 'React' } });
    fireEvent.click(buttonElement);

    expect(handleSearchMock).toHaveBeenCalledWith('React');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('trims the search term before calling handleSearch', () => {
    render(<SearchBar handleSearch={handleSearchMock} />);

    const inputElement = screen.getByPlaceholderText('Keyword');
    const buttonElement = screen.getByRole('button', { name: /search/i });

    fireEvent.change(inputElement, { target: { value: '  React  ' } });
    fireEvent.click(buttonElement);

    expect(handleSearchMock).toHaveBeenCalledWith('React');
    expect(toast.error).not.toHaveBeenCalled();
  });
});
