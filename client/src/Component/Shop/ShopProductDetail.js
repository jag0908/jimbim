import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import ShopBuyModal from './ShopBuyModal';
import '../../style/shopDetail.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false); //이삭 수정
  const [currentImage, setCurrentImage] = useState(0);

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
      if (err.response?.status === 404) {
        setError("해당 상품을 찾을 수 없습니다.");
      } else {
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  const handlePrev = () => {
    if (!product?.imageUrls) return;
    setCurrentImage((prev) =>
      prev === 0 ? product.imageUrls.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!product?.imageUrls) return;
    setCurrentImage((prev) =>
      prev === product.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handleIndicatorClick = (index) => {
    setCurrentImage(index);
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="loading-message">상품을 불러오는 중입니다...</div>;

  return (
    <div className="shop-product-detail">
      {/* 왼쪽: 이미지 */}
      <div className="product-images">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <div className="image-slider">
            <img
              src={product.imageUrls[currentImage]}
              alt={`${product.title}-${currentImage}`}
            />

            {/* 좌우 버튼 이미지 */}
            <button className="nav-button prev" onClick={handlePrev}>
              <img
                src="/icons/left-arrow.png"
                alt="왼쪽"
                className="nav-icon prev"
                onClick={handlePrev}
            />
            </button>
            <button className="nav-button next" onClick={handleNext}>
              <img
                src="/icons/right-arrow.png"
                alt="오른쪽"
                className="nav-icon next"
                onClick={handleNext}
              />
            </button>

            {/* 인디케이터 - 이미지 아래 */}
            <div className="image-indicator">
              {product.imageUrls.map((_, idx) => (
                <span
                  key={idx}
                  className={idx === currentImage ? "active" : ""}
                  onClick={() => handleIndicatorClick(idx)}
                >
                  ㅡ
                </span>
              ))}
            </div>
          </div>
        ) : (
          <span className="noimg">NO IMAGE</span>
        )}
      </div>

      {/* 오른쪽: 상품 정보 */}
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="product-price">
          {product.minPrice != null
            ? `${product.minPrice.toLocaleString()} 원`
            : "가격 정보 없음"}
        </p>
        <p className="product-description">{product.description || "상품 설명이 없습니다."}</p>

        {/* 버튼 가로 배치 */}
        <div className="product-buttons">
          <button className="btn-sell">판매하기</button>
          <button className="btn-buy" onClick={() => setIsBuyModalOpen(true)}>
            구매하기
          </button>
        </div>
      </div>

      {isBuyModalOpen &&(
        <ShopBuyModal
          product={product}
          onClose={()=> setIsBuyModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ShopProductDetail;
