// import React, { useState } from "react";
// import { useRequest } from "./context";
// import useHandleProgramSelect from "./"

// // const sendQueryToAPI = async (userMessage) => {
// //   try {
// //     const response = await axios.post("http://localhost:8000/predict/", {
// //       prompt: userMessage,
// //       session_id: sessionId,
// //     });

// //     if (
// //       (response.data &&
// //         response.data.response &&
// //         response.data.response.answer) ||
// //       response.data
// //     ) {
// //       return (
// //         response.data.response.answer ||
// //         response.data.response ||
// //         response.data
// //       );
// //     } else {
// //       throw new Error("Invalid response structure from API.");
// //     }
// //   } catch (error) {
// //     console.error(
// //       "Error fetching response from API:",
// //       error.message || error
// //     );
// //     setErrorMessage("Error occurred while fetching data");
// //     return "Error occurred";
// //   }
// // };


// const loginAndGetToken = async (params) => {
//     try {
//       const response = await fetch("https://dev.hakini.net/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: "kmail.solaf@gmail.com",
//           password: "12345678",
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Success Token", data.data.api_token);
//         return data.data.api_token;
//       } else {
//         console.error("Fail Token", response.statusText);
//         return null;
//       }
//     } catch (error) {
//       console.error("Fail Register", error);
//       return null;
//     }
//   };

  
//   const handleProgramSelectloginAndGetToken = async (params) => {
//       const [token, setToken] = useState(null);
//       const [clientSecret, setClientSecret] = useState(null); 
//       const { requestData } = useRequest();
//       const { price, sessions, DoctorName, selectedDate, selectedTime, sendQueryToAPI } = requestData;
  
//       if (!token) {
//           token = await loginAndGetToken();
//       }
  
//       if (token) {
//           const formData = new FormData();
//           formData.append("time", selectedTime);
//           formData.append("date", selectedDate);
//           formData.append("doctor", DoctorName);
//           formData.append("cost", price);
//           formData.append("providerID", 6);
//           formData.append("plan_id", sessions);
  
//           try {
//               const response = await fetch("https://dev.hakini.net/api/appointment", {
//                   method: "POST",
//                   headers: {
//                       "Authorization": `Bearer ${token}`,
//                   },
//                   body: formData,
//               });
  
//               if (response.ok) {
//                   const PaymentPage = await sendQueryToAPI(`أريد المفتاح ${price}`);
//                   const clientSecret = String(PaymentPage);
//                   await params.injectMessage(clientSecret);
//               }
//           } catch (error) {
//             await params.injectMessage("لم يتم حفظ البيانات");
//             await params.injectMessage("من فضلك أعد المحاولة");
//             params.goToPath("ask_doctor");
//           }
//       }
//   };
  
//   export default handleProgramSelectloginAndGetToken;
  