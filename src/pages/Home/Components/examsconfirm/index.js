import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

let counter = 0;

const ExamInformationConfirm = ({ params, selectedExamreturn }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const loginAndGetToken = async (email, password) => {
    const response = await fetch("https://dev.hakini.net/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return await response.json();
  };


  const fetchQuestions = async (token) => {
    try {
      console.log(selectedExamreturn['id']);
      const url = `https://dev.hakini.net/api/scale/${selectedExamreturn['id']}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        Host: "dev.hakini.net",
      };

      const response = await fetch(url, { method: "GET", headers: headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      console.log(responseJson);

      if (responseJson.data.length === 0) {
        console.log("hamza");
        await params.injectMessage("لا يوجد أسئلة حاليا يرجى المحاولة فيما بعد");
        await params.goToPath("second_start")
        return("second_start");
      };

      const parsedQuestions = responseJson.data.map((item) => ({
        title: item.title,
        question: item.question,
        question_id: item.answers.map((answer) => answer.question_id),
        answers: item.answers.map((answer) => answer.answer),
        answer_id: item.answers.map((answer) => answer.id),
        scale_id: item.scale_id,
        score: item.answers.map((answer) => answer.weight),
        user_score_id: responseJson.user_score_id
      }));

      console.log("parsedQuestions", parsedQuestions);
      setQuestions(parsedQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchSaveAnswerScore = async (questionId, answerId, token, scale_id, score, user_score_id) => {
    try {
      console.log(questionId);
      console.log(answerId);
      console.log(score);
      console.log(scale_id);
      console.log(user_score_id);
      const response = await fetch("https://dev.hakini.net/api/save-answer-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          "answer_id": answerId,
          "question_id": questionId,
          "scale_id": scale_id,
          "score": score,
          "user_score_id": user_score_id
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save answer: ${response.statusText}`);
      }
      
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson;
    } catch (error) {
      console.error("Error saving answer:", error);
      throw error;
    }
  };


  const fetchSaveScaleScore = async (token, scale_id, user_score_id) => {
    try {
      console.log(scale_id);
      console.log(user_score_id);
      const response = await fetch("https://dev.hakini.net/api/save-scale-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          "scale_id": scale_id,
          "user_score_id": user_score_id
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save answer: ${response.statusText}`);
      }
      
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson;
    } catch (error) {
      console.error("Error saving answer:", error);
      throw error;
    }
  };



  useEffect(() => {
    loginAndGetToken("hamzahhhh754@gmail.com", "1234512345Hamza")
      .then((data) => {
        fetchQuestions(data.data.api_token).then((data) => {
          {
            console.log(data);

          }})
        .catch(data => {console.log(data)})
      })
      .catch((data) => {
        console.log(data);
      });
  }, []);


  const handleAnswerSelection = (questionId, answerId, score, scale_id, user_score_id, selectedAnswer) => {
    setAnswers(selectedAnswer);
    console.log(selectedAnswer);
    console.log(questionId);
    console.log(answerId);
    console.log(score);
    console.log(scale_id);
    console.log(user_score_id);
  
    loginAndGetToken("hamzahhhh754@gmail.com", "1234512345Hamza")
      .then((token) => {
        console.log(token.data.api_token);
  
        fetchSaveAnswerScore(questionId, answerId, token.data.api_token, scale_id, score, user_score_id)
          .then((response) => {
            console.log("Save Answer Response:", response);

            console.log("counter", counter);
            console.log(questions.length);
            counter = counter + 1
            if (counter >= (questions.length)) {
              console.log("Last Question");
              fetchSaveScaleScore(token.data.api_token, scale_id, user_score_id)
                .then((scaleScoreResponse) => {
                  console.log("Scale Score Saved:", scaleScoreResponse);
                  params.injectMessage(`نتيجة الاختبار الخاص بك هي ${scaleScoreResponse.result.user_total} من ${scaleScoreResponse.result.scale_total}`);
                  params.injectMessage(`النصيحة هي ${scaleScoreResponse.result.advice}`);
                  params.injectMessage(`الوصف هو ${scaleScoreResponse.result.description}`);
                  params.injectMessage(` معلومات إضافية:  ${scaleScoreResponse.result.read_more}`);
                  params.goToPath("second_start")
                })
                .catch((scaleScoreError) => {
                  console.error("Error saving scale score:", scaleScoreError);
                });
            }
          })
          .catch((error) => {
            console.error("Error saving answer:", error);
          });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });

  

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div></div>;
  }

  const currentQuestion = questions[currentIndex];
  console.log("currentQuestion");
  console.log(currentQuestion);

  return (
    <div className={styles.container}>
      {currentQuestion.title ? (
        <div className={styles.questionContainer}>
          <h1 className={styles.question}>{currentQuestion.title}</h1>
          <ul className={styles.optionsList}>
            {currentQuestion.answers &&
              currentQuestion.answers.map((answer, index) => (
                <button
                  className={styles.button_option}
                  onClick={() => handleAnswerSelection(currentQuestion.question_id[index], currentQuestion.answer_id[index], currentQuestion.score[index], currentQuestion.scale_id,  currentQuestion.user_score_id, currentQuestion.answers[index])}
                  key={index}
                >
                  <li className={styles.option}>{answer}</li>
                </button>
              ))}
          </ul>
        </div>
      ) : (
        <div>لا يوجد أسئلة متاحة حالياً</div>
      )}
    </div>
  );
};

export default ExamInformationConfirm;
