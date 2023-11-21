import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button({ text, icon, onClick, className}) {
  className = className + " custom-btn";
  return (
    <div style={{backgroundColor:'grey'}} className={className} role='button' value={text} onClick={onClick}>
      <FontAwesomeIcon  icon={icon} />&nbsp;<span>{text}</span>
    </div>
  )
}
