
const TicketCard = ({ ticket, onCancel, onRefund }) => {
  console.log(ticket)
  return (
    <div className="max-w-sm p-4 border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform cursor-auto transform hover:bg-gray-100">
      <img
        src={ticket.qr_code}
        alt="QR Code"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl text-blue-500 font-bold mb-2">{ticket.event_id.title}</h2>
        <p className="text-gray-700"><strong>Ticket ID:</strong> {ticket._id}</p>
        <p className="text-gray-700"><strong>Event Date:</strong> {new Date(ticket.event_date).toLocaleString()}</p>
        <p className="text-gray-700"><strong>Price:</strong> ${ticket.price}</p>
        <p className="text-gray-700"><strong>Payment Status:</strong> {ticket.payment_status}</p>
        <p className="text-gray-700"><strong>Refund Status:</strong> {ticket.refund_status}</p>
        
        <div className="mt-4 gap-3 flex justify-between">
          {/* Cancel Ticket Button */}
          {/* {ticket.payment_status === 'Paid' && ticket.refund_status !== 'Refunded' && ( */}
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => onCancel(ticket._id)}
            >
              Cancel Ticket
            </button>

          {/* Refund Ticket Button */}
          {ticket.refund_status === 'Not Requested' && (
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => onRefund(ticket._id)}
            >
              Request Refund
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
