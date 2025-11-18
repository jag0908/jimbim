import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function ChatRoom({roomId, loginUser, token}) {
  const [stompClient, setStompClient] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

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
    };
  }, [roomId]);



  const sendMessage = (roomId) => {
    if (stompClient && inputMessage.trim()) {
        stompClient.publish({
            destination: `/pub/send/${roomId}`,
            body: JSON.stringify({content: inputMessage, sender: loginUser.name}),
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

  return (
    <div className="privateChatRoom">
        <h2>{roomId}번 방</h2>
        <div>
            <ul>
                {receivedMessages.map((msg, i) => (
                    <li key={i}>
                        <span className="name">{msg.sender}</span>
                        <span className="msg">{msg.content}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="eventArea">
            <input
            type="text"
            placeholder="메시지"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.currentTarget.value)}
            />
            <button onClick={()=> {sendMessage(roomId)}}>전송</button>
        </div>
        <button onClick={()=> {endConnection(); window.location.reload();}}>채팅방 나가기</button>

        
        </div>
  );
}

export default ChatRoom;
