import React, { useState, useEffect, useCallback } from "react";
import styles from "./style.module.css";

const Exams = ({ params, onSelectExam  }) => {
  const [scales, setScales] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dev.hakini.net/api/scales");
        const data = await response.json();
        
        setScales(data.scales);  
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, []); 

  const handleProgramSelect = async () => {
    if (scales.length == 0) {
      console.log("no scales");
      return;
    }
    const examDetails = {
        id: scales[currentIndex].id,
        title: scales[currentIndex].title,
        description: scales[currentIndex].description,
        more_info: scales[currentIndex].more_info,
        image: scales[currentIndex].image,
        time: scales[currentIndex].time,
        question_count: scales[currentIndex].question_count
    };
    onSelectExam(examDetails);

    await params.injectMessage(`هذه المعلومات عن اختبار ${scales[currentIndex].title} `);
    await params.injectMessage(scales[currentIndex].description);
    await params.injectMessage(scales[currentIndex].more_info);
    params.goToPath("question_for_exam");
  };

  const handleNextRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % scales.length);  
  };

  const handleNextLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + scales.length) % scales.length);  
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return description;
  };

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div></div>; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.arrow_left} onClick={handleNextLeft}>
        ←
      </div>

      <div>
        <button onClick={handleProgramSelect} className={styles.card}>
            <img
            src={scales[currentIndex].image}
            alt={scales[currentIndex].title}
            className={styles.programImage}
            />
            <div className={styles.textContainer}>
            <h3>{scales[currentIndex].title}</h3>
            <p>{truncateDescription(scales[currentIndex].description, 20)}</p>
            <div className={styles.timeContainer}>

                <span>مدة الاختبار: <strong>{scales[currentIndex].time}</strong></span>
                <img
                src="https://dev.hakini.net/assets/images/Time.svg"
                alt="Duration Icon"
                className={styles.timeIcon}
                />
            </div>
            <span className={styles.start_exam}>ابدأ الاختبار</span>
            </div>
        </button>
      </div>

      <div className={styles.arrow_right} onClick={handleNextRight}>
        →
      </div>
    </div>
  );
};

export default Exams;



  // const handleProgramSelect = useCallback (async () => {
  //     if (scales.length == 0) {
  //       console.log("no scales");
  //       return;
  //     }
  //     const examDetails = {
  //         id: scales[currentIndex].id,
  //         title: scales[currentIndex].title,
  //         description: scales[currentIndex].description,
  //         more_info: scales[currentIndex].more_info,
  //         image: scales[currentIndex].image,
  //         time: scales[currentIndex].time,
  //         question_count: scales[currentIndex].question_count
  //     };
  //     onSelectExam(examDetails);
  //     console.log(examDetails);
  //     await params.injectMessage(`هذه المعلومات عن اختبار ${scales[currentIndex].title} `);
  //     await params.injectMessage(scales[currentIndex].description);
  //     await params.injectMessage(scales[currentIndex].more_info);
  //     params.goToPath("question_for_exam");
  //     }
  //   )