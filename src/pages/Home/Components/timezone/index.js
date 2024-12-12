import React, { useState } from "react";
import styles from "./style.module.css";
import TimeButton from "../time/index"
import { getTherapistTimes } from "../flowcontrol";
import moment from 'moment-timezone';

const TimeZoneSelectList = ({ params, doctor_id, doctor_name, tiemezoneget, selectedDate, formattedDate, onSessionDetailes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(""); 

    const formatDateMoment = dateString => {
        if (dateString) {
          if (dateString.includes('-')) {
            return dateString;
          }
          const [day, month, year] = dateString.split('/');
          const formattedDatefinal = `${day}-${month}-${year}`;
      
          return formattedDatefinal;
        }
        return null;
      };
      

    const prepareArrayTimes = (times, date, timezone) => {
        let arr = [];

        console.log("times", times);
        console.log("date", date);
        console.log("timezone", timezone);

        if (typeof times === "string") {
          times = times
              .split("\n")        
              .map(item => item.trim()) 
              .filter(item => item !== ""); 
        }

        const originalTimezone = 'Asia/Jerusalem'; 
        let originalStartDate,
          originalEndDate,
          originalStartMoment,
          originalEndMoment,
          targetStartMoment,
          targetEndMoment = undefined;
        date = date && formatDateMoment(date);
      
        for (let i = 0; i < times?.length; i += 2) {
          if (timezone) {
            originalStartDate = date + ' ' + times[i];
            originalEndDate = date + ' ' + times[i + 1];
            console.log("org1");
            console.log(originalStartDate);
            console.log(originalEndDate);

            originalStartMoment = moment.tz(originalStartDate, originalTimezone);
            originalEndMoment = moment.tz(originalEndDate, originalTimezone);
            console.log("org2");
            console.log(originalStartMoment);
            console.log(originalEndMoment);

            targetStartMoment = originalStartMoment.tz(timezone).format('HH:mm');
            targetEndMoment = originalEndMoment.tz(timezone).format('HH:mm');
            console.log("org3");
            console.log(originalStartMoment);
            console.log(targetEndMoment);
          }
          arr.push({
            start: times[i],
            end: times[i + 1],
            startWithZone: targetStartMoment ? targetStartMoment : times[i],
            endWithZone: targetEndMoment ? targetEndMoment : times[i + 1],
          });
        }
        return arr;
    };

    const handleProgramSelect = async (newSelectedOption) => {
      console.log(selectedDate);
        
        await params.injectMessage("من فضلك اختر الوقت المناسب لك");
        const DoctorDatesUserChooseQuery = await getTherapistTimes(doctor_id, selectedDate);

        const timezone = newSelectedOption.match(/- (\S+)$/)?.[1];

        const TimeConvertTimeZone = prepareArrayTimes(DoctorDatesUserChooseQuery, selectedDate, timezone);

        const timeButtonElement = <TimeButton params={params} doctor_id={doctor_id} doctor_name={doctor_name} timezone={timezone} formattedDate={formattedDate} selectedDate={selectedDate} TimeList={TimeConvertTimeZone.map(item => ({
            start: item.start,
            end: item.end,
            startWithZone: item.startWithZone,
            endWithZone: item.endWithZone
          }))} onSessionDetailes={onSessionDetailes} />
        await params.injectMessage(timeButtonElement);
    };

    const handleSelectChange = (e) => {
        const newSelectedOption = e.target.value; 
        setSelectedOption(newSelectedOption);
        setCurrentIndex(tiemezoneget.findIndex(item => `${item.label} - ${item.value}` === selectedOption));
        handleProgramSelect(newSelectedOption);
    };

    return (
        <div className={styles.continear}>
            <select onChange={handleSelectChange} className={styles.selectlist}>
                <option value="">المنطقة الزمنية</option>
                {tiemezoneget.map((timezone, index) => (
                    <option key={index} value={`${timezone.label} - ${timezone.value}`}>
                        {timezone.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TimeZoneSelectList;
