import React from "react";
import "./Notification.css";

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <p>{message}</p>
      <button className="notification__close" onClick={onClose}>
        &#10006;
      </button>
    </div>
  );
};

export default Notification;
