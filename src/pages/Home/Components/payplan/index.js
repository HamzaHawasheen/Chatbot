//     const handleProgramSelect = async () => {
//         const { price, sessions } = getPayPlan(currentIndex);
//         await params.injectMessage("هذه هي البيانات التي اخترتها");
//         await params.injectMessage(`الدكتور المختار هو ${DoctorName}`);
//         await params.injectMessage(`التاريخ المختار هو ${selectedDate}`);
//         await params.injectMessage(`الوقت المختار هو ${selectedTime}`);
//         await params.injectMessage(`عدد الجلسات هو ${sessions}`);
//         await params.injectMessage(`السعر الإجمالي هو ${price} دولار`);
//     };

//     return (
//         <div className={styles.continear}>
//             <div className={styles.arrow_left} onClick={handleNextLeft}>
//                 ←
//             </div>

//             <button className={styles.button_card} onClick={handleProgramSelect}>
//                 <PayPlanCard 
//                     payplan={`السعر الإجمالي: ${getPayPlan(currentIndex).price}$`} 
//                     payplansessions={`عدد الجلسات: ${getPayPlan(currentIndex).sessions}`} 
//                 />
//             </button> 

//             <div className={styles.arrow_right} onClick={handleNextRight}>
//                 →
//             </div>
//         </div>
//     );
// };

// export default PayPlanButton;


import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

const PayPlanCard = ({ payplan, payplansessions }) => (
    <div id="payplancard">
        <h3>{payplan}</h3>
        <h3>{payplansessions}</h3>
    </div>
);

const PayPlanButton = ({ PayPlanList, params, DoctorName, selectedDate, selectedTime }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const PayPlanListconvert = PayPlanList.split(",").map(Number);
    const [token, setToken] = useState("");

    const getPayPlan = (index) => {
        const sessions = PayPlanListconvert[index * 2 + 1];
        const price = PayPlanListconvert[index * 2];
        return { price, sessions };
    };

    const handleNextRight = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (PayPlanListconvert.length / 2));
    };

    const handleNextLeft = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + (PayPlanListconvert.length / 2)) % (PayPlanListconvert.length / 2)
        );
    };

    const loginAndGetToken = async () => {
        try {
            console.log("1");
            const response = await fetch("https://dev.hakini.net/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: "kmail.solaf@gmail.com",
                    password: "12345678"
                })
            });
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                console.log(data.data.api_token);
                setToken(data.data.api_token);
                console.log("Success Token", data.data.api_token);
            } else {
                console.error("Fail Token", response.statusText);
            }
        } catch (error) {
            console.error("Fail Register", error);
        }
    };

    const handleProgramSelect = async () => {
        const { price, sessions } = getPayPlan(currentIndex);

        await params.injectMessage("هذه هي البيانات التي اخترتها");
        await params.injectMessage(`الدكتور المختار هو ${DoctorName}`);
        await params.injectMessage(`التاريخ المختار هو ${selectedDate}`);
        await params.injectMessage(`الوقت المختار هو ${selectedTime}`);
        await params.injectMessage(`عدد الجلسات هو ${sessions}`);
        await params.injectMessage(`السعر الإجمالي هو ${price} دولار`);

        const requestData = {
            time: selectedTime,
            date: selectedDate,
            doctor: DoctorName,
            cost: price,
            providerID: 6,
            plan_id: sessions
        };

        if (!token) {
            await loginAndGetToken();
        }

        console.log(token);

        if (token) {
            try {
                const response = await fetch("https://dev.hakini.net/api/appointment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(requestData)
                });

                if (response.ok) {
                    const result = await response.json();
                    await params.injectMessage("Success Send Data");
                } else {
                    console.error("Fail Send Data", response.statusText);
                    await params.injectMessage("Fail Send Data");
                }
            } catch (error) {
                console.error("Fail Connections", error);
                await params.injectMessage("Fail Success");
            }
        }
    };

    useEffect(() => {
        if (token) {
            handleProgramSelect();
        }
    }, [token]); 

    return (
        <div className={styles.continear}>
            <div className={styles.arrow_left} onClick={handleNextLeft}>
                ←
            </div>

            <button className={styles.button_card} onClick={handleProgramSelect}>
                <PayPlanCard 
                    payplan={`السعر الإجمالي: ${getPayPlan(currentIndex).price}$`} 
                    payplansessions={`عدد الجلسات: ${getPayPlan(currentIndex).sessions}`} 
                />
            </button> 

            <div className={styles.arrow_right} onClick={handleNextRight}>
                →
            </div>
        </div>
    );
};

export default PayPlanButton;

