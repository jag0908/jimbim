import React, { useState,useEffect } from 'react'

import AlramAll from './AlramAll'
import AlramChat from './AlramChat'
import AlramZzim from './AlramZzim'

// 이삭 수정
import AlramFollow from './AlramFollow'
import AlramReply from './AlramReply'
import AlramLike from './AlramLike'


import '../../style/Alram.css'

function Alram() {
  const [activeTab, setActiveTab] = useState('all');

  // 이삭 수정
  useEffect(() => {
    let memberId = sessionStorage.getItem("member_id");

    if (!memberId) {
      const token = sessionStorage.getItem("accessToken");
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          memberId = payload.member_id;

          if (memberId) {
            sessionStorage.setItem("member_id", memberId);
            console.log("member_id loaded from JWT:", memberId);
          }
        } catch (e) {
          console.error("JWT 파싱 실패:", e);
        }
      }
    }
  }, []);


  return (
    <div id="alram-page">
      <div className="alram-container">
        {/* Header */}
        <div className="alram-header">
          <h1 className="alram-title">알림</h1>
          <button className="btn-read-all">전체 읽음</button>
        </div>

        {/* Tab Navigation */}
        <div className="alram-tabs">
          <button 
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            전체
          </button>
          <button 
            className={`tab-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            거래
          </button>

          {/* 이삭 수정 */}
          <button 
            className={`tab-item ${activeTab === 'follow' ? 'active' : ''}`}
            onClick={() => setActiveTab('follow')}
          >
            팔로우
          </button>
          <button 
            className={`tab-item ${activeTab === 'reply' ? 'active' : ''}`}
            onClick={() => setActiveTab('reply')}
          >
            댓글
          </button>
          <button 
            className={`tab-item ${activeTab === 'like' ? 'active' : ''}`}
            onClick={() => setActiveTab('like')}
          >
            좋아요
          </button>

          <button 
            className={`tab-item ${activeTab === 'zzim' ? 'active' : ''}`}
            onClick={() => setActiveTab('zzim')}
          >
            찜
          </button>
        </div>

        {/* Notification List */}
        <div className="alram-list">
            {
                activeTab == "all" ? 
                    <AlramAll /> :
                    activeTab == "chat" ? 
                        <AlramChat /> :
                          activeTab == "zzim" ?
                            <AlramZzim /> :
                              activeTab == "follow" ? //이삭 수정
                                <AlramFollow /> :
                                  activeTab == "reply" ?
                                    <AlramReply /> :
                                      activeTab == "like" ?
                                      <AlramLike /> : null
            }





          {/* 알람 아이템 예시 - unread */}
          {/* <div className="alram-item unread">
            <div className="alram-badge"></div>
            <div className="alram-thumbnail">
              <div className="thumbnail-placeholder"></div>
            </div>
            <div className="alram-content">
              <div className="alram-text">
                <p className="alram-message">
                  <strong>사용자님</strong>이 회원님의 게시글에 댓글을 남겼습니다.
                </p>
                <span className="alram-time">5분 전</span>
              </div>
            </div>
            <button className="btn-alram-action">확인</button>
          </div> */}

          {/* 알람 아이템 예시 - read */}
          {/* <div className="alram-item">
            <div className="alram-badge"></div>
            <div className="alram-thumbnail">
              <div className="thumbnail-placeholder"></div>
            </div>
            <div className="alram-content">
              <div className="alram-text">
                <p className="alram-message">
                  상품이 <strong>정상적으로 배송</strong>되었습니다.
                </p>
                <span className="alram-time">2시간 전</span>
              </div>
            </div>
            <button className="btn-alram-action">확인</button>
          </div> */}

          {/* 더 많은 알람 아이템들... */}
          <div className="alram-item">
            <div className="alram-badge"></div>
            <div className="alram-thumbnail">
              <div className="thumbnail-placeholder"></div>
            </div>
            <div className="alram-content">
              <div className="alram-text">
                <p className="alram-message">
                  찜한 상품의 <strong>가격이 변동</strong>되었습니다.
                </p>
                <span className="alram-time">1일 전</span>
              </div>
            </div>
            <button className="btn-alram-action">확인</button>
          </div>

          <div className="alram-item">
            <div className="alram-badge"></div>
            <div className="alram-thumbnail">
              <div className="thumbnail-placeholder"></div>
            </div>
            <div className="alram-content">
              <div className="alram-text">
                <p className="alram-message">
                  <strong>시스템 점검</strong> 안내: 2025년 1월 5일 02:00 ~ 04:00
                </p>
                <span className="alram-time">3일 전</span>
              </div>
            </div>
            <button className="btn-alram-action">확인</button>
          </div>
        </div>

        {/* Empty State */}
        <div className="alram-empty" style={{display: 'none'}}>
          <div className="empty-icon">🔔</div>
          <p className="empty-text">알림이 없습니다</p>
          <p className="empty-subtext">새로운 알림이 도착하면 여기에 표시됩니다</p>
        </div>
      </div>
    </div>
  )
}

export default Alram