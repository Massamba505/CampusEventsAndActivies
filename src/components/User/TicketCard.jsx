import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";

const TicketCard = ({ ticket }) => {
  return (
    <div className="p-4 mx-auto bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={ticket.qr_code}
        alt="QR Code"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 text-sm">
        <h2 className="text-xl font-bold mb-2">Ticket Details</h2>
        <p className="text-gray-700"><strong>Ticket ID:</strong> {ticket._id}</p>
        <p className="text-gray-700"><strong>Event ID:</strong> {ticket.event_id}</p>
        <p className="text-gray-700"><strong>Ticket Type:</strong> {ticket.ticket_type}</p>
        <p className="text-gray-700"><strong>Price:</strong> R{ticket.price}</p>
        <p className="text-gray-700"><strong>Event Date:</strong> {new Date(ticket.event_date).toLocaleString()}</p>
        <p className="text-gray-700"><strong>Payment Status:</strong> {ticket.payment_status}</p>
        <p className="text-gray-700"><strong>Refund Status:</strong> {ticket.refund_status}</p>
      </div>
    </div>
  );
};

export default TicketCard;
