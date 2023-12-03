import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button({ text, icon=null, onClick, className }) {
  className = className + " custom-btn";
  return (
    <div className={className} role="button" value={text} onClick={onClick}>
      {icon?<FontAwesomeIcon icon={icon} />:<></>}
      &nbsp;<span>{text}</span>
    </div>
  );
}
