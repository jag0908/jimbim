import React from "react";
import { useNavigate } from "react-router-dom";
import jaxios from "../../util/jwtutil";

function NotificationItem({ item, onConfirm }) {
  const navigate = useNavigate();

  // 알림 전체 영역 클릭 시 이동 (확인 버튼 제외)
  const handleItemClick = (e) => {
    // 버튼인지 확실히 체크
    if (e.target.classList.contains("btn-alram-action") || e.target.closest(".btn-alram-action")) {
      return;
    }
    if (item.linkUrl) navigate(item.linkUrl);
  };

  // 확인 버튼 클릭 시 읽음 처리 후 부모에게 알려서 리스트 갱신 등 처리
  const handleConfirmClick = async () => {
    try {
      await jaxios.post(`/api/notification/markRead/${item.id}`); // 읽음 처리 API 호출
      if (onConfirm) onConfirm(item.id);
    } catch (error) {
      console.error("알림 확인 처리 실패", error);
    }
  };

  // 프로필 이미지, 기본 이미지 경로 예시
  const profileImage = item.senderProfileImageUrl || "/images/default-profile.png";

  return (
    <div className={`alram-item ${item.read ? "" : "unread"}`} onClick={handleItemClick}>
      <div className="alram-badge"></div>

      <div className="alram-thumbnail">
        <img
          src={profileImage}
          alt="프로필"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
          onError={(e) => (e.target.src = "/images/default-profile.png")}
        />
      </div>

      <div className="alram-content">
        <div className="alram-text">
          <p className="alram-message">{item.message}</p>
          <span className="alram-time">{item.time}</span>
        </div>
      </div>

      <button
        className="btn-alram-action"
        onClick={(e) => {
          e.stopPropagation();
          handleConfirmClick();
        }}
      >
        확인
      </button>
    </div>
  );
}

export default NotificationItem;
