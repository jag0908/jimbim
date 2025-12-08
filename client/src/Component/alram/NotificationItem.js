import React from "react";
import { useNavigate } from "react-router-dom";

function NotificationItem({ item }) {
  const navigate = useNavigate();

  return (
    <div className={`alram-item ${item.read ? "" : "unread"}`}
         onClick={() => navigate(item.linkUrl)}
    >
      <div className="alram-badge"></div>

      <div className="alram-thumbnail">
        <div className="thumbnail-placeholder"></div>
      </div>

      <div className="alram-content">
        <div className="alram-text">
          <p className="alram-message">{item.message}</p>
          <span className="alram-time">{item.time}</span>
        </div>
      </div>

      <button className="btn-alram-action">확인</button>
    </div>
  );
}

export default NotificationItem;
