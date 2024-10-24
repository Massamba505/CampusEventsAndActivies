import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TicketCard from '../components/User/TicketCard';
import '@testing-library/jest-dom';

describe('TicketCard Component', () => {
  const mockTicket = {
    _id: 'ticket123',
    event_id: 'event456',
    ticket_type: 'VIP',
    price: 100,
    event_date: '2024-11-25T18:30:00Z',
    payment_status: 'Paid',
    refund_status: 'Not Refunded',
    qr_code: 'https://example.com/qrcode.png',
  };

  it('renders the ticket details correctly', () => {
    render(<TicketCard ticket={mockTicket} />);

    // Check if the QR code image is rendered
    const qrCodeImage = screen.getByAltText('QR Code');
    expect(qrCodeImage).toHaveAttribute('src', mockTicket.qr_code);
    screen.debug();
    // Check if the ticket details are rendered
    expect(screen.getByText(mockTicket._id)).toBeInTheDocument();
    expect(screen.getByText(mockTicket.event_id)).toBeInTheDocument();
    expect(screen.getByText(mockTicket.ticket_type)).toBeInTheDocument();
    expect(screen.getByText(`$${mockTicket.price}`)).toBeInTheDocument();
  });

  it('should apply hover effect when rendered', () => {
    render(<TicketCard ticket={mockTicket} />);

    // Check if the component has hover class 'hover:scale-105'
    const cardElement = screen.getByRole('img').closest('div'); // Gets the outer div that holds the hover effect
    expect(cardElement).toHaveClass('hover:scale-105');
  });
});
