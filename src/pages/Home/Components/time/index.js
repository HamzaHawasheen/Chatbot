import React, { useState } from "react";
import styles from "./style.module.css";
import PayPlanButton from "../payplan/index"

const TimeCard = ({ time }) => (
    <div id="timecard">
        <h3>{time}</h3>
    </div>
);

const TimeButton = ({ TimeList, params, sendQueryToAPI, DoctorName, selectedDate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextRight = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % TimeList.length);
    };
  
    const handleNextLeft = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + TimeList.length) % TimeList.length);
    };

    const handleProgramSelect = async () => {
        const selectedTime = TimeList[currentIndex];
        const DoctorPayPlanUserChooseQuery = await sendQueryToAPI(` ما هي خطة الدفع ل دكتور ${selectedTime}`);

        const listItems = String(DoctorPayPlanUserChooseQuery)
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "");
        const PayPlanList = String(listItems);
        await params.injectMessage("من فضلك اختر الجلسة المناسبة لك")

        const DoctorPayPlanUserChoose = <PayPlanButton params={params} sendQueryToAPI={sendQueryToAPI} PayPlanList={PayPlanList} DoctorName={DoctorName} selectedDate={selectedDate} selectedTime={selectedTime} />
        await params.injectMessage(DoctorPayPlanUserChoose); 
      };

    return (
    <div className={styles.continear}>
      <div className={styles.arrow_left} onClick={handleNextLeft}>
        {" "}
        ←{" "}
      </div>

      <button className={styles.button_card} onClick={handleProgramSelect}>
        <TimeCard 
          time={TimeList[currentIndex]}  
        />
      </button> 

      <div className={styles.arrow_right} onClick={handleNextRight}>
        {" "}
        →{" "}
      </div>
    </div>
    );
};

export default TimeButton;
