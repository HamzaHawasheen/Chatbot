import React, { useState } from "react";
import styles from "./style.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import VerifyCode from "../contactperson";

const EnterPhoneNumber = ({params, sessionDetails, email, token}) => {
  const [phone, setPhone] = useState(""); 
  const [countryCode, setCountryCode] = useState(""); 
  const [dialCode, setDialCode] = useState(""); 

  const signupMobile = async (mobile, dial_code, country_code) => {
    try {
      const response = await fetch("https://dev.hakini.net/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile: mobile,
          dial_code: dial_code,
          country_code: country_code,
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

  const handleSigninMobile = async () => {
    const extractedPhone = phone.replace(dialCode, ""); 
    console.log(extractedPhone);
    console.log(countryCode);
    console.log(dialCode);
    const signupMobileConfirm = await signupMobile(
      extractedPhone,
      dialCode,
      countryCode
    );
    console.log(signupMobileConfirm);
    const verifyCodeUser = await await contactPerson(
      extractedPhone,
      dialCode,
      countryCode,
      email,
      "email"
    );
    console.log(verifyCodeUser);

    await params.injectMessage("تم إرسال كود التحقق الى الإيميل الخاص بك يرجى إدخاله");
    const verifyContact = <VerifyCode params={params} sessionDetails={sessionDetails} email={email} token={token} extractedPhone={extractedPhone} dialCode={dialCode} countryCode={countryCode} verifyCodeUser={verifyCodeUser} />
    await params.injectMessage(verifyContact);
  };

  return (
    <div className={styles.container}>
      <div className={styles.signup_box}>
        <label className={styles.label} htmlFor="mobile">
          رقم الواتس اب
        </label>
        <PhoneInput
          country={"ps"} 
          value={phone}
          className={styles.phoneinput}
          onChange={(value, country) => {
            setPhone(value);
            setDialCode(`+${country.dialCode}`);
            setCountryCode(country.countryCode.toUpperCase());
          }}
          inputProps={{
            id: "phone",
            name: "phone",
            required: true,
          }}
        />
        <button className={styles.signin_button} onClick={handleSigninMobile}>
          تأكيد
        </button>
      </div>
    </div>
  );
};

export default EnterPhoneNumber;