import React, { useState } from "react";
import styles from "./style.module.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../stripepay";
import PaymentPageDisplay from "../stripepay/paymentpage";

const PayPlanCard = ({ payplan, payplansessions }) => (
  <div id="payplancard">
    <h3>{payplan}</h3>
    <h3>{payplansessions}</h3>
  </div>
);
const PayPlanButton = ({ params, doctor_id, doctor_name, timezone, formattedDate, selectedDate, TimeList,  PayPlanList, selectedTime, onSessionDetailes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [token, setToken] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false); 

  const PayPlanListconvert = PayPlanList.split(",").map(Number);

  const getPayPlan = (index) => {
    const planItems = PayPlanList.split("\n") 
      .map(item => item.trim())
      .filter(item => item !== ""); 
  
    const selectedPlan = planItems[index];
  
    if (!selectedPlan) {
      console.error(`No plan found at index ${index}`);
      return { price: "غير متوفر", sessions: "غير متوفر" };
    }
  
    const [costPart, sessionsPart] = selectedPlan.split(","); 
    const price = costPart.split(":")[1].trim();
    const sessions = sessionsPart.split(":")[1].trim(); 
  
    return { price, sessions };
  };

  const handleNextRight = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + 1;
      while (newIndex < PayPlanList.split("\n").length && getPayPlan(newIndex).price === "غير متوفر") {
        newIndex++;
      }
      if (newIndex >= PayPlanList.split("\n").length) {
        newIndex = 0; 
      }
      return newIndex;
    });
  };
  
  const handleNextLeft = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex - 1;
      while (newIndex >= 0 && getPayPlan(newIndex).price === "غير متوفر") {
        newIndex--;
      }
      if (newIndex < 0) {
        newIndex = PayPlanList.split("\n").length - 1; 
      }
      return newIndex;
    });
  };

  const handleProgramSelect = async () => {
    const { price, sessions } = getPayPlan(currentIndex);
    

    console.log("time", `${selectedTime['start']}-${selectedTime['end']}`)
    console.log("selectedDate", selectedDate);
    console.log("price", price);
    console.log("sessions", sessions);
    console.log("timezone", timezone);
    console.log("formattedDate", formattedDate);
    console.log("doctorid", doctor_id)

    await params.injectMessage("هذه هي البيانات التي اخترتها");
    await params.injectMessage(`الدكتور المختار هو ${doctor_name}`);
    await params.injectMessage(`التاريخ المختار هو ${formattedDate}`);
    await params.injectMessage(`الوقت المختار هو ${selectedTime['startWithZone']} - ${selectedTime['endWithZone']}`);
    await params.injectMessage(`عدد الجلسات هو ${sessions}`);
    await params.injectMessage(`السعر الإجمالي هو ${price} دولار`);

    const sessionDetails = {
      doctorid: doctor_id,
      doctor_name: doctor_name,              
      formattedDate: formattedDate,   
      selectedDate: selectedDate,         
      selectedTime: `${selectedTime['startWithZone']} - ${selectedTime['endWithZone']}`, 
      sessions: sessions,              
      price: price,       
      timezone: timezone,               
    };
    onSessionDetailes(sessionDetails);
    await params.goToPath("confirm_the_request");
    return "";

    // let authToken = token;
    // if (!authToken) {
    //   authToken = await loginAndGetToken();
    //   setToken(authToken);
    // }

    // if (authToken) {
    //   const formData = new FormData();
    //   formData.append("time", `${selectedTime['start']}-${selectedTime['end']}`);
    //   formData.append("date", selectedDate);
    //   formData.append("therapist_id", doctor_id);
    //   formData.append("type", 2);
    //   formData.append("cost", price);
    //   formData.append("plan_id", sessions);
    //   formData.append("source", "chatbot");
    //   formData.append("timezone", timezone);
    //   formData.append("withPayment", "pay_now");

      // try {
      //   const response = await fetch("https://dev.hakini.net/api/appointment", {
      //     method: "POST",
      //     headers: {
      //       "Authorization": `Bearer ${authToken}`,
      //     },
      //     body: formData,
      //   });

      //   if (response.ok) {
      //     await params.injectMessage("تم حفظ البيانات");
      //     await params.injectMessage("شكرا لك ");
      //     params.goToPath("confirm_the_request");
      //     return "";

          // const PaymentPage = await sendQueryToAPI(`أريد المفتاح ${price}`);
          // const clientSecret = String(PaymentPage);
          // setClientSecret(clientSecret);
          // await params.injectMessage(clientSecret);
          // setShowPaymentPage(true); 
          // const PaymentPageDisplayShow = <PaymentPageDisplay clientSecret={clientSecret} price={price} params={params} />
          // await params.injectMessage(PaymentPageDisplayShow)


      //   } else {
      //     await params.injectMessage("لم يتم حفظ البيانات");
      //     await params.injectMessage("من فضلك أعد المحاولة");
      //     params.goToPath("ask_doctor");
      //   }
      // } catch (error) {
      //   await params.injectMessage("لم يتم حفظ البيانات");
      //   await params.injectMessage("من فضلك أعد المحاولة");
      //   params.goToPath("ask_doctor");
      // }
    // } else {
    //   console.log("Failed to retrieve token, please try again.");
    //   params.goToPath("ask_doctor");
    // }
  };

  return (
    <div className={styles.continear}>
      <div className={styles.arrow_left} onClick={handleNextLeft}>
        ←
      </div>

      <button className={styles.button_card} onClick={handleProgramSelect}>
        <PayPlanCard
          payplan={`السعر الإجمالي هو  ${getPayPlan(currentIndex).price} دولار`}
          payplansessions={`عدد الجلسات هو  ${getPayPlan(currentIndex).sessions}`}
        />
      </button>

      <div className={styles.arrow_right} onClick={handleNextRight}>
        →
      </div>
    </div>
  );
};

export default PayPlanButton;
