import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import jaxios from "../../util/jwtutil"; // JWT 인증 Axios
import NotificationItem from "./NotificationItem";

const baseURL = process.env.REACT_APP_BASE_URL;

function AlramLike() {
  const [list, setList] = useState([]);
  const cookies = new Cookies();
  const myMemberId = cookies.get("user")?.member_id || sessionStorage.getItem("member_id");

  useEffect(() => {
    if (!myMemberId) {
      setList([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await jaxios.get(`${baseURL}/api/notification/${myMemberId}`);
        const likeNotifications = res.data.filter(n => n.type === "LIKE");
        setList(likeNotifications);
      } catch (err) {
        console.error("좋아요 알림 불러오기 실패", err);
      }
    };

    fetchNotifications();
  }, [myMemberId]);

  // 확인 처리 후 해당 알림만 읽음 처리 및 UI 갱신
  const handleConfirm = (id) => {
    setList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      {
        list.length === 0 && 
        <div className="alram-empty">
            <div className="empty-icon">🔔</div>
            <p className="empty-text">새로운 좋아요가 없습니다.</p>
            <p className="empty-subtext">새로운 좋아요가 생기면 여기에 표시됩니다</p>
          </div>
      }
      {list.map(item => (
        <NotificationItem key={item.id} item={item} onConfirm={handleConfirm} />
      ))}
    </>
  );
}


export default AlramLike;
