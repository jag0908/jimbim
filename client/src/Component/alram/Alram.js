import React, { useEffect, useState } from 'react'

import AlramAll from './AlramAll'
import AlramChat from './AlramChat'
import AlramCommunity from './AlramCommunity'
import AlramZzim from './AlramZzim'

import '../../style/Alram.css'
import { active } from 'sortablejs'
import AlramMyChat from './AlramMyChat'
import AlramSuggest from './AlramSuggest'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Alram() {
  const loginUser = useSelector(state=>state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isDisplay, setIsDisplay] = useState(null);

  function formatDateTime(indate) {
        const date = new Date(indate);
        const now = new Date();

        // 시간 제외하고 날짜만 비교하기 위해 00:00 기준으로 변환
        const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / 1000 / 60);
        const diffHours = Math.floor(diffMinutes / 60);

        const diffDays = Math.floor((startOfNow - startOfDate) / (1000 * 60 * 60 * 24));

        // 오늘일 경우
        if (diffDays === 0) {
            if (diffHours > 0) return `${diffHours}시간 전`;
            if (diffMinutes > 0) return `${diffMinutes}분 전`;
            return `방금 전`;
        }

        // 1달(30일) 미만
        if (diffDays < 30) {
            return `${diffDays}일 전`;
        }

        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) {
            return `${diffMonths}달 전`;
        }

        // 1년 이상은 날짜 출력
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
  }

  useEffect(()=> {
    if (!loginUser.userid) {
      alert("로그인이 필요한 서비스입니다."); 
      return navigate("/login");
    }
  }, [])

  return (
    <div id="alram-page">
      <div className="alram-container">
        {/* Header */}
        <div className="alram-header">
          <h1 className="alram-title">알림</h1>
          {/* <button className="btn-read-all" style={isDisplay}>전체 읽음</button> */}
        </div>

        {/* Tab Navigation */}
        <div className="alram-tabs">
          <button 
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {setActiveTab('all');}}
          >
            전체
          </button>
          <button 
            className={`tab-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => {setActiveTab('chat');}}
          >
            채팅
          </button>
          <button 
            className={`tab-item ${activeTab === 'myChat' ? 'active' : ''}`}
            onClick={() => {setActiveTab('myChat');}}
          >
            내 구매 채팅
          </button>
          <button 
            className={`tab-item ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => {setActiveTab('community');}}
          >
            커뮤니티
          </button>
          <button 
            className={`tab-item ${activeTab === 'zzim' ? 'active' : ''}`}
            onClick={() => {setActiveTab('zzim');}}
          >
            찜
          </button>
          <button 
            className={`tab-item ${activeTab === 'suggest' ? 'active' : ''}`}
            onClick={() => {setActiveTab('suggest');}}
          >
            가격 제안
          </button>
        </div>

        {/* Notification List */}
        <div className="alram-list">
            {
                activeTab == "all" ? 
                    <AlramAll formatDateTime={formatDateTime} /> :
                    activeTab == "chat" ? 
                        <AlramChat formatDateTime={formatDateTime} /> :
                        activeTab == "myChat" ? 
                            <AlramMyChat formatDateTime={formatDateTime} /> :
                            activeTab == "community" ?
                                <AlramCommunity /> :
                                activeTab == "zzim" ?
                                    <AlramZzim formatDateTime={formatDateTime} /> : 
                                    activeTab == "suggest" ?
                                        <AlramSuggest formatDateTime={formatDateTime} /> :
                                        null
            }
        </div>


      </div>
    </div>
  )
}

export default Alram