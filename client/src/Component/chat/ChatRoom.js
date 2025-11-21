import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import jaxios from "../../util/jwtutil";
import { useNavigate } from "react-router-dom";

function ChatRoom({roomId, loginUser, token}) {
  const [stompClient, setStompClient] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessageArr, setChatMessageArr] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) return;
    if (!loginUser.userid) {
        alert("로그인이 필요한 서비스입니다."); 
        return navigate("/login");
    }

    const socket = new SockJS("http://192.168.0.223:8070/ws");

    const client = new Client({
        webSocketFactory: () => socket, // SockJS 연결
        reconnectDelay: 5000,           // 재연결 딜레이
    });

    client.onConnect = () => {
        console.log("웹소켓 연결 성공");
        setStompClient(client);
        client.subscribe(`/sub/messages/${roomId}`, (message) => {
            console.log(message.body);
            const msgObj = JSON.parse(message.body); // JSON 문자열 → 객체
            setReceivedMessages((prev) => [...prev, msgObj]);
        });
    };
    

    client.onStompError = (err) => {
        console.error("STOMP 오류:", err);
    };

    client.activate(); // 반드시 호출해야 연결 시작

    return () => {
      client.deactivate();
      console.log("종료됨");
    };
  }, [roomId]);



const forbiddenWords = ["씨발", "병신", "븅신", "붕신"]; // 금지 단어 배열

const sendMessage = (roomId) => {
    const trimmedMessage = inputMessage.trim();

    if (stompClient && trimmedMessage) {
        // 금지 단어 체크
        const containsForbidden = forbiddenWords.some(word => trimmedMessage.includes(word));

        if (containsForbidden) {
            alert("금지된 단어가 포함되어 있습니다.");
            return; // 전송 중단
        }

        stompClient.publish({
            destination: `/pub/send/${roomId}`,
            body: JSON.stringify({ content: trimmedMessage, senderId: loginUser.member_id }),
        });

        setInputMessage("");
    }
};

  const endConnection = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      console.log("웹소켓 연결 종료");
    }
  };

  useEffect(()=> {
    jaxios.get("/api/chat/chatMessage", {params:{roomId, loginId:loginUser.member_id}})
      .then((result)=> {
        console.log(result.data);
        setChatMessageArr(result.data.resDto);
      }).catch(err=>console.error(err));
  }, []);

  function formatDateTime(indate) {
      const date = new Date(indate);
      const now = new Date();

      // 시간 제외하고 날짜만 비교하기 위해 00:00 기준으로 변환
      const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / 1000 / 60);
      const diffHours = Math.floor(diffMinutes / 60);

      const diffDays = Math.floor((startOfNow - startOfDate) / (1000 * 60 * 60 * 24));

      // 오늘일 경우
      if (diffDays === 0) {
          if (diffHours > 0) return `${diffHours}시간 전`;
          if (diffMinutes > 0) return `${diffMinutes}분 전`;
          return `방금 전`;
      }

      // 1달(30일) 미만
      if (diffDays < 30) {
          return `${diffDays}일 전`;
      }

      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) {
          return `${diffMonths}달 전`;
      }

      // 1년 이상은 날짜 출력
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  useEffect(() => {
    scrollToBottom();
  }, [receivedMessages, chatMessageArr]);

  return (
    <div className="privateChatRoom">

        <ul className="oneToOneArea">
            <li className="hello">
              ({roomId}) 짐빔 채팅방에 오신걸 환영합니다.
              <br />
              욕설, 비방, 광고, 스팸 등 다른 이용자에게 피해를 주는 행위는 금지됩니다.
              <br />
              개인정보 요구·공유 및 불건전한 내용 전송은 허용되지 않습니다.
            </li>
            {
              chatMessageArr && chatMessageArr.map((msg, i)=> {
                return(
                  <li key={i} className={
                    (msg.senderId == loginUser.member_id) ? 
                    "right" + " chat" :
                    "left" + " chat"
                  }>
                      <span className="name">{
                        (msg.senderId == msg.sellerId) ? msg.sellerName : (msg.senderId == msg.buyerId) ? msg.buyerName : "잘못된유저"
                      }</span>
                      <div className="msgWrap">
                        <div className="msg">{msg.content}</div>
                        <span className="indate">{formatDateTime(msg.indate)}</span>
                      </div>
                  </li>
                )
              })
            }
            {receivedMessages.map((msg, i) => {
                return(
                  <li key={i} className={
                    (msg.senderId == loginUser.member_id) ? 
                    "right" + " chat" :
                    "left" + " chat"
                  }>
                      <span className="name">{
                        (msg.senderId == msg.sellerId) ? msg.sellerName : (msg.senderId == msg.buyerId) ? msg.buyerName : "잘못된유저"
                      }</span>
                      <div className="msgWrap">
                        <div className="msg">{msg.content}</div>
                        <span className="indate">{formatDateTime(msg.indate)}</span>
                      </div>
                  </li>
                )
              })
            }
            <div ref={messagesEndRef}></div>
        </ul>

        <div className="eventArea">
            <textarea
            className="chatInpTxt"
            type="text"
            placeholder="메시지"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();         // 줄바꿈 방지
                sendMessage(roomId);        // 엔터로 전송
              }
            }}
            ></textarea>
            <button className="sendMsg" onClick={()=> {sendMessage(roomId)}}>전송</button>
        </div>
        
    </div>
  );
}

export default ChatRoom;
