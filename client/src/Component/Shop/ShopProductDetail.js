import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import ShopBuyModal from './ShopBuyModal';
import '../../style/shopDetail.css';
import { useNavigate } from 'react-router-dom';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopProductDetail() {
  const loginUser = useSelector(state => state.user);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false); 
  const [currentImage, setCurrentImage] = useState(0);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/shop/product/${productId}`);
      setProduct(res.data);
      setError("");
      setCurrentImage(0);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 404 ? "해당 상품을 찾을 수 없습니다." : "상품 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 이미지 슬라이더
  const handlePrev = () => {
    if (!product?.imageUrls || product.imageUrls.length === 0) return;
    setCurrentImage(prev => prev === 0 ? product.imageUrls.length - 1 : prev - 1);
  };

  const handleNext = () => {
    if (!product?.imageUrls || product.imageUrls.length === 0) return;
    setCurrentImage(prev => prev === product.imageUrls.length - 1 ? 0 : prev + 1);
  };

  const handleIndicatorClick = (index) => setCurrentImage(index);

  // 판매하기 버튼 클릭 → 옵션 선택 모달 열기
  const handleClickSell = () => {
    if (!product?.options || product.options.length === 0) {
      alert("옵션이 없습니다.");
      return;
    }
    setSelectedOption(null);
    setSelectedPrice("");
    setIsOptionModalOpen(true);
  };

  // 옵션 선택 → 가격 입력 모달 열기
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsOptionModalOpen(false);
    setIsPriceModalOpen(true);
  };

  // 가격 입력 후 판매 등록
  const handleSellConfirm = async () => {
    if (!selectedOption) return alert("옵션을 선택해주세요.");
    if (!selectedPrice || selectedPrice <= 0) return alert("가격을 입력해주세요.");

    try {
      await jaxios.post(`${baseURL}/shop/sell`, {
        productId: product.productId,
        optionId: selectedOption.optionId,
        price: selectedPrice,
        sellerId: loginUser.member_id
      });

      alert("판매 등록이 완료되었습니다.");
      setIsPriceModalOpen(false);
      setSelectedOption(null);
      setSelectedPrice("");
      fetchProduct(); // 등록 후 최저가 포함 상품 정보 갱신
    } catch (err) {
      console.error(err);
      alert("판매 등록 중 오류가 발생했습니다.");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="loading-message">상품을 불러오는 중입니다...</div>;

  return (
    <div className="shop-product-detail">

      {/* 이미지 슬라이더 */}
      <div className="product-images">
        {product.imageUrls?.length > 0 ? (
          <div className="shop-slider">
            <img src={product.imageUrls[currentImage]} alt={`${product.title}-${currentImage}`} />
            {product.imageUrls.length > 1 && (
              <>
                <button className="shop-slider-btn prev" onClick={handlePrev}><img src="/icons/left-arrow.png" alt="이전" /></button>
                <button className="shop-slider-btn next" onClick={handleNext}><img src="/icons/right-arrow.png" alt="다음" /></button>
              </>
            )}
            <div className="shop-slider-indicator">
              {product.imageUrls.map((_, idx) => (
                <span key={idx} className={idx === currentImage ? "active" : ""} onClick={() => handleIndicatorClick(idx)}>ㅡ</span>
              ))}
            </div>
          </div>
        ) : <span className="noimg">NO IMAGE</span>}
      </div>

      {/* 상품 정보 */}
      <div className="product-info">
        <h1>{product.title}</h1>

        {/* 정가 */}
        <p className="product-price">정가: {product.price?.toLocaleString()}원</p>

        {/* 전체 최저가 */}
        <p className="product-price" style={{ color: "#000", fontSize:"20px" }}>
          {product.minPrice != null ? product.minPrice.toLocaleString() : "-"}원
        </p>


        {/* 판매/구매 버튼 */}
        <div className="product-buttons">
          <button className="back-btn" onClick={() => navigate(-1)}>이전</button>

          <button className="btn-sell" onClick={handleClickSell}>판매하기</button>
          <button className="btn-buy" onClick={() => setIsBuyModalOpen(true)}>구매하기</button>
        </div>
      </div>

      {/* 옵션 선택 모달 */}
      {isOptionModalOpen && (
        <div className="sell-modal" onClick={() => setIsOptionModalOpen(false)}>
          <div className="sell-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsOptionModalOpen(false)}>✕</button>
            <h2>옵션 선택</h2>
            <div className="option-list">
              {product.options.map(opt => {
                const minPrice = product.optionPrices?.[opt.optionId];
                return (
                  <div
                    key={opt.optionId}
                    style={{
                      marginBottom: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: selectedOption?.optionId === opt.optionId ? '#fff' : '#000'
                    }}
                    onClick={() => handleSelectOption(opt)}
                  >
                    <span>{opt.optionName}</span>
                    <span
                      style={{
                        color: minPrice != null ? "red" : "#5a5a5aff" // 금액: 빨간색 / 판매 입찰: 연한 회색
                      }}
                    >
                      {minPrice != null ? `${minPrice.toLocaleString()}원` : "판매 입찰"}
                    </span>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 가격 입력 모달 */}
      {isPriceModalOpen && (
        <div className="sell-modal" onClick={() => setIsPriceModalOpen(false)}>
          <div className="sell-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsPriceModalOpen(false)}>✕</button>
            <h2 style={{ marginBottom: '23px' }}>가격 입력</h2>
            <input
              type="number"
              placeholder="가격을 입력하세요"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
            />
            <div className="modal-buttons" style={{ marginTop: '20px' }}>
              <button className="btn-confirm" onClick={handleSellConfirm} style={{ flex: 1, marginRight: '8px' }}>판매하기</button>
              <button
                className="btn-cancel"
                onClick={() => { setIsPriceModalOpen(false); setIsOptionModalOpen(true); }}
                style={{ flex: 1 }}
              >
                이전
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 구매 모달 */}
      {isBuyModalOpen && (
        <ShopBuyModal
          initialProduct={{
            productId: product.productId,
            ...product,
            imageUrls: product.firstImage ? [product.firstImage] : [],
            options: product.options || [],
            optionPrices: product.optionPrices || {},
            title: product.title || "",
            description: product.description || "",
          }}
          onClose={() => setIsBuyModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ShopProductDetail;
