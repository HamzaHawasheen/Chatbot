import React, { useState } from "react";
import ChatBot from "react-chatbotify";
import Settings from "./settings";
import axios from "axios";
import ChatbotComponent from "./pages/Home/Components/chatbot";
import ChooseProgram from "./pages/Home/Components/chooseprogram/index";
import DateButton from "./pages/Home/Components/date";
import DoctorsNamesListCards from "./pages/Home/Components/doctornames";

const App = () => {
  const [chatBotConfig, setChatBotConfig] = useState(null);
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionId = "12345678-1234-1234-1234-123456789abcf";
  const [selectedProgram, setSelectedProgram] = useState(null);
  let SelfHelpProgramList = [];
  let DateList = [];

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
          path: () => {
            return "defult_case";
          },
        },

        second_start: {
          message: "تفضل هل لديك اي استفسار؟",
          component: (params) => (
            <ChatbotComponent helpOptions={helpOptions} params={params} />
          ),
          path: () => {
            return "defult_case";
          },
        },

        remote_psychological_sessions: {
          transition: { duration: 0 },
          path: "ask_doctor",
        },

        self_help_and_exercise_programs: {
          message: "يرجى اختيار اسم البرنامج المراد معرفة تفاصيل أكثر عنه",
          transition: { duration: 0 },
          chatDisabled: false,
          path: async (params) => {
            const SelfHelpProgram = await sendQueryToAPI(
              "أذكر جميع -ما لا يقل عن عشرة- دورات وبرامج وتمارين مساعدة ذاتية تعزز من صحتنا النفسية في حاكيني . أذكرهن على شكل نقاط ومرتبات من اول واحد لاخر واحدة بدون ترقيم ولا تنسى أي شيء . بدون اي مقدمات فقط النقاط وبدون وضع اشارة لنقطة اجعلهن تحت بعض فقط . بدون أي خيارات ليست مرتبطة بالسؤال زي الاتصال والتواصل"
            );
            SelfHelpProgramList = SelfHelpProgram.split("\n")
              .map((item) => item.trim())
              .filter((item) => item !== "");
            return "choose_the_program";
          },
        },

        online_mental_health_workshops_and_seminars: {
          transition: { duration: 0 },
          path: async (params) => {
            const link =
              "https://api.whatsapp.com/send/?phone=18459257682&text&type=phone_number&app_absent=0";
            window.open(link, "_blank", "noopener,noreferrer");
            return "repeat";
          },
        },

        contact_us_through_whatsapp: {
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

        defult_case: {
          transition: { duration: 0 },
          path: async (params) => {
            const UserQuestion = await params.userInput;
            const UserQuestionResponse = await sendQueryToAPI(UserQuestion);
            await params.injectMessage(UserQuestionResponse);
            return "start_to_end";
          },
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
                return "ask_doctor_name";
              case "لا":
                await params.injectMessage(
                  "لا تقلق. اختر واحد من المستشارين هؤلاء: "
                );
                return "ask_doctor_name";
            }
          },
        },

        ask_doctor_name: {
          transition: { duration: 0 },
          message: "يرجى اختيار اسم المستشار",
          path: async (params) => {
            const DoctorsAllNamesList = await sendQueryToAPI(`أذكر جميع المستشارين في حاكيني؟`);
            const DoctorsNamesListString = JSON.stringify(DoctorsAllNamesList);
            const DoctorsNamesListString2 = DoctorsNamesListString.split("\n")
            .map((item) => item.trim())
            .filter((item) => item !== "");
            const DoctorsNamesListStringConvert = JSON.parse(DoctorsNamesListString2);

            // const DoctorsNamesListDisplay = <DoctorsNamesListCards params={params} DoctorsNamesListString={DoctorsNamesListString2} />
            // await params.injectMessage(DoctorsNamesListDisplay);

            const DoctorName = await params.userInput;
            const DoctorNameQuery = await sendQueryToAPI(`هل موجود الدكتور ${DoctorName}`);
            if (DoctorNameQuery === "True") { 

              const DoctorDates = await sendQueryToAPI(`ما هي التواريخ المتاحة ل ${DoctorName}`);
              DateList = DoctorDates.split("\n")
              .map((item) => item.trim())
              .filter((item) => item !== "");
  

              if (DoctorDates.response === false) { 
                await params.injectMessage("لا يوجد تواريخ حاليا للحجوزات");
                return "ask_doctor";
              }
              else { 
                await params.injectMessage("من فضلك اختر التاريخ المناسب لك");
                const dateButtonElement = <DateButton DateList={DateList} params={params} sendQueryToAPI={sendQueryToAPI} DoctorName={DoctorName} />;
                await params.injectMessage(dateButtonElement);
              }
            }
            else if (DoctorNameQuery === "False") {
              await params.injectMessage("عذرا المستشار غير موجود حاول مجددا");
              return "ask_doctor";
            }
          },
        },

        doctor_times_user_choose: {
          path: async (params) => {
            const DoctorTimesUserChoose = await params.userInput;
            await params.injectMessage(DoctorTimesUserChoose);
            const PayPlan = await sendQueryToAPI(` ما هي خطة الدفع ل دكتور ${DoctorTimesUserChoose}`);
            for(let i=0; i<PayPlan.length; i++)
            {
              await params.injectMessage(`عدد الجلسات هو ${PayPlan[i][1]} ,$ السعر الكلي هو ${PayPlan[i][0]}`);
            }
            return "doctor_payplan_user_choose";
          }
        },

        doctor_payplan_user_choose: {
          path: async (params) => {
            const DoctorPayPlanUserChoose = await params.userInput;
            await params.injectMessage(DoctorPayPlanUserChoose);
          }
        },

        choose_the_program: {
          component: (params) => {
            const handleProgramSelect = (selectedProgram) => {
              console.log("Selected Program:", selectedProgram);
              params.userInput = selectedProgram;
              setSelectedProgram(selectedProgram);
            };

            return (
              <ChooseProgram
                SelfHelpProgramList={SelfHelpProgramList}
                params={params}
                onProgramSelect={handleProgramSelect}
                sendQueryToAPI={sendQueryToAPI}
              />
            );
          },
        },

        response_for_programs: {
          transition: { duration: 0 },
          path: "start_to_end",
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
        storageKey: "chatbot_history_key",
        disabled: false,
        maxEntries: 50,
        viewChatHistoryButtonText: "Load Chat History",
        chatHistoryLineBreakText: "----- Previous Chat History -----",
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
