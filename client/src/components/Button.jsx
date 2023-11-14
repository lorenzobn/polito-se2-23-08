import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button({ text, icon, onClick}) {
  return (
    <div className='custom-btn ' value={text} onClick={onclick}>
      <FontAwesomeIcon  icon={icon} />&nbsp;<span>{text}</span>
    </div>
  )
}
