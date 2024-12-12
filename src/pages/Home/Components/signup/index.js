import React, { useState } from "react";
import styles from "./style.module.css";
import EnterPassword from "../password";
import EnterPhoneNumber from "../mobilenumber";

const Signup = ({ params, sessionDetails }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const signupandverify = async (email) => {
    try {
      const response = await fetch("https://dev.hakini.net/api/login-guest-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          device_type: "chatbot"
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Fail Token", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Fail Register", error);
      return null;
    }
  };

  const handleSignup = async () => {
    let signupConfirm = await signupandverify(email);
    console.log(signupConfirm);
    if (signupConfirm.msg == "البريد الالكتروني مسجل لدينا، الرجاء اختيار بريد اخر") {
      await params.injectMessage("هذا البريد الالكتروني موجود مسبقا");
      await params.injectMessage("يرجى إدخال كلمة المرور");
      const enterpassword = <EnterPassword params={params} sessionDetails={sessionDetails} email={email} />
      await params.injectMessage(enterpassword);
    };

    if (signupConfirm.msg == "تم التسجيل بنجاح") {
      await params.injectMessage("تم إنشاء الحساب بنجاح");
      await params.injectMessage("تم إرسال اسم المستخدم و كلمة المرور على الايميل الخاص بك");
      await params.injectMessage("من فضلك أدخل رقم الهاتف الخاص بك");
      const phonenumber = (
        <EnterPhoneNumber
          params={params}
          sessionDetails={sessionDetails}
          email={email}
        />
      );
      await params.injectMessage(phonenumber);
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.signup_box}>
        <label className={styles.label} htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="text"
          placeholder="أدخل بريدك الإلكتروني/اسم المستخدم"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={styles.signup_button} onClick={handleSignup}>
          إنشاء حساب
        </button>
      </div>
    </div>
  );
};

export default Signup;
