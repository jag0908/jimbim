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
  const [shCategoryList, setShCategoryList] = useState([]);
  const [shopSellingList, setShopSellingList] = useState([]);

  const shSellEx = ["판매중", "예약중", "판매완료"]

  useEffect(() => {
    if (!loginUser.member_id) {
      alert("로그인이 필요한 서비스입니다");
      navigate("/");
      return;
    }

    jaxios.get('/api/mypage/getSellingList', { params: { member_id: loginUser.member_id } })
      .then(result => {
        setShSellingList(result.data.shSellingList);
        setShCategoryList(result.data.shCategoryList);
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
  async function deleteSell(sellId){
    if(window.confirm('상품을 삭제하시겠습니까?')){
      await jaxios.delete('/api/mypage/deleteShopSelling', { params: { sellId } })
      .then(result => {
        alert('삭제되었습니다.')
      })
      .catch(err => console.error(err));
      await jaxios.get('/api/mypage/getSellingList', { params: { member_id: loginUser.member_id } })
      .then(result => {
        setShSellingList(result.data.shSellingList);
        setShCategoryList(result.data.shCategoryList);
        setShopSellingList(result.data.shopSellingList);
        console.log(result.data);
      })
      .catch(err => console.error(err));
    }
  }

  return (
      <div className='mypagebody'>
        <SideMenu />
        <div className='mypage'>
          <div className='formtitle'>SHOP 판매 내역</div>

          {/* 중고마을 판매 내역 */}
          {/* <div className='shoparea'>
            <h3>중고마을</h3>
            <div className='sellingRow' >
              <div className='sellingCol sellingColTitle'>상품명</div>
              <div className='sellingCol sellingColTitle'>카테고리</div>
              <div className='sellingCol sellingColTitle'>가격</div>
              <div className='sellingCol sellingColTitle'>상태</div>
              <div className='sellingCol sellingColTitle'>게시일</div>
            </div>
            {shSellingList.length ? (
              shSellingList.map((shSelling, idx) => (
                <div key={idx} className='sellingRow' onClick={() => navigate(`/sh-page/sh-view/${shSelling.postId}`)} style={{ cursor: 'pointer' }}>
                  <div className='sellingCol'>{shSelling.title}</div>
                  <div className='sellingCol'> {(shCategoryList[0])?(shCategoryList[shSelling.categoryId].category_name):(<></>)}</div>
                  <div className='sellingCol'>{shSelling.price?.toLocaleString()} 원</div>
                  <div className='sellingCol'>{shSellEx[shSelling.sellEx]}</div>
                  <div className='sellingCol'>{shSelling.indate?.substring(0, 10) || '-'}</div>
                </div>
              ))
            ) : (
              <div>아직 판매 내역이 없습니다</div>
            )}
          </div> */}

          {/* SHOP 판매 내역 */}
          <div className='shoparea'>
            {/* <h3>SHOP</h3> */}
            <div className='sellingRow' >
              <div className='sellingCol sellingColTitle'>상품명</div>
              <div className='sellingCol sellingColTitle'>사이즈</div>
              <div className='sellingCol sellingColTitle'>카테고리</div>
              <div className='sellingCol sellingColTitle'>가격</div>
              <div className='sellingCol sellingColTitle'>상태</div>
              <div className='sellingCol sellingColTitle'>게시일</div>
              <div className='sellingCol sellingColTitle'>삭제하기</div>
            </div>
            {shopSellingList.length ? (
              shopSellingList.map((sell, idx) => (
                <div key={idx} className='sellingRow'>
                  <div className='sellingCol' onClick={() => navigate(`/shop/product/${sell.product?.productId}`)} style={{ cursor: 'pointer' }}>{sell.product?.title || '-'}</div>
                  <div className='sellingCol' onClick={() => navigate(`/shop/product/${sell.product?.productId}`)} style={{ cursor: 'pointer' }}>{sell.option?.optionName || '-'}</div>
                  <div className='sellingCol' onClick={() => navigate(`/shop/product/${sell.product?.productId}`)} style={{ cursor: 'pointer' }}>{sell.product?.category.category_name || '-'}</div>
                  <div className='sellingCol' onClick={() => navigate(`/shop/product/${sell.product?.productId}`)} style={{ cursor: 'pointer' }}>{sell.price?.toLocaleString()} 원</div>
                  <div className='sellingCol' onClick={() => navigate(`/shop/product/${sell.product?.productId}`)} style={{ cursor: 'pointer' }}>{formatStatus(sell.status)}</div>
                  <div className='sellingCol' onClick={() => navigate(`/shop/product/${sell.product?.productId}`)} style={{ cursor: 'pointer' }}>{sell.indate?.substring(0, 10) || '-'}</div>
                  <div className='sellingCol'>
                    <div className='formBtns' style={{width:'100%'}}>
                      <button style={{width:'auto', background:'red'}} onClick={()=>{deleteSell(sell.sellId)}}>삭제</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>아직 판매 내역이 없습니다</div>
            )}
          </div>

        </div>
      </div>
  );
}

export default Selling;
