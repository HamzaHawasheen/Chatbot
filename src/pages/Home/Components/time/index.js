import React, { useState } from "react";
import styles from "./style.module.css";
import PayPlanButton from "../payplan/index";
import { payPlan } from "../flowcontrol"

const TimeCard = ({ startWithZone, endWithZone }) => (
    <div id="timecard">
        <h3>{startWithZone} - {endWithZone}</h3>
    </div>
);

const TimeButton = ({ params, doctor_id, doctor_name, timezone, formattedDate, selectedDate, TimeList, onSessionDetailes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextRight = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % TimeList.length);
    };
  
    const handleNextLeft = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + TimeList.length) % TimeList.length);
    };

    const handleProgramSelect = async () => {
        const selectedTime = TimeList[currentIndex];
        const DoctorPayPlanUserChooseQuery = await payPlan(doctor_id);
        console.log(DoctorPayPlanUserChooseQuery);


        const jsonData = JSON.stringify(DoctorPayPlanUserChooseQuery, null, 2);
        console.log("Formatted Data:", jsonData);
        const listItems = DoctorPayPlanUserChooseQuery.map(item => `Cost: ${item.cost}, Sessions: ${item.no_sessions}`);
        const PayPlanList = listItems.join("\n");

        await params.injectMessage("من فضلك اختر الجلسة المناسبة لك");

        const DoctorPayPlanUserChoose = <PayPlanButton params={params} doctor_id={doctor_id} doctor_name={doctor_name} timezone={timezone} formattedDate={formattedDate} selectedDate={selectedDate} TimeList={TimeList} PayPlanList={PayPlanList} selectedTime={selectedTime} onSessionDetailes={onSessionDetailes} />;
        await params.injectMessage(DoctorPayPlanUserChoose); 
    };

    return (
    <div className={styles.continear}>
      <div className={styles.arrow_left} onClick={handleNextLeft}>
        {" "}←{" "}
      </div>

      <button className={styles.button_card} onClick={handleProgramSelect}>
        <TimeCard 
          startWithZone={TimeList[currentIndex].startWithZone}  
          endWithZone={TimeList[currentIndex].endWithZone}
        />
      </button> 

      <div className={styles.arrow_right} onClick={handleNextRight}>
        {" "}→{" "}
      </div>
    </div>
    );
};

export default TimeButton;
