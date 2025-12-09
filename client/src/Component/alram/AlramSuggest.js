import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { useNavigate, useParams } from 'react-router-dom';

function AlramSuggest({formatDateTime}) {

  const {id} = useParams();
  const navigate = useNavigate(); 
  const [alramSuggest, setAlramSuggest] = useState(null);

  useEffect(()=> {
    jaxios.get(`/api/alram/myPostSuggest/${id}`)
      .then((res)=> {
        // console.log(res);
        setAlramSuggest(res.data.resDto);
      }).catch(err=>console.error(err));
  }, [])

  function alramRead(targetAtt) {
    jaxios.post(`/api/alram/myPostSuggest/${targetAtt}`)
      .then((res)=> {
        // console.log(res);
      }).catch(err=>console.error(err));
  };

  return (
    <>
      {
        alramSuggest && alramSuggest.length != 0 ?
        alramSuggest && alramSuggest.map((suggest, idx)=> {
          return(
            <>
            {
              suggest.approved == 1 ?
              <div key={idx} className={`alram-item ${suggest.isRead ? "" : "unread"}`} onClick={()=> {alramRead(suggest.id); navigate(`/sh-page/sh-view/${suggest.postId}`);}}>
                <div className="alram-badge"></div>
                <div className="alram-thumbnail">
                  <div className="thumbnail-placeholder">
                    <img src={suggest.startUserProfileImg} />
                  </div>
                </div>
                <div className="alram-content">
                  <div className="alram-text">
                    <p className="alram-message">
                      <strong>{suggest.startUserId}</strong> 님이 회원님의 &nbsp;&nbsp;<strong>"{suggest.postTitle}"</strong> 판매글에 <strong>"{suggest.price}원"</strong>으로의 가격 제안을 <strong>승낙</strong>하셨습니다.
                    </p>
                    <span className="alram-time">{formatDateTime(suggest.indate)}</span>
                  </div>
                </div>
                <button className="btn-alram-action">이동</button>
              </div>
              :
              <div key={idx} className={`alram-item ${suggest.isRead ? "" : "unread"}`} onClick={()=> {alramRead(suggest.id); navigate(`/sh-page/sh-view/${suggest.postId}`);}}>
                <div className="alram-badge"></div>
                <div className="alram-thumbnail">
                  <div className="thumbnail-placeholder">
                    <img src={suggest.startUserProfileImg} />
                  </div>
                </div>
                <div className="alram-content">
                  <div className="alram-text">
                    <p className="alram-message">
                      <strong>{suggest.startUserId}</strong> 님이 회원님의 &nbsp;&nbsp;<strong>"{suggest.postTitle}"</strong> 판매글에 <strong>"{suggest.price}원"</strong>으로 가격을 제안하셨습니다.
                    </p>
                    <span className="alram-time">{formatDateTime(suggest.indate)}</span>
                  </div>
                </div>
                <button className="btn-alram-action">이동</button>
              </div>
            }
            </>
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

export default AlramSuggest