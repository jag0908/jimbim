import axios from 'axios'
import jaxios from '../../util/jwtutil'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function AlramMyChat({formatDateTime}) {
  
  const {id} = useParams();
  const navigate = useNavigate(); 
  const [msgAlram, setMsgAlram] = useState(null);

  useEffect(()=> {
    
    jaxios.get(`/api/alram/chatMyMsg/${id}`)
      .then((res)=> {
        console.log(res);
        setMsgAlram(res.data);
      }).catch(err=>console.error(err));
  }, [])

  return (
    <>

      {
        msgAlram && msgAlram.resDto.length != 0 ?
          msgAlram.resDto.map((msg, idx)=> {
            return(
              <div key={idx} className={`alram-item ${msg.unreadCount > 0 ? "unread" : ""}`} onClick={()=> {navigate(`/sh-page/sh-view/${msg.postId}`)}}>
                <div className="alram-badge"></div>
                <div className="alram-thumbnail">
                  <div className="thumbnail-placeholder">
                    <img src={msg.sellerProfileImg} />
                  </div>
                </div>
                <div className="alram-content">
                  <div className="alram-text">
                    <p className="alram-message">
                      [<strong>{msg.sellerName}</strong> 님에게 보낸 채팅방]
                      <br />
                      내가 구매하는 게시글:  <strong>"{msg.postTitle}"</strong>
                      <br />
                      제일 최근 채팅: <strong>"{msg.shortContent}"</strong>
                      <br />
                      내가 읽지 않은 채팅: <strong>"{msg.unreadCount}"</strong> 개
                    </p>
                    <span className="alram-time">{formatDateTime(msg.lastTime)}</span>
                  </div>
                </div>
                <button className="btn-alram-action">이동</button>
              </div>
            )
          })
        
        :
          /* Empty State */
          <div className="alram-empty">
            <div className="empty-icon">🔔</div>
            <p className="empty-text">채팅방이 없습니다.</p>
            <p className="empty-subtext">새로운 채팅을 시작하시면 채팅방이 여기에 표시됩니다</p>
          </div>
      }
      
    </>
  )
}

export default AlramMyChat