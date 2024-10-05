import { useEffect, useState } from 'react';
import TicketCard from '../TicketCard22'; // Adjust the path as necessary
import { useSearchParams } from 'react-router-dom';
import { myConstant } from '../../../const/const';
import Navbar from '../../Navbar';

const TicketSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (sessionId) {
        try {
          const res = await fetch(myConstant + `/api/tickets/success/${sessionId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch ticket details');
          }
          const data = await res.json();
          setTicketDetails(data.ticket);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTicketDetails();
  }, [sessionId]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mb-4"></div>
              <p className="text-gray-700 text-lg">Loading ticket details...</p>
            </div>
          ) : ticketDetails ? (
            <TicketCard ticket={ticketDetails} />
          ) : (
            <p className="text-gray-600 text-lg text-center">No ticket details available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketSuccess;
