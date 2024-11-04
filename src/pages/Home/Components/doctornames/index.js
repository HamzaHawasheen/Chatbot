import React from "react";
import styles from "./style.module.css";

const DoctorsNamesListCards = ({ DoctorsNamesListString2 }) => {
    return (
        <div >
            <ul >
                {DoctorsNamesListString2.map((doctor, index) => (
                    <li key={index}>
                        <a>
                            <img
                                src={doctor.author_img}
                                alt={doctor.author_name}
                                style={{ backgroundColor: "#d9ebee" }}
                            />
                            <div className="shadow">
                                <h4 className="therapName">{doctor.author_name}</h4>
                                <h5 className="therapistt">{doctor.author_title}</h5>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorsNamesListCards;
