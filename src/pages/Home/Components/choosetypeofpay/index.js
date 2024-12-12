import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

const ChooseTypeOfPay = ({ params }) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  
  const getSubscriptionPlans = async () => {
    const url = "https://dev.hakini.net/api/get-subscription-plans";
    let MoreInformation = [];

    try {
        const response = await fetch(url);
        const result = await response.json();
        const resultDataPlans = result.data.plans;

        resultDataPlans.forEach(plan => {
          MoreInformation.push(plan.title);
          MoreInformation.push(plan.description);
          MoreInformation.push(plan.cost_android);
        });
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
    }

    return MoreInformation;
  };

  const mapToPaymentOptions = (MoreInformation) => {
    const options = [];
    for (let i = 0; i < MoreInformation.length; i += 3) {
      options.push({
        title: MoreInformation[i],
        offer: MoreInformation[i + 1],
        price: `$${MoreInformation[i + 2]}`,
      });
    }
    setPaymentOptions(options);
  };


  useEffect(() => {
    const fetchData = async () => {
      const MoreInformation = await getSubscriptionPlans();
      mapToPaymentOptions(MoreInformation);
    };

    fetchData();
  }, []); 

  const handleStar = async (option) => {
    console.log(option);
    if (option['title'] === "اشتراك فضي") {
        await params.goToPath("gold_subscription");
    } else {
        await params.goToPath("selver_subscription");
    }
  };

  return (
    <div className={styles.payment_options}>
      {paymentOptions.map((option, index) => (
        <button
          key={index}
          className={styles.payment_box}
          onClick={() => handleStar(option)}
        >
          <div className={styles.header}>
            {option.offer}
          </div>
          <div className={styles.content}>
            <h2>{option.title}</h2>
            <p>{option.price}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChooseTypeOfPay;
