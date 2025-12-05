import axios from 'axios'
import jaxios from '../../util/jwtutil'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function AlramChat({formatDateTime}) {
  
  const {id} = useParams();
  const navigate = useNavigate(); 
  const [msgAlram, setMsgAlram] = useState(null);

  useEffect(()=> {
    
    jaxios.get(`/api/alram/chatMsg/${id}`)
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
              <div key={idx} className={`alram-item ${msg.sellerReadMsg ? "" : "unread"}`} onClick={()=> {navigate(`/sh-page/sh-view/${msg.postId}`)}}>
                <div className="alram-badge"></div>
                <div className="alram-thumbnail">
                  <div className="thumbnail-placeholder">
                    <img src={msg.buyerProfileImg} />
                  </div>
                </div>
                <div className="alram-content">
                  <div className="alram-text">
                    <p className="alram-message">
                      <strong>{msg.buyerName}</strong> 님이 회원님의 &nbsp;&nbsp;<strong>"{msg.postTitle}"</strong> 판매글에 채팅을 남겼습니다.
                      <br />
                      "{msg.content}"
                    </p>
                    <span className="alram-time">{formatDateTime(msg.indate)}</span>
                  </div>
                </div>
                <button className="btn-alram-action">이동</button>
              </div>
            )
          })
        
        :
          /* Empty State */
          <div className="alram-empty" style={{display: 'none'}}>
            <div className="empty-icon">🔔</div>
            <p className="empty-text">알림이 없습니다</p>
            <p className="empty-subtext">새로운 알림이 도착하면 여기에 표시됩니다</p>
          </div>
      }
      
    </>
  )
}

export default AlramChat