import { TicketIcon, CurrencyDollarIcon,  CalendarIcon } from "@heroicons/react/24/outline";
import { LocateIcon, TicketPercentIcon, TimerIcon } from "lucide-react";

const SmallTicketCard = ({ ticket, onCancel, onRefund }) => {
  return (
    <div className="w-80 p-4 border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:shadow-xl bg-white">
      <div className="relative mb-2">
        <img
          src={ticket.qr_code}
          alt="QR Code"
          className="w-full h-32 object-contain border-b border-gray-200"
        />
        <div className={`${ticket.ticket_type === 'RSVP' ? 'bg-blue-500' : 'bg-green-500'} absolute -top-4 -left-4 text-xs font-bold text-white px-2 py-1 rounded shadow`}>
        {ticket.ticket_type}
        </div>
      </div>
      <div className="p-2">
        <h2 className="text-lg text-blue-600 font-semibold mb-2">{ticket.event_id?.title}</h2>
        
        <div className="flex items-center space-x-1 mb-1">
          <CalendarIcon className="h-5 w-5 text-gray-600" />
          <small className="text-xs text-gray-600"><strong>Event Date:</strong> {ticket.event_id.date}</small>
        </div>
        
        <div className="flex items-center space-x-1 mb-1">
          <TimerIcon className="h-5 w-5 text-gray-600" />
          <small className="text-xs text-gray-600"><strong>Event Time:</strong> {ticket.event_id.start_time}-{ticket.event_id.end_time}</small>
        </div>
        
        <div className="flex items-center space-x-1 mb-1">
          {ticket.ticket_type !== 'RSVP' ? (
            <>
              <CurrencyDollarIcon className="h-5 w-5 text-gray-600" />
              <small className="text-xs text-gray-600"><strong>Price:</strong> R{ticket.price.toFixed(2)}</small>
            </>
          ) : (
            <>
            <TicketPercentIcon  className="h-5 w-5 text-gray-600"/>
            <small className="text-xs text-gray-600"><strong>Ticket Type:</strong> RSVP</small>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-1 mb-1">
          <LocateIcon className="h-5 w-5 text-gray-600" />
          <small className="text-xs text-gray-600"><strong>Location:</strong> {ticket.event_id.location}</small>
        </div>
        
        <div className="flex items-center space-x-1 mb-1">
          <TicketIcon className="h-5 w-5 text-gray-600" />
          <small className="text-xs text-gray-600"><strong>Ticket ID:</strong> {ticket._id}</small>
        </div>

        {/* <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition duration-200"
            onClick={() => onCancel(ticket._id)}
          >
            Cancel Ticket
          </button>

          {ticket.refund_status === 'Not Requested' && (
            <button
              className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
              onClick={() => onRefund(ticket._id)}
            >
              Request Refund
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default SmallTicketCard;
