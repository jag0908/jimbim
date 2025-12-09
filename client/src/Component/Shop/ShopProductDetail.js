import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import ShopBuyModal from './ShopBuyModal';
import '../../style/shopDetail.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopProductDetail() {
  const loginUser = useSelector(state => state.user);
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false); //이삭 수정
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
    setSelectedOption(null);  // 초기화
    setSelectedPrice("");
    setIsOptionModalOpen(true);
  };

  // 옵션 선택 시 바로 가격 입력 모달로 전환
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
      alert("판매 등록 완료!");
      setIsPriceModalOpen(false);
      setSelectedOption(null);
      setSelectedPrice("");
      fetchProduct(); // 최저가 업데이트
    } catch (err) {
      console.error(err);
      alert("판매 등록 중 오류가 발생했습니다.");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="loading-message">상품을 불러오는 중입니다...</div>;

  return (
    <div className="shop-product-detail">

      {/* 이미지 */}
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
        <p className="product-price">최저가는 판매하기 버튼 클릭 후 확인</p>
        <div className="product-buttons">
          <button className="btn-sell" onClick={handleClickSell}>판매하기</button>
          <button className="btn-buy" onClick={() => setIsBuyModalOpen(true)}>
            구매하기
          </button>
        </div>
      </div>

      {/* 옵션 선택 모달 */}
      {isOptionModalOpen && (
          <div className="sell-modal" onClick={() => setIsOptionModalOpen(false)}>
            <div className="sell-modal-content" onClick={e => e.stopPropagation()}>

              {/* 왼쪽 위 X 버튼 */}
              <button
                  className="modal-close-btn"
                  onClick={() => setIsOptionModalOpen(false)}
                  aria-label="닫기"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#333',
                    zIndex: 10,
                  }}
              >
                ×
              </button>

              <h2>옵션 선택</h2>
              <div className="option-list">
                {product.options.map(opt => {
                  // 옵션별 최저가 계산
                  const prices = product.sellLists?.filter(s => s.option.optionId === opt.optionId).map(s => s.price) || [];
                  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

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
                            background: selectedOption?.optionId === opt.optionId ? '#007bff' : '#f7f7f7',
                            color: selectedOption?.optionId === opt.optionId ? '#fff' : '#000'
                          }}
                          onClick={() => handleSelectOption(opt)} // 클릭시 바로 가격 입력 모달로 이동
                      >
                        <span>{opt.optionName}</span>
                        <span>{minPrice != null ? `${minPrice.toLocaleString()} 원` : "판매 입찰"}</span>
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

              {/* 왼쪽 위 X 버튼 */}
              <button
                  className="modal-close-btn"
                  onClick={() => setIsPriceModalOpen(false)}
                  aria-label="닫기"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#333',
                    zIndex: 10,
                  }}
              >
                ×
              </button>

              <h2>가격 입력</h2>
              <input
                  type="number"
                  placeholder="가격을 입력하세요"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
              />

              <div className="modal-buttons" style={{ marginTop: '20px' }}>
                <button className="btn-confirm" onClick={handleSellConfirm} style={{ flex: 1, marginRight: '8px' }}>
                  판매하기
                </button>
                <button
                    className="btn-cancel"
                    onClick={() => {
                      setIsPriceModalOpen(false);
                      setIsOptionModalOpen(true);
                    }}
                    style={{ flex: 1 }}
                >
                  이전
                </button>
              </div>
            </div>
          </div>
      )}

    {/* 구매하기 모달 */}
      {isBuyModalOpen &&(
          <ShopBuyModal
              initialProduct={{
                productId: product.productId,
                ...product,                        // 기존 product 정보 유지
                imageUrls: product.firstImage ? [product.firstImage] : [], // 배열로 변환
                options: product.options || [],    // 옵션 초기값
                optionPrices: product.optionPrices || {}, // 가격 초기값
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
