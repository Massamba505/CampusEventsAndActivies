import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteEvent from '../components/User/DeleteEvent';
import '@testing-library/jest-dom';

describe('DeleteEvent Component', () => {
  const mockSetModalVisible = vi.fn();
  const mockOnDeleteEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal when visible', () => {
    render(
      <DeleteEvent
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onDeleteEvent={mockOnDeleteEvent}
      />
    );

    expect(screen.getByText(/Are you sure you want to Cancel this event?/i)).toBeInTheDocument();
  });

  it('should not render the modal when not visible', () => {
    render(
      <DeleteEvent
        modalVisible={false}
        setModalVisible={mockSetModalVisible}
        onDeleteEvent={mockOnDeleteEvent}
      />
    );

    expect(screen.queryByText(/Cancel Event/i)).not.toBeInTheDocument();
  });

  it('should call onDeleteEvent when "Cancel Event" button is clicked', () => {
    render(
      <DeleteEvent
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onDeleteEvent={mockOnDeleteEvent}
      />
    );

    const cancelButton = screen.getByTestId("del-button");
    fireEvent.click(cancelButton);

    expect(mockOnDeleteEvent).toHaveBeenCalled();
  });

  it('should call setModalVisible(false) when "Cancel" button is clicked', () => {
    render(
      <DeleteEvent
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        onDeleteEvent={mockOnDeleteEvent}
      />
    );

    const cancelButton = screen.getByTestId("cancButton");
    fireEvent.click(cancelButton);

    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });

});
