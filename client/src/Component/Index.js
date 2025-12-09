import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/index.css';

const rollingWords = ['짐빔', '중고거래', '스타일', '커뮤니티'];
const featureCards = [
  {
    title: '전국 어디서든 중고거래',
    description: '안전하게 중고 물품을 등록하고 택배와 직거래하세요.',
    action: '/sh-page',
    label: '물건 올리기',
  },
  {
    title: '하자걱정없는 신제품',
    description: '안전하게 제품 물품을 등록하고 판매까지 JIMBIM과 거래하세요.',
    action: '/shop',
    label: '판매/구매 요청',
  },
    {
    title: '커뮤니티',
    description: '소소한 일상부터 동네 소식까지, 이야기 나눠요.',
    action: '/communityList',
    label: '이야기 나누기',
  },
  {
    title: '스타일 피드',
    description: '당신의 스타일을 공유하고 이웃들의 코디를 만나보세요.',
    action: '/style',
    label: '스타일 구경하기',
  },
];

function Index() {
  const [wordIndex, setWordIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rollingWords.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <main id="main-index">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">당신과 함께할</p>
          <div className="hero-title">
            <h1>JIMBIM</h1>
            <div className="rolling-wrap" aria-live="polite">
              {rollingWords.map((word, idx) => (
                <span
                  key={word}
                  className={`rolling-word ${idx === wordIndex ? 'active' : ''}`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
          <p className="subtitle">
            JIMBIM에서 이웃과 소통하고 원하는 모든 것을 찾아보세요.
          </p>
          <div className="quick-links">
            <Link to="/sh-page">JIMBIM 중고거래</Link>
            <Link to="/shop">JIMBIM SHOP</Link>
            <Link to="/communityList">JIMBIM 커뮤니티</Link>
            <Link to="/style">JIMBIM 스타일</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle large" />
          <div className="hero-circle medium" />
          <div className="hero-circle small" />
          <div className="hero-card" onClick={()=> {navigate("/sh-page")}}>
            <p>오늘의 추천</p>
            <strong>JIMBIM 인기상품</strong>
            <span>지금 바로 만나보세요</span>
          </div>
        </div>
      </section>

      <section className="feature-cards">
        {featureCards.map((card) => (
          <div className="feature-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <Link to={card.action}>{card.label}</Link>
          </div>
        ))}
      </section>

      <section className="story-section">
        <div className="story-text">
          <h2>JIMBIM 이야기</h2>
          <p>
            서울 신촌 하이미디어아카데미에서 시작한 우아한짐빔은 이웃과의 연결을 통해
            따뜻한 동네 문화를 만들어가고 있습니다. 지금 바로 참여해보세요!
          </p>
        </div>
        <div className="story-badges">
          <span>안전한 거래</span>
          <span>동네 인증</span>
          <span>실시간 커뮤니티</span>
        </div>
      </section>
    </main>
  );
}

export default Index;