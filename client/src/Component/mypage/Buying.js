import React, { useEffect, useState } from 'react';
import SideMenu from './MypageSideMenu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';

function Buying() {
  const loginUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const [shopBuyingList, setShopBuyingList] = useState([]);

  useEffect(() => {
  if (!loginUser.userid) {
    alert("로그인이 필요한 서비스입니다");
    navigate("/");
  } else {
    jaxios.get('/api/mypage/getShopBuyingList', {
      params: { member_id: loginUser.member_id }
    })
    .then((result) => {
      setShopBuyingList(result.data || []); // 여기 수정
      console.log(result.data);
    })
    .catch((err) => console.error(err));
  }
}, [loginUser, navigate]);


  // sellList와 옵션을 평탄화(flatten)하는 함수
  const flattenSellList = (sellList) => {
    if (!sellList?.product) return [];

    const product = sellList.product;

    let items = [{
      title: product.title || '상품명 없음',
      price: product.price?.toLocaleString() || '0',
      category: product.category?.category_name || '',
      image: product.images?.[0]?.filePath || '',
      options: product.options?.map(opt => opt.optionName).join(', ') || null
    }];

    // 옵션 안의 sellList도 재귀 처리
    product.options?.forEach(opt => {
      opt.sellList?.forEach(subSell => {
        items = items.concat(flattenSellList(subSell));
      });
    });

    return items;
  };

  return (
    <article style={{ height: '100%' }}>
      <div className='mypagebody'>
        <SideMenu />
        <div className='mypage'>
          <div className='formtitle'>SHOP 구매 내역</div>

          <div className='shoparea'>
            <h3>SHOP</h3>

            {shopBuyingList.length > 0 ? (
  shopBuyingList.map((order, idx) => (
    <div key={idx} className="buying-item" style={{ marginBottom: 20 }}>
      <div>상품명: {order.productTitle}</div>
      <div>사이즈: {order.optionName}</div>
      <div>가격: {order.purchasePrice?.toLocaleString() || '0'}원</div>
      {/* 이미지나 카테고리 필드가 있으면 추가 */}
    </div>
  ))
) : (
  <div>아직 구매 내역이 없습니다</div>
)}


          </div>
        </div>
      </div>
    </article>
  );
}

export default Buying;
