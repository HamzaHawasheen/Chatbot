import React, { useState } from "react";
import styles from "./style.module.css";
import EnterPhoneNumber from "../mobilenumber";

const EnterPassword = ({ params, sessionDetails, email }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signinandverify = async (email, password) => {
    try {
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

  const handleSignin = async () => {
    const signinConfirm = await signinandverify(email, password);
    console.log(signinConfirm);

    if (!signinConfirm) {
      setError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقًا.");
      return;
    }

    if (signinConfirm.msg === "بيانات الاعتماد غير صالحة" || signinConfirm.msg?.password?.[0] == ["الرجاء ادخال كلمة المرور"]) {
        setError("كلمة المرور خاطئة. يرجى المحاولة مرة أخرى.");
      return;
    } else {
      setError(""); 
    }

    let token = signinConfirm.data['api_token']

    if (signinConfirm.msg === "تم التسجيل بنجاح" && signinConfirm.data.mobile) {
      await params.injectMessage("تم تسجيل الدخول بنجاح");
      await params.injectMessage("سيتم تحويلك الان الى الصفحة الخاصة بالدفع");
    } else if (signinConfirm.msg === "تم التسجيل بنجاح" &&  (!signinConfirm.data.mobile || signinConfirm.data.mobile === "")) {
      await params.injectMessage("من فضلك أدخل رقم الهاتف الخاص بك");
      const phonenumber = (
        <EnterPhoneNumber
          params={params}
          sessionDetails={sessionDetails}
          email={email}
          token={token}
        />
      );
      await params.injectMessage(phonenumber);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signup_box}>
        <label className={styles.label} htmlFor="password">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          placeholder="أدخل كلمة المرور الخاصة بك"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={styles.error_message}>{error}</p>}
        <button className={styles.signin_button} onClick={handleSignin}>
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default EnterPassword;
