import React, { useState } from "react";
import ChatBot from "react-chatbotify";
import Settings from "./settings";
import axios from "axios";
import ChatbotComponent from "./pages/Home/Components/chatbot";
import ChooseProgram from "./pages/Home/Components/chooseprogram/index";
import DoctorsNamesListCards from "./pages/Home/Components/doctornames";
import DateButton from "./pages/Home/Components/date";
import ChooseTypeOfPay from "./pages/Home/Components/choosetypeofpay";
import Exams from "./pages/Home/Components/exams";
import ExamInformationConfirm from "./pages/Home/Components/examsconfirm";
import Signup from "./pages/Home/Components/signup";
import { fetchTherapistNames, searchTherapist, getTherapistDates } from "./pages/Home/Components/flowcontrol";


const App = () => {
  const [chatBotConfig, setChatBotConfig] = useState(null);
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionId = "12345678123412341234123456789abcf";
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showExamInfo, setShowExamInfo] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  let NotExpectedDoctor = 0;
  let doctor_name = "";
  let doctor_id = "";
  let selectedProgram2 = "";
  let selectedExamreturn = "";
  let sessionDetails = "";



  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleSelectExam = (examDetails) => {
    setSelectedExam(examDetails);
    selectedExamreturn = examDetails;
  };


  const onSessionDetailes = (sessionDet) => {
    setSelectedSession(sessionDet);
    sessionDetails = sessionDet;
  };


  const sendQueryToAPI = async (userMessage) => {
    try {
      const response = await axios.post("http://localhost:8000/predict/", {
        prompt: userMessage,
        session_id: sessionId,
      });

      if (
        (response.data &&
          response.data.response &&
          response.data.response.answer) ||
        response.data
      ) {
        return (
          response.data.response.answer ||
          response.data.response ||
          response.data
        );
      } else {
        throw new Error("Invalid response structure from API.");
      }
    } catch (error) {
      console.error(
        "Error fetching response from API:",
        error.message || error
      );
      setErrorMessage("Error occurred while fetching data");
      return "Error occurred";
    }
  };


  const handleStart = async (config) => {
    setChatBotConfig(config);
    try {
      const helpOptions = [
        "جلسات نفسية عن بعد",
        "برامج المساعدة الذاتية والتمارين",
        "المقاييس والاختبارات النفسية",
        "ورش العمل وندوات الصحة النفسية اونلاين",
        "تواصل معنا من خلال الواتس اب",
        "استفسارات عامة",
      ];

      const newFlow = {
        start: {
          message: "أهلا وسهلا بك في الدليل الشامل لمنصة حاكيني",
          component: (params) => (
            <ChatbotComponent helpOptions={helpOptions} params={params} />
          ),
        },


        second_start: {
          transition: { duration: 0 },
          message: "تفضل هل لديك اي استفسار؟",
          component: (params) => (
            <ChatbotComponent helpOptions={helpOptions} params={params} />
          ),
        },


        defult_case: {
          transition: { duration: 0 },
          path: async (params) => {
            const UserQuestion = await params.userInput;
            const UserQuestionResponse = await sendQueryToAPI(UserQuestion);
            await params.injectMessage(UserQuestionResponse);
            return "start_to_end";
          },
        },


        remote_psychological_sessions: {
          transition: { duration: 0 },
          path: "ask_doctor",
        },


        self_help_and_exercise_programs: {
          message: "يرجى اختيار البرنامج المراد معرفة تفاصيل أكثر عنه",
          transition: { duration: 0 },
          chatDisabled: false,
          path: async (params) => {
            return "choose_the_program";
          },
        },


        exams: {
          message: "يرجى اختيار الاختبار المراد معرفة تفاصيل أكثر عنه",
          transition: { duration: 0 },
          chatDisabled: false,
          path: async (params) => {
            const Exams_Display = <Exams
            params={params}
            onSelectExam={handleSelectExam}
          />;
            await params.injectMessage(Exams_Display);
          },
        },


        question_for_exam: {
          transition: { duration: 0 },
          message: "هل ترغب في إجراء الاختبار؟",
          options: ["نعم", "لا"],
          path: async (params) => {
            switch(params.userInput) {
              case "نعم":
                const ExamInformation = <ExamInformationConfirm params={params} selectedExamreturn={selectedExamreturn} />
                await params.injectMessage(ExamInformation);
              break;
    
              case "لا":
              return("second_start");
            }
          }
        }, 


        online_mental_health_workshops_and_seminars: 
        {
          transition: { duration: 0 },
          path: async (params) => {
            const link =
              "https://api.whatsapp.com/send/?phone=18459257682&text&type=phone_number&app_absent=0";
            window.open(link, "_blank", "noopener,noreferrer");
            return "repeat";
          },
        },


        contact_us_through_whatsapp: 
        {
          transition: { duration: 0 },
          path: async (params) => {
            const link =
              "https://api.whatsapp.com/send/?phone=18459257682&text&type=phone_number&app_absent=0";
            window.open(link, "_blank", "noopener,noreferrer");
            return "repeat";
          },
        },


        general_inquiries: {
          transition: { duration: 0 },
          path: "prompt_again_from_general_questions",
        },


        repeat: {
          transition: { duration: 1500 },
          path: "start_to_end",
        },


        exit: {
          message: "Good Bye",
        },


        complete: {
          message: "تفضل ولا تخجل مه هو استفسارك؟",
          options: helpOptions,
          path: "process_options",
        },


        prompt_again_from_general_questions: {
          message: "تفضل ولا تخجل ما هو استفسارك؟",
          path: async (params) => {
            const GeneralQuestion = await params.userInput;
            const AnswerGeneralQuestion = await sendQueryToAPI(GeneralQuestion);
            await params.injectMessage(AnswerGeneralQuestion);
            return "start_to_end";
          },
        },


        unknown_input: {
          message: async (params) => {
            const answer = await sendQueryToAPI(params.userInput);
            await params.injectMessage(answer);
          },
          options: helpOptions,
          path: "process_options",
        },


        ask_doctor: {
          message: "هل يوجد مستشار ما ترغب في الحجز عنده؟",
          options: ["نعم", "لا"],
          path: "process_option",
        },


        process_option: {
          transition: { duration: 0 },
          path: async (params) => {
            switch (params.userInput) {
              case "نعم":
                await params.injectMessage(
                  "ممتاز! من هو المستشار الذي تود حجز جلسة معه؟"
                );
                return "write_doctor_name";
              case "لا":
                await params.injectMessage(
                  "لا تقلق. اختر واحد من المستشارين هؤلاء: "
                );
                return "ask_doctor_name";
            }
          },
        },


        rewrite_doctor_name: {
          transition: { duration: 0 },
          message: "من فضلك أعد المحاولة من هو الدكتور الذي تريده؟",
          path: "write_doctor_name"
        },


        write_doctor_name: {
          path: async (params) => {
            const WriteDoctorName = await params.userInput;
            const ConfrimDoctorName = await searchTherapist(WriteDoctorName);
            if (ConfrimDoctorName['status'] == "الدكتور موجود") {
              await params.injectMessage(`المستشار ${ConfrimDoctorName['authorName']} هل هو المقصود حقا؟`);
              doctor_name = ConfrimDoctorName['authorName'];
              doctor_id = ConfrimDoctorName['user_id'];
              return "confirm_doctor_name"
            }
            else {
              NotExpectedDoctor = NotExpectedDoctor + 1;
              if (NotExpectedDoctor == 4) {
                return "ask_doctor_name"
              }
              else {
                return "rewrite_doctor_name";
              }
            }
          }
        },


        confirm_doctor_name: {
          transition: { duration: 0 },
          options: ["نعم", "لا"],
          path: async (params) => {
            switch (params.userInput) {
              case "نعم":
                await params.injectMessage("ممتاز. هيا بنا للخطوة القادمة");
                await delay(2000);
                const DateList = await getTherapistDates(doctor_id);

                if (!DateList || DateList.response === false) { 
                    await params.injectMessage("لا يوجد تواريخ حاليا للحجوزات");
                    params.goToPath("ask_doctor");
                } else { 
                    await params.injectMessage("من فضلك اختر التاريخ المناسب لك");
                    await delay(1000);
                    const dateButtonElement = (
                        <DateButton DateList={DateList} params={params} doctor_id={doctor_id} doctor_name={doctor_name} onSessionDetailes={onSessionDetailes} />
                    );
                    await params.injectMessage(dateButtonElement);
                }
                break;

              case "لا":
                NotExpectedDoctor = NotExpectedDoctor + 1;
                if (NotExpectedDoctor == 4) {
                  return "ask_doctor_name"
                }
                else {
                  return "rewrite_doctor_name";
                }
            }
          }
        } ,


        ask_doctor_name: {
          transition: { duration: 0 },
          message: "يرجى اختيار المستشار",
          path: async (params) => {
            const DoctorsAllNamesList = await fetchTherapistNames();
            const DoctorsNamesListString = JSON.stringify(DoctorsAllNamesList);
            const DoctorsNamesListString2 = DoctorsNamesListString.split("\n")
            .map((item) => item.trim())
            .filter((item) => item !== "")

            const DoctorsNamesListObjects = DoctorsNamesListString2.map(item => JSON.parse(item));
            const DoctorsNamesListDisplay = <DoctorsNamesListCards params={params} DoctorsNamesListObjects={DoctorsNamesListObjects} onSessionDetailes={onSessionDetailes} />
            await params.injectMessage(DoctorsNamesListDisplay);
          },
        },


        choose_the_program: {
          component: (params) => {
            const handleProgramSelect = (selectedProgram) => {
              selectedProgram2 = selectedProgram;
              params.userInput = selectedProgram;
              setSelectedProgram(selectedProgram);
            };

            return (
              <ChooseProgram
                params={params}
                onProgramSelect={handleProgramSelect}
              />
            );
          },
        },


        confirm_the_request: {
          message: "هل تريد تأكيد الطلب",
          options: ["نعم", "لا"],
          path: async (params) => {
            switch (params.userInput) {
              case "نعم": 
                console.log(sessionDetails);
                await params.injectMessage("من فضلك ادخل الايميل الخاص بك")
                const signupPage = <Signup params={params} sessionDetails={sessionDetails} />
                await params.injectMessage(signupPage);
                break;
              case "لا":
                await params.injectMessage("هيا بنا نقوم بإعادة حجز الجلسة")
                await params.goToPath("ask_doctor");
            }
          }
        },


        confirm_response_for_programs: {
          message: "هل ترغب في الاشتراك الذي يمنحك الوصول إلى جميع برامجنا المتاحة؟",
          options: ["نعم", "لا"],
          path: async (params) => {
            switch (params.userInput) {
              case "نعم":
                await params.injectMessage("حسنا هذا رائع");
                await params.injectMessage("من فضلك اختر الاشتراك المناسب لك");
                await params.injectMessage("لتحصل على جميع ميزات الاشتراك يرجى تحميل التطبيق على الجوال");
                const ChooseTypeOfPayDisplay = <ChooseTypeOfPay params={params} />;
                await params.injectMessage(ChooseTypeOfPayDisplay);
              break;

              case "لا":
              return "second_start";
            }
        }
      },


      gold_subscription: {
        transition: { duration: 0 },
        path: async (params) => {
          const link =
          "https://buy.stripe.com/28odUNfmZ3hrgBq8xk?client_reference_id=${user?.id}&utm_content=2&prefilled_promo_code=${m_name}";
          window.open(link, "_blank", "noopener,noreferrer");
          await params.injectMessage("نتمنى لك وقتا سعيدا");
          return "second_start";
        }
      },


      selver_subscription: {
        transition: { duration: 0 },
        path: async (params) => {
          const link =
          "https://buy.stripe.com/7sI4kd0s5bNX0CsdRG?client_reference_id=${user?.id}&utm_content=2&prefilled_promo_code=${y_name}";
          window.open(link, "_blank", "noopener,noreferrer");
          await params.injectMessage("نتمنى لك وقتا سعيدا");
          return "second_start";
        }
      },


      start_to_end: {
          transition: { duration: 3500 },
          path: "second_start",
        },
      };


      setFlow(newFlow);
    } catch (error) {
      setErrorMessage("Failed to start chat.");
    } finally {
      setLoading(false);
    }
  };

  const getChatBotSettings = () => {
    if (!chatBotConfig) return null;

    return {
      isOpen: true,
      general: {
        primaryColor: chatBotConfig.color || "#000",
        secondaryColor: chatBotConfig.color || "#000",
        fontFamily: "Arial, sans-serif",
        embedded: true,
      },
      header: {
        title: chatBotConfig.name || "ChatBot",
        avatar:
          chatBotConfig.logo ||
          "https://media.istockphoto.com/id/1492548051/vector/chatbot-logo-icon.jpg?s=612x612&w=0&k=20&c=oh9mrvB70HTRt0FkZqOu9uIiiJFH9FaQWW3p4M6iNno=",
        showAvatar: true,
      },
      chatHistory: {
        disabled: false,
        maxEntries: 20,
        viewChatHistoryButtonText: "Load Chat History",
        chatHistoryLineBreakText: "----- Previous Chat History -----",
        storageType: "LOCAL_STORAGE",
        autoLoad: false,
      },
    };
  };

  return (
    <div>
      {chatBotConfig ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {flow ? (
            <ChatBot
              id="my-chatbot-id"
              settings={getChatBotSettings()}
              flow={flow}
            />
          ) : (
            <p>Loading chat</p>
          )}
        </div>
      ) : (
        <Settings onStart={handleStart} disabled={loading} />
      )}
    </div>
  );
};

export default App;
