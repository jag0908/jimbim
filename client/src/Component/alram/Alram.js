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
        </div>
      </div>
    </div>
  )
}

export default Alram