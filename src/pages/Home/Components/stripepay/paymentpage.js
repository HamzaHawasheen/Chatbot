import React, { useEffect, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import styles from "./style.module.css";


const stripePromise = loadStripe("pk_test_51IWKiGLqpXDNxv1IiPkop9Gf2AyKjJ4JQ1O55skx3PZ3APOI8z8ZuKnlE3qD61RfibZGwlzDn8AfxCe1qNy9eVNI00GJpsq9lq");

const PaymentPageDisplay = ({ clientSecret, price, params, sendQueryToAPI }) => { 
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const stripe = useStripe(); 
  const elements = useElements();

  useEffect(() => {
    if (clientSecret) {
      setLoading(false); 
    }
  }, [clientSecret]);

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
      console.log("Error:", error);
      await params.injectMessage("حدث خطأ. يرجى إعادة المحاولة");
      await params.goToPath("ask_doctor");

    } else if (paymentIntent.status === 'succeeded') {
      console.log("Payment succeeded:", paymentIntent);
      await params.injectMessage("تم الدفع بنجاح");
      const CapturePayment = await sendQueryToAPI(`
        احفظ البيانات 
        {
          payment_status: '${paymentIntent.status}',
          currency_code: '${paymentIntent.currency}',
          user_id: '1115',
          appointment_id: '1',
          amount: '${price}',
          plan_id: '1',
          providerID: '6',
          client_secret: '${clientSecret}',
          payment_id: '${paymentIntent.id}'
        }
      `);
      await params.injectMessage(CapturePayment);
      await params.goToPath("second_start")
    }
  };

  return (
    <div className={styles.paymentcontainer}>
      {loading ? (
        <p>جار تحميل صفحة الدفع...</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.paymentform}>
          <div className={styles.titleAndCardInfo}>
              <h6 className={styles.subtitle}>
                  <span className={styles.cardInfo}> (فيزا، ماستر كارد، والمزيد ... الخ) </span>
              </h6>
              <h3 className={styles.title}> الدفع بالبطاقة </h3>

          </div>
          <CardElement
              options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      letterSpacing: '0.025em',
                      fontFamily: 'Arial, sans-serif',
                      iconColor: '#666EE8',
                      '::placeholder': {
                        color: '#CFD7E0',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
              }}
              />
          <button type="submit" disabled={!stripe}> الدفع {price} دولار </button>
        </form>
      )}
    </div>
  );
};

const PaymentPageWrapper = ({ clientSecret, price, params, sendQueryToAPI }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPageDisplay clientSecret={clientSecret} price={price} params={params} sendQueryToAPI={sendQueryToAPI} />
    </Elements>
  );
};

export default PaymentPageWrapper;









          // <label> رقم البطاقة </label>
          // <input
          // type="text"
          // placeholder="1234 1234 1234 1234"
          // />

          // <label> تاريخ الانتهاء </label>
          // <input 
          // type="text"
          // placeholder="سنة / شهر"
          // />

          // <label> رمز الأمان </label>
          // <input
          // type="text"
          // placeholder="CVC"
          // />

          // <label> الدولة </label>
          // <input
          // type="text"
          // />

          // <label> الإجمالي {price} </label>