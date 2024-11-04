import React, { useState } from "react";
import styles from "./style.module.css";
import TimeButton from "../time/index";

const DateCard = ({ date }) => (
    <div id="datecard">
        <h3>{date}</h3>
    </div>
);

const DateButton = ({ DateList, params, sendQueryToAPI, DoctorName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextRight = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % DateList.length);
    };
  
    const handleNextLeft = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + DateList.length) % DateList.length);
    };

    const handleProgramSelect = async () => {
        const selectedDate = DateList[currentIndex];
        await params.injectMessage("من فضلك اختر الوقت المناسب لك");

        const DoctorDatesUserChooseQuery = await sendQueryToAPI(`ما هي الأوقات المتاحة في ${selectedDate} ؟`);
        let TimeList = String(DoctorDatesUserChooseQuery)
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");
        const timeButtonElement = <TimeButton params={params} sendQueryToAPI={sendQueryToAPI} TimeList={TimeList} DoctorName={DoctorName} selectedDate={selectedDate} />

        params.injectMessage(timeButtonElement);
        params.goToPath("doctor_times_user_choose"); 
      };

    return (
    <div className={styles.continear}>
      <div className={styles.arrow_left} onClick={handleNextLeft}>
        {" "}
        ←{" "}
      </div>

      <button className={styles.button_card} onClick={handleProgramSelect}>
        <DateCard 
          date={DateList[currentIndex]}  
        />
      </button> 

      <div className={styles.arrow_right} onClick={handleNextRight}>
        {" "}
        →{" "}
      </div>
    </div>
    );
};

export default DateButton;
