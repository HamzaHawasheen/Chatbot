import React, { useRef, useState } from "react";
import "./style.css";

const Settings = ({ onStart }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#00bfff");
  const [logo, setLogo] = useState("");
  const colorElement = useRef(); 
  const handleStart = () => {
    onStart({ name, color, logo });
  };

  return (
    <div className="continar">
      <h1 className="header-of-setting">ChatBot Settings</h1>
      <div className="row">
        <label className="label-name"> Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-name"
          placeholder="Please enter Chatbot Name"
        />
      </div>
      <div className="row">
        <label className="label-color"> Color: </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="input-color"
          hidden
          ref={colorElement}
        />
        <button className='input-name color-selector' onClick={()=>{
          colorElement.current.click()
        }}>
          <p>Choose Color</p>
          <div style={{backgroundColor: color}}>  </div>
        </button>
      </div>
      <div className="row">
        <label className="label-logo"> Logo: </label>
        <input 
            type="file" 
            className="input-logo" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={(e) => {
              const file = e.target.files[0]; 
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setLogo(reader.result); 
                };
                reader.readAsDataURL(file); 
              }
            }
          }
          />

      </div>
      <button className="start-button" onClick={handleStart}>
        Let's Start
      </button>
    </div>
  );
};

export default Settings;
