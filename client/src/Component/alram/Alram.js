import React, { useState } from 'react'

import AlramAll from './AlramAll'
import AlramChat from './AlramChat'
import AlramCommunity from './AlramCommunity'
import AlramZzim from './AlramZzim'

import '../../style/Alram.css'

function Alram() {
  const [activeTab, setActiveTab] = useState('all');

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
          <button 
            className={`tab-item ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            커뮤니티
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
                        activeTab == "community" ?
                            <AlramCommunity /> :
                                activeTab == "zzim" ?
                                <AlramZzim /> : null
            }





          {/* 알람 아이템 예시 - unread */}
          <div className="alram-item unread">
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
          </div>

          {/* 알람 아이템 예시 - read */}
          <div className="alram-item">
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
          </div>

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