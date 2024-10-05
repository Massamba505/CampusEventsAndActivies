import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { myConstant } from '../../const/const';
import TicketCard from './TicketCard22';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${myConstant}/api/tickets`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data || []);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchTickets();
  }, [token]);

  // Function to handle ticket cancellation
  const handleCancel = async (ticketId) => {
    try {
      const response = await fetch(`${myConstant}/api/tickets/${ticketId}/cancel`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel ticket');
      }

      // Update the state after successful cancellation
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? { ...ticket, payment_status: 'Cancelled' } : ticket
      ));

      toast.success('Ticket cancelled successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to handle refund request
  const handleRefund = async (ticketId) => {
    try {
      const response = await fetch(`${myConstant}/api/tickets/${ticketId}/refund`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to request refund');
      }

      // Update the state after successful refund request
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? { ...ticket, refund_status: 'Requested' } : ticket
      ));

      toast.success('Refund requested successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="my-tickets">
      <h2 className="text-3xl font-semibold mb-4 text-center">My Tickets</h2>
      <div className="flex flex-wrap justify-center sm:justify-start sm:flex-row gap-4">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onCancel={handleCancel}
              onRefund={handleRefund}
            />
          ))
        ) : (
          <p>You have no tickets.</p>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
