import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { useNavigate, useParams } from 'react-router-dom';

function AlramZzim({formatDateTime}) {

  const {id} = useParams();
  const navigate = useNavigate(); 
  const [zzimAlram, setZzimAlram] = useState(null);

  useEffect(()=> {
    jaxios.get(`/api/alram/myPostZzim/${id}`)
      .then((res)=> {
        console.log(res);
        setZzimAlram(res.data.resDto);
      }).catch(err=>console.error(err));
  }, [])

  function alramRead(targetAtt) {
    jaxios.post(`/api/alram/myPostZzimRead/${targetAtt}`)
      .then((res)=> {
        console.log(res);
        setZzimAlram(res.data.resDto);
      }).catch(err=>console.error(err));
  };

  return (
    <>
      {
        zzimAlram && zzimAlram.length != 0 ?
        zzimAlram && zzimAlram.map((zzim, idx)=> {
          return(
            <div key={idx} className={`alram-item ${zzim.isRead ? "" : "unread"}`} onClick={()=> {alramRead(zzim.id); navigate(`/sh-page/sh-view/${zzim.postId}`);}}>
              <div className="alram-badge"></div>
              <div className="alram-thumbnail">
                <div className="thumbnail-placeholder">
                  <img src={zzim.startUserProfileImg} />
                </div>
              </div>
              <div className="alram-content">
                <div className="alram-text">
                  <p className="alram-message">
                    <strong>{zzim.startUserId}</strong> 님이 회원님의 &nbsp;&nbsp;<strong>"{zzim.postTitle}"</strong> 판매글을 찜했습니다.
                  </p>
                  <span className="alram-time">{formatDateTime(zzim.indate)}</span>
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
          <p className="empty-text">읽지 않은 알림이 없습니다</p>
          <p className="empty-subtext">새로운 알림이 도착하면 여기에 표시됩니다</p>
        </div>
      }
    </>
  )
}

export default AlramZzim