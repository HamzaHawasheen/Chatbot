import React, { useState } from "react";
import styles from "./style.module.css";

const ChatbotComponent = ({ helpOptions, params }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % helpOptions.length);
  };

  const handleNextLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + helpOptions.length) % helpOptions.length);
  };

  const cards_content = [
    {
      title: "جلسات نفسية عن بعد",
      img: "https://www.hakini.net/assets/images/s2 (1).svg",
      description: "تواصل مع افضل الاخصائيين: دكتور نفسي او دكتورة الطب النفسي ومتخصصي الصحة النفسية الأكفاء من خلال الرسائل النصية أو الصوتية أو المرئية",
      path: "remote_psychological_sessions",
    },
    {
      title: "برامج المساعدة الذاتية والتمارين",
      img: "https://www.hakini.net/assets/images/s5 (1).svg",
      description: "الوصول إلى مقاطع الفيديو والبودكاست وتمارين التأمل، كيف نتأمل، التنفس والاسترخاء، التعامل مع الاحتراق الوظيفي وفقدان الشغف، التخلص من ادمان الاباحية، التعرف على علاج فرط النشاط وتشتت الانتباه (ADHD)، الصدمة النفسية، التربية الاسرية وغيرها من البرامج",
      path: "self_help_and_exercise_programs",
    },
    {
      title: "ورش العمل وندوات الصحة النفسية اونلاين",
      img: "https://www.hakini.net/assets/images/s1 (1).svg",
      description: "احصل على ورش عمل ودورات تدريبية نفسية مخصصة وفقًا لمتطلباتك المحددة، سواء في الاحتراق الوظيفي أو النفسي، فقدان الشغف، التعلق المرضي، الشفاء التام من نوبات الهلع وغيرها من برامج الصحة النفسية",
      path: "online_mental_health_workshops_and_seminars",

    },
    {
      title: "تواصل معنا من خلال الواتس اب",
      img: "https://www.hakini.net/assets/images/WhatsApp_icon.png",
      description: "تتيح خانة \"التواصل عبر الواتس\" للمستخدمين الاتصال الفوري بمتخصصي الصحة النفسية، مما يوفر وسيلة مريحة وسريعة للحصول على الدعم والمشورة بشأن المخاوف النفسية.",
      path: "contact_us_through_whatsapp",
    },
    {
      title: "استفسارات عامة",
      img: "https://www.hakini.net/assets/images/WhatsApp_icon.png",
      description: "خانة الاستفسارات العامة توفر للمستخدمين منصة لطرح أسئلتهم ومناقشة المواضيع المتعلقة بالصحة النفسية. يمكنهم الاستفادة من خدمات الاستشارة، والحصول على معلومات دقيقة ومفيدة، مما يسهل التواصل مع المتخصصين ويعزز الوعي بالصحة النفسية.",
      path: "general_inquiries",
    }
  ];

  return (
    <ul className={styles.mainfqa}>
      <li>
      {cards_content.map((card, index) => {
      if (currentIndex === index) {
        return (
          <div className={styles.card} key={index}>
            <img src={card.img} alt="Picture" />
            <h3 className={card.titleClass}>
              {card.title}
            </h3>
            <h4 style={{fontSize: card.description.length > 230 ? "12px" : "14px" }} className={card.detailsClass}>
              {card.description}
            </h4>
            <a
              className={styles[card.path]} 
              onClick={() => params.goToPath(card.path)}
            >
              {card.title}
            </a>
          </div>
        );
      } 
      return null; 
    })}

        <div className={styles.arrow_right} onClick={handleNextRight}>
          {" "}
          →{" "}
        </div>

        <div className={styles.arrow_left} onClick={handleNextLeft}>
          {" "}
          ←{" "}
        </div>
      </li>
    </ul>
  );
};

export default ChatbotComponent;
