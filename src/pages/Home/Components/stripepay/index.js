import React, { useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret }) => {
    console.log(clientSecret);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error("Payment failed:", error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log("Payment succeeded!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>أدخل تفاصيل بطاقتك الائتمانية</h3>
      <CardElement />
      <button type="submit" disabled={!stripe}>دفع الآن</button>
    </form>
  );
};

export default CheckoutForm;
