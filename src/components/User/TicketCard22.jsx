import { CalendarDateRangeIcon, TicketIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const SmallTicketCard = ({ ticket, onCancel, onRefund }) => {
  return (
    <div className="max-w-xs p-2 border border-gray-300 rounded-lg shadow-sm overflow-hidden transition-transform cursor-pointer transform hover:bg-gray-100">
      <img
        src={ticket.qr_code}
        alt="QR Code"
        className="w-full h-32 object-contain" // Changed to object-contain
      />
      <div className="p-2">
        <h2 className="text-sm text-blue-500 font-bold mb-1">{ticket.event_id.title}</h2>
        
        <div className="flex items-center space-x-1">
          <CalendarDateRangeIcon className="h-4 w-4 text-gray-500" />
          <small className="text-xs text-gray-500">{new Date(ticket.event_date).toLocaleString()}</small>
        </div>
        
        <div className="flex items-center space-x-1">
          <TicketIcon className="h-4 w-4 text-gray-500" />
          <small className="text-xs text-gray-500"><strong>Ticket ID:</strong> {ticket._id}</small>
        </div>
        
        <div className="flex items-center space-x-1">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
          <small className="text-xs text-gray-500"><strong>Price:</strong> ${ticket.price}</small>
        </div>
        
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="h-4 w-4 text-gray-500" />
          <small className="text-xs text-gray-500"><strong>Payment Status:</strong> {ticket.payment_status}</small>
        </div>
        
        <div className="flex items-center space-x-1">
          <XCircleIcon className="h-4 w-4 text-gray-500" />
          <small className="text-xs text-gray-500"><strong>Refund Status:</strong> {ticket.refund_status}</small>
        </div>

        <div className="mt-2 flex justify-between">
          {/* Cancel Ticket Button */}
          <button
            className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
            onClick={() => onCancel(ticket._id)}
          >
            Cancel
          </button>

          {/* Refund Ticket Button */}
          {ticket.refund_status === 'Not Requested' && (
            <button
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
              onClick={() => onRefund(ticket._id)}
            >
              Refund
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmallTicketCard;
