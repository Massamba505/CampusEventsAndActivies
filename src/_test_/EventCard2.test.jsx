import { render, screen,fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EventCard from '../components/User/EventCard'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

describe('User EventCard Component', () => {
    const mockEvent = {
      event_id: '1',
      title: 'Sample Event',
      eventAuthor: 'John Doe',
      date: '23/10/2024',
      startTime: '10:00',
      endTime: '14:00',
      location: '123 Main St',
      images: ['https://example.com/image.jpg'],
      isPaid: true,
      ticketPrice: 20,
      maxAttendees: 100,
      currentAttendees: 50,
      food_stalls: true,
      isCancelled: false,
      discount: 10,
      category: [{ name: 'Music' }, { name: 'Art' }],
    };
  
    const onDeleteEventMock = vi.fn();
    const onEditEventMock = vi.fn();
  
    beforeEach(() => {
      onDeleteEventMock.mockClear();
      onEditEventMock.mockClear();
    });
  
    it('renders event details correctly', () => {
      render(<EventCard event={mockEvent} onDeleteEvent={onDeleteEventMock} onEditEvent={onEditEventMock} />);
  
      // Check if the event card is in the document
      const eventCard = screen.getByTestId('event-card');
      expect(eventCard).toBeInTheDocument();
  
      // Check event title
      expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
  
      // Check event author
      expect(screen.getByText(mockEvent.eventAuthor)).toBeInTheDocument();
  
      // Check date and time
      expect(screen.getByText(`${mockEvent.date} ${mockEvent.startTime} - ${mockEvent.endTime}`)).toBeInTheDocument();
  
      // Check location
      expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
  
      // Check ticket price
      expect(screen.getByText(`Ticket Price: $${mockEvent.ticketPrice}`)).toBeInTheDocument();
  
      // Check categories
      expect(screen.getByText(`Categories: ${mockEvent.category.map(cat => cat.name).join(', ')}`)).toBeInTheDocument();
    });
  
    it('triggers delete event when Cancel Event button is clicked', () => {
      render(<EventCard event={mockEvent} onDeleteEvent={onDeleteEventMock} onEditEvent={onEditEventMock} />);
  
      // Click the Cancel Event button
      const cancelButton = screen.getByRole('button', { name: /Cancel Event/i });
      fireEvent.click(cancelButton);
  
      // The deletion modal should open (assuming DeleteEvent handles the modal logic)
      // Simulating modal confirmation (assuming it's handled in the DeleteEvent component)
      const confirmDeleteButton = screen.getByRole('button', { name: /Cancel Event/i }); // Change this to the actual button name in your DeleteEvent component
      fireEvent.click(confirmDeleteButton);
  
      expect(onDeleteEventMock).toHaveBeenCalledWith(mockEvent.event_id);
    });
  
    // it('opens edit modal on Edit button click', () => {
    //   render(<EventCard event={mockEvent} onDeleteEvent={onDeleteEventMock} onEditEvent={onEditEventMock} />);
  
    //   // Click the Edit button
    //   const editButton = screen.getByRole('button', { name: /Edit/i });
    //   fireEvent.click(editButton);
  
    //   // Verify the edit modal opens (check some property in the modal or call to onEditEvent)
    //   expect(onEditEventMock).toHaveBeenCalled();
    // });
  
    it('shows canceled event message if isCancelled is true', () => {
      const canceledEvent = { ...mockEvent, isCancelled: true };
  
      render(<EventCard event={canceledEvent} onDeleteEvent={onDeleteEventMock} onEditEvent={onEditEventMock} />);
  
      // Check if the canceled message is displayed
      expect(screen.getByText(/event canceled/i)).toBeInTheDocument();
    });
  
  });
