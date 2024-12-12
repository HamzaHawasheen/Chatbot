import React, { useState } from "react";
import styles from "./style.module.css";
import DateButton from "../date";
import { getTherapistDates } from "../flowcontrol"

const DoctorsNamesListCards = ({ params, DoctorsNamesListObjects, onSessionDetailes }) => {
    const [visibleCount, setVisibleCount] = useState(3); 

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 5); 
    };

    const handleProgramSelect = async (doctor_id, doctor_name) => {
        const doctorDates = await getTherapistDates(doctor_id);
        const dateList = Array.isArray(doctorDates)
        ? doctorDates
        : typeof doctorDates === "string"
        ? doctorDates.split("\n").map((item) => item.trim()).filter((item) => item !== "")
        : [];
    

        if (dateList.length === 0) { 
            await params.injectMessage("لا يوجد تواريخ حاليا للحجوزات");
            params.goToPath("ask_doctor");
        } else { 
            await params.injectMessage("من فضلك اختر التاريخ المناسب لك");
            const dateButtonElement = (
                <DateButton DateList={dateList} params={params} doctor_id={doctor_id} doctor_name={doctor_name} onSessionDetailes={onSessionDetailes} />
            );
            await params.injectMessage(dateButtonElement);
        }
    }; 

    return (
        <div className={styles.container}>
            <ul>
                {DoctorsNamesListObjects[0].slice(0, visibleCount).map((doctor, index) => (
                <li 
                    key={index} 
                    className={styles.cardButton}
                    onClick={() => handleProgramSelect(doctor['user_id'], doctor['name'])} 
                >
                    <div className={styles.cardImageWrapper}>
                    <img
                        src={doctor['img']} 
                        alt={doctor['name']} 
                        className={styles.cardImage}
                    />
                    <div className={styles.overlay}>
                        <h4 className={styles.therapName}>{doctor['name']}</h4> 
                        <h5 className={styles.therapist}>{doctor['title']}</h5>   
                    </div>
                    </div>
                </li>
                ))}
            </ul>
            {visibleCount < DoctorsNamesListObjects[0].length && (
                <button onClick={handleShowMore} className={styles.showMoreButton}>
                إظهار المزيد
                </button>
            )}
        </div>
    );
};

export default DoctorsNamesListCards;
