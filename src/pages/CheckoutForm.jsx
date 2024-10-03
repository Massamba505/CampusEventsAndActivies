import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { myConstant } from '../const/const';

// Stripe Public Key
const stripePromise = loadStripe("pk_test_51Q5JRhGx52yvRFk8wYiDUQ0qC2bWSul1gvALpu09WQBTsiJxW3l4NaRq5puPjoJbCpCELOBTa23B3QMp2LKxVAyC00eoeGmm9O");

const CheckoutForm = ({ eventId, ticketType, price, eventDate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [ticketId, setTicketId] = useState('');

  
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  useEffect(() => {
    // Create a payment intent and get the client secret
    const initiatePayment = async () => {
      try {
        const response = await fetch( myConstant +  '/api/tickets/buy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            eventId,
            ticketType,
            price,
            eventDate
          })
        });

        const data = await response.json();

        if (response.ok) {
          setClientSecret(data.clientSecret);
          setTicketId(data.ticketId);
        } else {
          toast.error(data.error || 'Failed to create payment intent');
        }
      } catch (error) {
        console.error('Error initiating payment:', error);
        toast.error('Error initiating payment');
      }
    };

    initiatePayment();
  }, [eventId, ticketType, price, eventDate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // If payment is successful, confirm the ticket and generate QR code
      const confirmPaymentResponse = await fetch(myConstant + '/api/tickets/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketId,
          paymentIntentId: paymentIntent.id
        })
      });

      const confirmData = await confirmPaymentResponse.json();

      if (confirmPaymentResponse.ok) {
        toast.success('Payment successful and ticket confirmed!');
      } else {
        toast.error(confirmData.error || 'Failed to confirm ticket');
      }

    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Error confirming payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div className="p-4 border rounded-lg">
          <CardElement />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full p-2 text-white bg-blue-600 rounded-lg ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

const CheckoutPage = ({ eventId, ticketType, price, eventDate }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm eventId={eventId} ticketType={ticketType} price={price} eventDate={eventDate} />
    </Elements>
  );
};

export default CheckoutPage;
