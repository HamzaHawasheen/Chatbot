import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import TimeZoneSelectList from "../timezone";
import getTimeZonesData from "../../../../timezones";

const DateCard = ({ date }) => (
    <div id="datecard">
        <h3>{date}</h3>
    </div>
);

const DateButton = ({ DateList, params, doctor_id, doctor_name, onSessionDetailes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(DateList[currentIndex]);

    const handleNextRight = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % DateList.length);
    };
  
    const handleNextLeft = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + DateList.length) % DateList.length);

    };

    const handleProgramSelect = async () => {
      console.log(doctor_id)
        const selectedDate = DateList[currentIndex];
        console.log(selectedDate);
        const formattedDate = selectedDate.split('/').reverse().join('/');
        params.selectedDate = selectedDate;

        const tiemezoneget = getTimeZonesData();

        await params.injectMessage("من فضلك اختر المنطقة الزمنية الخاصة بك");
        const timeButtonElement = <TimeZoneSelectList params={params} doctor_id={doctor_id} doctor_name={doctor_name} tiemezoneget={tiemezoneget} selectedDate={selectedDate} formattedDate={formattedDate} onSessionDetailes={onSessionDetailes} />
        await params.injectMessage(timeButtonElement);
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
