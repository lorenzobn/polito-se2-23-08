import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button({
  text,
  icon = null,
  onClick,
  className,
  variant,
}) {
  className = className + " custom-btn";
  let bg = "";
  switch (variant) {
    case "primary":
      bg = "#007ea8";
      break;
    case "danger":
      bg = "#fc4e54";
      break;
    case "warning":
      bg = "#fc7a08";
      break;
    case "success":
      bg = "#22ba14";
      break;
    case "grey":
      bg = "#9496a1";
      break;
    default:
      bg = "#007ea8";
      break;
  }
  return (
    <div
      className={className}
      role="button"
      value={text}
      onClick={onClick}
      style={{ backgroundColor: bg }}
    >
      {icon ? <FontAwesomeIcon icon={icon} style={{fontSize:"13px"}} /> : <></>}
      &nbsp;<span>{text}</span>
    </div>
  );
}
