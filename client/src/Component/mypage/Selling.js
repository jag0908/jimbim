import React, { useEffect, useState } from 'react';
import SideMenu from './MypageSideMenu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/selling.css';

function Selling() {
  const loginUser = useSelector(state => state.user);
  const navigate = useNavigate();

  const [shSellingList, setShSellingList] = useState([]);
  const [shopSellingList, setShopSellingList] = useState([]);

  useEffect(() => {
    if (!loginUser.member_id) {
      alert("로그인이 필요한 서비스입니다");
      navigate("/");
      return;
    }

    jaxios.get('/api/mypage/getSellingList', { params: { member_id: loginUser.member_id } })
      .then(result => {
        setShSellingList(result.data.shSellingList);
        setShopSellingList(result.data.shopSellingList);
        console.log(result.data);
      })
      .catch(err => console.error(err));
  }, [loginUser, navigate]);

  // SHOP 판매 상태 표시
  const formatStatus = (status) => {
    if (status === 'N') return '거래 전';
    if (status === 'Y') return '거래 완료';
    return status;
  };

  return (
    <article style={{ height: '100%' }}>
      <div className='mypagebody'>
        <SideMenu />
        <div className='mypage'>
          <div className='formtitle'>판매 내역</div>

          {/* 중고마을 판매 내역 */}
          <div className='shoparea'>
            <h3>중고마을</h3>
            {shSellingList.length ? (
              shSellingList.map((shSelling, idx) => (
                <div key={idx} className='sellingRow'>
                  <div className='sellingCol'>{shSelling.title}</div>
                  <div className='sellingCol'>{shSelling.price?.toLocaleString()} 원</div>
                </div>
              ))
            ) : (
              <div>아직 판매 내역이 없습니다</div>
            )}
          </div>

          {/* SHOP 판매 내역 */}
          <div className='shoparea'>
            <h3>SHOP</h3>
            {shopSellingList.length ? (
              shopSellingList.map((sell, idx) => (
                <div key={idx} className='sellingRow' onClick={() => navigate(`/ShopDetail/${sell.product?.productId}`)} style={{ cursor: 'pointer' }}>
                  <div className='sellingCol'>{sell.product?.title || '-'}</div>
                  <div className='sellingCol'>{sell.option?.optionName || '-'}</div>
                  <div className='sellingCol'>{sell.price?.toLocaleString()} 원</div>
                  <div className='sellingCol'>{formatStatus(sell.status)}</div>
                  <div className='sellingCol'>{sell.indate?.substring(0, 10) || '-'}</div>
                </div>
              ))
            ) : (
              <div>아직 판매 내역이 없습니다</div>
            )}
          </div>

        </div>
      </div>
    </article>
  );
}

export default Selling;
