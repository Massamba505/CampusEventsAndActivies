import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { myConstant } from '../../../const/const';

const TicketCancel = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        if (sessionId) {
          const res = await fetch(myConstant + `/api/tickets/cancel/${sessionId}`);
          if (!res.ok) {
            throw new Error('Failed to cancel ticket details.');
          }
          const data = await res.json();
          setTicketDetails(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTicketDetails();
  }, [sessionId]);

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : ticketDetails ? (
        <div>
          <h2 style={{ color: 'red' }}>Payment canceled!</h2>
          <p>Your ticket details:</p>
          <pre>{ticketDetails}</pre>
        </div>
      ) : (
        <p>Loading ticket details...</p>
      )}
    </div>
  );
};

export default TicketCancel;
