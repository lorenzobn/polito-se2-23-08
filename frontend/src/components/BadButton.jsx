import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button({ text, icon, onClick}) {
  return (
    <div className='secondary-btn ' role='button' value={text} onClick={onClick}>
      <FontAwesomeIcon  icon={icon} />&nbsp;<span>{text}</span>
    </div>
  )
}
