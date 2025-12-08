import React from "react";
import { useNavigate } from "react-router-dom";
import jaxios from "../../util/jwtutil";

const baseURL = process.env.REACT_APP_BASE_URL;

function NotificationItem({ item, onConfirm }) {
  const navigate = useNavigate();

  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    // Date 객체로 변환
    const date = new Date(timeStr);

    if (isNaN(date.getTime())) return timeStr; // 변환 실패 시 원본 문자열 반환

    // 년-월-일 시:분 형태로 포맷팅
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  // 확인 버튼 클릭 시: 알람 삭제 후 UI 제거 + 페이지 이동
  const handleConfirmClick = async () => {
    try {
      // 서버에서 알람 삭제
      await jaxios.delete(`${baseURL}/api/notification/${item.id}`);

      // UI에서 제거
      if (onConfirm) onConfirm(item.id);

      // 페이지 이동
      if (item.linkUrl) {
        navigate(item.linkUrl);
      }

    } catch (error) {
      console.error("알림 삭제 실패", error);
    }
  };

  const profileImage = item.senderProfileImg  || "/images/default-profile.png";

  return (
    <div className={`alram-item ${item.read ? "" : "unread"}`}>
      <div className="alram-badge"></div>

      <div className="alram-thumbnail">
        <img
          src={profileImage}
          alt="프로필"
          style={{ width: 56, height: 56, borderRadius: 12 }}
          onError={(e) => (e.target.src = "/images/default-profile.png")}
        />
      </div>

      <div className="alram-content">
        <div className="alram-text">
          <p className="alram-message">{item.message}</p>
          <span className="alram-time">{formatTime(item.time)}</span>
        </div>
      </div>

      <button
        className="btn-alram-action"
        onClick={handleConfirmClick}
      >
        확인
      </button>
    </div>
  );
}

export default NotificationItem;
