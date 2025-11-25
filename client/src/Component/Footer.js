import React from 'react';
import '../style/footer.css';

function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-column">
            <h4>이용안내</h4>
            <ul>
              <li>검수기준</li>
              <li>이용정책</li>
              <li>커뮤니티 가이드라인</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>고객지원</h4>
            <ul>
              <li>공지사항</li>
              <li>서비스 소개</li>
              <li>판매자 방문접수</li>
            </ul>
          </div>
          <div className="footer-support">
            <span className="support-label">고객센터</span>
            <span className="support-number">1588-7813</span>
            <p>운영시간 평일 10:00 - 18:00 (토·일, 공휴일 휴무)</p>
            <p>점심시간 평일 13:00 - 14:00</p>
            <small>1:1 문의하기는 앱에서만 가능합니다.</small>
            <button type="button">자주 묻는 질문</button>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-links">
          <a href="#none">회사소개</a>
          <a href="#none">인재채용</a>
          <a href="#none">제휴제안</a>
          <a href="#none">이용약관</a>
          <a href="#none" className="bold">개인정보처리방침</a>
        </div>

        <div className="footer-company">
          <p>우아한짐빔(주) · 대표 김짐 · 사업자등록번호 : 570-88-01618</p>
          <p>주소 : 서울 신촌 하이미디어아카데미 · 이메일 : help@jimbim.co.kr</p>
          <p>호스팅 서비스 : JIMBIM CLOUD · 통신판매업 신고 : 제 2025-서울신촌-0093호</p>
        </div>

        <div className="footer-notice">
          <strong>신한은행 채무지급보증 안내</strong>
          <p>
            당사는 고객님의 현금 결제와 관련하여 신한은행과 채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다.
          </p>
        </div>

        <div className="footer-disclaimer">
          <p>
            우아한짐빔은 통신판매 중개자로서 개별 판매자가 등록한 상품, 거래정보 및 거래에 관여하지 않으며 이에 대한 책임을 부담하지 않습니다.
            이용약관 및 관련 법령에 따라 등록된 내용이므로 거래 전 검수하시고 안전한 거래를 부탁드립니다.
          </p>
        </div>

        <div className="footer-bottom">
          <p>© JIMBIM Corp.</p>
          <div className="sns-icons">
            <span>IG</span>
            <span>FB</span>
            <span>YT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;