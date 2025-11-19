import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import jaxios from "../../util/jwtutil";

function ChatRoom({roomId, loginUser, token}) {
  const [stompClient, setStompClient] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessageArr, setChatMessageArr] = useState(null);

  useEffect(() => {
    if (!roomId) return;

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



  const sendMessage = (roomId) => {
    if (stompClient && inputMessage.trim()) {
        stompClient.publish({
            destination: `/pub/send/${roomId}`,
            body: JSON.stringify({content: inputMessage, senderId: loginUser.member_id}),
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
  }, [])

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
                <li key={i}>
                    <span className="name">{msg.sender}</span>
                    <span className="msg">{msg.content}</span>
                </li>
              })
            }
            {receivedMessages.map((msg, i) => (
                <li key={i}>
                    <span className="name">{msg.sender}</span>
                    <span className="msg">{msg.content}</span>
                </li>
            ))}
        </ul>

        <div className="eventArea">
            <input
            className="chatInpTxt"
            type="text"
            placeholder="메시지"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.currentTarget.value)}
            />
            <button className="sendMsg" onClick={()=> {sendMessage(roomId)}}>전송</button>
        </div>
        
    </div>
  );
}

export default ChatRoom;
