import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil'
import { useNavigate, useParams } from 'react-router-dom'
import AlramChat from './AlramChat';

function AlramAll({formatDateTime}) {
  const {id} = useParams();
  const navigate = useNavigate(); 
  const [AllAlram, setAllAlram] = useState(null);
  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(()=> {
    jaxios.get(`/api/alram/allAlram/${id}`)
        .then((res)=> {
          console.log(res);
          setAllAlram(res.data);
        }).catch(err=>console.error(err));
  }, [])

  function alramSuggestRead(targetAtt) {
    jaxios.post(`/api/alram/myPostSuggest/${targetAtt}`)
      .then((res)=> {
        console.log(res);
      }).catch(err=>console.error(err));
  };

  function alramZzimRead(targetAtt) {
    jaxios.post(`/api/alram/myPostZzimRead/${targetAtt}`)
      .then((res)=> {
        console.log(res);
      }).catch(err=>console.error(err));
  };

  function alarmNotiRead(targetAtt) {
    jaxios.delete(`${baseURL}/api/notification/${targetAtt}`);
  }

  return (
    <>
        {
        AllAlram && AllAlram.resDto.length != 0 ?
          AllAlram.resDto.map((alram, idx)=> {
            return(
             
                (alram.alarmType == "MYCHAT" || alram.alarmType == "CHAT") && alram.isRead ? null : 
          
                            <div key={idx} className={`alram-item ${alram.isRead ? "" : "unread"}`} onClick={
                                ()=> {
                                    navigate(`${alram.linkurl}`); 
                                    
                                    if(alram.alarmType == "ZZIM") {
                                        alramZzimRead(alram.id);
                                    } else if(alram.alarmType == "SUGGEST") {
                                        alramSuggestRead(alram.id);
                                    } else if(alram.alarmType == "NOTI") {
                                        alarmNotiRead(alram.id);
                                    }
                                    
                                }
                            }>
                                <div className="alram-badge"></div>
                                <div className="alram-thumbnail">
                                <div className="thumbnail-placeholder">
                                    <img src={alram.senderProfileImg} />
                                </div>
                                </div>
                                <div className="alram-content">
                                <div className="alram-text">
                                    <p className="alram-message">
                                        {
                                        alram.alarmType == "NOTI" ?
                                        <strong>{alram.senderId}</strong> :
                                        alram.alarmType == "CHAT" ?
                                        <strong>[내 판매 채팅] {alram.senderId}님과의 읽지않은 채팅이 있습니다.</strong> :
                                        alram.alarmType == "SUGGEST" ?
                                        <strong>{alram.senderId}</strong> :
                                        alram.alarmType == "MYCHAT" ?
                                        <strong>[내 구매 채팅] {alram.senderId}님과의 읽지않은 채팅이 있습니다.</strong> :
                                        alram.alarmType == "ZZIM" ?
                                        <strong>{alram.senderId}</strong> : "noalram"
                                        }
                                    </p>
                                    <span className="alram-time">{formatDateTime(alram.indate)}</span>
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

export default AlramAll