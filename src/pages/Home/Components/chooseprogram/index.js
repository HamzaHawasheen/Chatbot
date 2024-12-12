import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import { fetchProgramList } from '../flowcontrol';

let SelfHelpProgramList = [];
const getSelfHelpProgram = async () => {
  const SelfHelpProgram = await fetchProgramList(); 
  SelfHelpProgramList = SelfHelpProgram;
};

const ChooseProgram = ({ params, onProgramSelect }) => {
  getSelfHelpProgram();
  const oddIndexImages = SelfHelpProgramList.filter((_, index) => index % 2 === 1);
  const evenIndexPrograms = SelfHelpProgramList.filter((_, index) => index % 2 === 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [programDetails, setProgramDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllProgramDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dev.hakini.net/api/get-categories-optimized");
      const data = await response.json();

      const mainCategories = data.main_categories;
      const mainCategoryPrograms = mainCategories[0]?.programs || [];
  
      const details = mainCategoryPrograms.reduce((acc, program) => {
  
        const exerciseCount = program.counters.find(item => item.label === 'تمارين')?.تمارين || 0;
        const storiesCount = program.counters.find(item => item.label === 'قصص')?.قصص || 0;
        const episodeCount = program.counters.find(item => item.label === 'حلقات')?.حلقات || 0;
  
        acc[program.title] = {
          exercise: exerciseCount,
          stories: storiesCount,
          episode: episodeCount,
        };
  
        return acc;
      }, {});
  
      setProgramDetails(details);
    } catch (error) {
      console.error("Error fetching program details:", error);
      setError("Error fetching program details");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAllProgramDetails();
  }, []);

  const handleNextRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % evenIndexPrograms.length);
  };

  const handleNextLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + evenIndexPrograms.length) % evenIndexPrograms.length);
  };

  const handleProgramSelect = async () => {
    const selectedProgram = evenIndexPrograms[currentIndex];
    onProgramSelect(selectedProgram);
    params.injectMessage("من فضلك انتظر قليلا للرد");

    const programDetail = programDetails[selectedProgram];
    if (!programDetail) {
      await params.injectMessage("لا يوجد تفاصيل عن البرنامج حاليا يرجى المحاولة فيما بعد");
      params.goToPath("second_start");
    } else {
      await params.injectMessage(`تم تحميل البرنامج: ${selectedProgram}`);
      params.goToPath("confirm_response_for_programs");
    }
  };

  const selectedProgram = evenIndexPrograms[currentIndex];
  const overlayData = programDetails[selectedProgram] || { exercise: 0, stories: 0, episode: 0 };

  return (
    <div className={styles.continear}>
      <div className={styles.arrow_left} onClick={handleNextLeft}>
        {" "} ←{" "}
      </div>

      <button className={styles.button_card} onClick={handleProgramSelect}>
        <img 
          src={oddIndexImages[currentIndex]} 
          alt="Self Help Program" 
          className={styles.programImage}
        />
        <div className={styles.overlay}>
          {loading ? (
            <span>تحميل...</span>
          ) : (
            <span>{overlayData.episode} حلقة • {overlayData.exercise} تمارين • {overlayData.stories} قصة</span>
          )}
        </div>
      </button>

      <div className={styles.arrow_right} onClick={handleNextRight}>
        {" "} →{" "}
      </div>
    </div>
  );
};

export default ChooseProgram;
