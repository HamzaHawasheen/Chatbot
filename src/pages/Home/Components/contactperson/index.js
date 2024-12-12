import React, { useState } from "react";
import styles from "./style.module.css";
import { type } from "@testing-library/user-event/dist/type";

const VerifyCode = ({params, sessionDetails, email, token, extractedPhone, dialCode, countryCode, verifyCodeUser}) => {
  const contactPerson = async (mobile, dial_code, country_code, email, type_contact) => {
    try {
      const response = await fetch("https://dev.hakini.net/api/contact-person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile: mobile,
          dial_code: dial_code,
          country_code: country_code,
          email: email,
          type_contact: type_contact
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        console.error("Failed to update user:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error during signup:", error);
      return null;
    }
  };

  const handleVerify = async () => {

    console.log(extractedPhone);
    console.log(dialCode);
    console.log(countryCode);
    console.log(email);
    console.log("email");

    const signupMobileConfirm = await contactPerson(
      extractedPhone,
      dialCode,
      countryCode,
      email,
      "email"
    );
    console.log(signupMobileConfirm);

    
  };

  return (
    <div className={styles.container}>
      <div className={styles.verify_box}>
        <label className={styles.label} htmlFor="mobile">
          كود التحقق
        </label>

        <input
          id="verifyCode"
          type="text"
          placeholder="أدخل كود التحقق"
          maxLength={6}
          pattern="[0-9]*"
          className={styles.verify_input}
        />

        <button className={styles.verify_button} onClick={handleVerify}>
          التحقق
        </button>
      </div>
    </div>
  );
};

export default VerifyCode;