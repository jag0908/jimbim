import React, { useEffect, useState } from 'react';
import SideMenu from './MypageSideMenu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/mypage.css';

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

  const totalPrice = shopBuyingList.reduce((sum, item) => {
    return sum + (item.purchasePrice || 0);
  }, 0);


  return (
    <div className="mypageBuyingContainer">
    <SideMenu />
    <div className="buyingBody">
        <div className="buyingTitle">SHOP 구매 내역
        <h3>(상품 불량 문제로 인한 반품이나 환불 시 고객센터로 답변주시길 바랍니다)</h3>
        </div>

        {shopBuyingList.length > 0 ? (
            <div className="buyingListContainer">
                <div className="buyingHeader">
                    <div className="buyField title">상품명</div>
                    <div className="buyField option">옵션</div>
                    <div className="buyField price">가격</div>
                </div>

                {shopBuyingList.map((order, idx) => (
                    <div className="buyingRow" key={idx}>
                        <div className="buyField title">{order.productTitle}</div>
                        <div className="buyField option">{order.optionName}</div>
                        <div className="buyField price">
                            {order.purchasePrice?.toLocaleString()}원
                        </div>
                        
                    </div>
                    
                ))}
                <div className="buyingTotal">
                          총 구매 금액: <span>{totalPrice.toLocaleString()}원</span>
                        </div>
            </div>
        ) : (
            <div className="noBuyingData">구매 내역이 없습니다.</div>
        )}
    </div>
</div>
  );
}

export default Buying;
