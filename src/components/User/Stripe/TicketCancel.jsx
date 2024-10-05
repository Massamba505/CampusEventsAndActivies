import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { myConstant } from '../../../const/const';
import Navbar from '../../Navbar';
import { TicketCheckIcon } from 'lucide-react';

const TicketCancel = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (sessionId) {
        try {
          const res = await fetch(myConstant + `/api/tickets/cancel/${sessionId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch ticket details');
          }
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
      <div className="flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mb-4"></div>
              <p className="text-gray-700 text-lg">Canceling your payment...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <TicketCheckIcon className="text-red-500 w-16 h-16 mb-4" />
              <p className="text-gray-800 text-lg font-semibold">Payment Canceled</p>
              <p className="text-gray-600 text-sm mt-2">Your transaction has been canceled successfully.</p>
              <Link to="/home" className="mt-4 decoration-transparent inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                Go Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketCancel;
