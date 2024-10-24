import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import SmallTicketCard from '../components/User/TicketCard22';
import '@testing-library/jest-dom';

describe('SmallTicketCard Component', () => {
  const mockTicket = {
    _id: 'ticket123',
    ticket_type: 'VIP',
    qr_code: 'https://example.com/qrcode.png',
    price: 150.0,
    event_id: {
      event_id: 'event456',
      title: 'Awesome Event',
      date: '2024-11-25',
      start_time: '18:30',
      end_time: '21:00',
      location: 'Event Location',
    },
    refund_status: 'Not Requested',
  };

  const onCancelMock = vi.fn();
  const onRefundMock = vi.fn();

  it('renders ticket details correctly', () => {
    render(
      <Router>
        <SmallTicketCard ticket={mockTicket} onCancel={onCancelMock} onRefund={onRefundMock} />
      </Router>
    );
    //screen.debug();
    // Check if the QR code is rendered
    const qrCodeImage = screen.getByAltText('QR Code');
    expect(qrCodeImage).toHaveAttribute('src', mockTicket.qr_code);
    // Check if the event title is rendered
    expect(screen.getByText(/Awesome Event/i)).toBeInTheDocument();
    // Check if the event time is rendered
    expect(screen.getByText('18:30-21:00')).toBeInTheDocument();
    // Check if the price is rendered
    expect(screen.getByText('R150.00')).toBeInTheDocument();
    // Check if the location is rendered
    expect(screen.getByText(mockTicket.event_id.location)).toBeInTheDocument();
    // Check if the ticket ID is rendered
    expect(screen.getByText(mockTicket._id)).toBeInTheDocument();
  });

//   it('calls onCancel when cancel button is clicked', () => {
//     render(
//       <Router>
//         <SmallTicketCard ticket={mockTicket} onCancel={onCancelMock} onRefund={onRefundMock} />
//       </Router>
//     );

//     // Check if the cancel button calls the onCancel function
//     const cancelButton = screen.getByText(/Cancel Ticket/i);
//     fireEvent.click(cancelButton);
//     expect(onCancelMock).toHaveBeenCalledWith(mockTicket._id);
//   });

//   it('calls onRefund when refund button is clicked if refund not requested', () => {
//     render(
//       <Router>
//         <SmallTicketCard ticket={mockTicket} onCancel={onCancelMock} onRefund={onRefundMock} />
//       </Router>
//     );

//     // Check if the refund button calls the onRefund function
//     const refundButton = screen.getByText(/Request Refund/i);
//     fireEvent.click(refundButton);
//     expect(onRefundMock).toHaveBeenCalledWith(mockTicket._id);
//   });

  it('does not show refund button if refund has been requested', () => {
    const ticketWithRequestedRefund = {
      ...mockTicket,
      refund_status: 'Requested',
    };

    render(
      <Router>
        <SmallTicketCard ticket={ticketWithRequestedRefund} onCancel={onCancelMock} onRefund={onRefundMock} />
      </Router>
    );

    // Refund button should not be present
    expect(screen.queryByText(/Request Refund/i)).not.toBeInTheDocument();
  });
});
