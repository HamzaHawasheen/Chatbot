import React, { useState } from "react";
import styles from "./style.module.css";

const Card = ({ title }) => (
  <div id="card">
    <h3>{title}</h3>
  </div>
);

const ChooseProgram = ({ SelfHelpProgramList, params, onProgramSelect, sendQueryToAPI }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SelfHelpProgramList.length);
  };

  const handleNextLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + SelfHelpProgramList.length) % SelfHelpProgramList.length);
  };

  const handleProgramSelect = async () => {
    const selectedProgram = SelfHelpProgramList[currentIndex];
    onProgramSelect(selectedProgram); 
    params.injectMessage("من فضلك انتظر قليلا للرد");
    const response = await sendQueryToAPI(`أذكر جميع التفاصيل المتعلقة في هذا البرنامج ${selectedProgram} من مميزات البرنامج والى من موجه وماذا سنتعلم وماذا يتضمن وعدد الحلقات والتمارين والقصص وكل شيء بشكل واضح ومرتب`);
    params.injectMessage(response);
    params.goToPath("response_for_programs"); 
  };

  return (
    <div className={styles.continear}>
      <div className={styles.arrow_left} onClick={handleNextLeft}>
        {" "}
        ←{" "}
      </div>

      <button className={styles.button_card} onClick={handleProgramSelect}>
        <Card 
          title={SelfHelpProgramList[currentIndex]} 
        />
      </button> 

      <div className={styles.arrow_right} onClick={handleNextRight}>
        {" "}
        →{" "}
      </div>
    </div>
  );
};

export default ChooseProgram;
