import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import jaxios from "../../util/jwtutil"; // JWT 인증 Axios
import NotificationItem from "./NotificationItem";

const baseURL = process.env.REACT_APP_BASE_URL;

function AlramReply() {
  const [list, setList] = useState([]);
  const cookies = new Cookies();
  const currentUser = cookies.get("user");
  const myMemberId = cookies.get("user")?.member_id || sessionStorage.getItem("member_id");


  useEffect(() => {

    if (!myMemberId) {
      console.warn("로그인 정보 없음. 알림을 불러올 수 없습니다.");
      setList([]); // 안전하게 빈 배열 처리
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await jaxios.get(`${baseURL}/api/notification/${myMemberId}`);
        // STYLE_FOLLOW 타입만 필터링
        const replyNotifications = res.data.filter(n => n.type === "REPLY");
        setList(replyNotifications);
      } catch (err) {
        console.error("댓글 알림 불러오기 실패", err);
      }
    };

    fetchNotifications();
  }, [myMemberId]);

  return (
    <>
      {list.length === 0 && <div>댓글 알림이 없습니다.</div>}
      {list.map(item => <NotificationItem key={item.id} item={item} />)}
    </>
  );
}

export default AlramReply;
