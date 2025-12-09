import React, { useState, useEffect } from "react";
import jaxios from "../../util/jwtutil";
import "../../style/shopBuyModal.css";
import { useSelector } from 'react-redux';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopBuyModal({ initialProduct, onClose }) {
  // 초기값을 안전하게 설정 (옵셔널 체이닝 대비)
  const [product, setProduct] = useState({
    ...initialProduct,
    imageUrls: initialProduct?.imageUrls || [],
    options: initialProduct?.options || [],
    optionPrices: initialProduct?.optionPrices || {},
    title: initialProduct?.title || "",
    description: initialProduct?.description || "",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [sellList, setSellList] = useState([]);
  const loginUser = useSelector(state => state.user);

  // 상품 상세 정보 가져오기
  useEffect(() => {
    if (!product?.productId) return;

    const fetchProductDetail = async () => {
        try {
        const res = await jaxios.get(`${baseURL}/shop/product/${product.productId}/detail`);
        console.log("productId:", product.productId);
        setProduct(res.data);
        } catch (err) {
        console.error("상품 상세 정보 요청 실패", err);
        // 상품 상세 정보 없으면 초기값 유지
        setProduct((prev) => ({ ...prev }));
        }
    };
    fetchProductDetail();
    }, [product?.productId]);


  // 선택 옵션 변경 시 판매 리스트 가져오기
  useEffect(() => {
    if (!selectedOption) return;
    const fetchSellList = async () => {
      try {
        const res = await jaxios.get(`${baseURL}/shop/sell`, {
          params: {
            productId: product.productId,
            optionId: selectedOption,
          },
        });
        setSellList(res.data.sort((a, b) => a.price - b.price));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSellList();
  }, [selectedOption, product.productId]);

  const handleBuyNow = async (sellId) => {
    try {
        const res = await jaxios.post(`${baseURL}/shop/buy/${sellId}`, {memberId: loginUser.member_id});
        const order = res.data; // ShopBuyOrderDTO
        console.log("주문 완료", order);
        alert(`구매 완료! 주문번호: ${order.orderId}`);
        onClose();
    } catch (err) {
        console.error(err);
        alert("구매 실패");
    }
    };

  // product가 아직 없으면 로딩 표시
  if (!product) return <div>Loading...</div>;

  return (
    <div className="buy-modal-backdrop">
      <div className="buy-modal">
        {/* 닫기 버튼 */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* 제목 */}
        <h2 className="modal-title">구매하기</h2>

        {/* 상품 요약 */}
        <div className="product-summary">
          <img
            className="product-thumb"
            src={product.imageUrls?.[0] || product.firstImage || "/default-image.png"}
            alt={product.title}
            />
          <div>
            <h3>{product.title}</h3>
            <p className="product-desc">{product.description}</p>
          </div>
        </div>

        {/* 옵션 선택 버튼 */}
        <div className="option-grid">
  {product.options?.map((opt) => {
    const price = product.optionPrices?.[opt.optionId] ?? null;

    return (
      <div
        key={opt.optionId}
        className={selectedOption === opt.optionId ? "option-card active" : "option-card"}
        onClick={() => setSelectedOption(opt.optionId)}
      >
        <div className="option-name">{opt.optionName}</div>

        <div
          className="option-price"
          style={{
            color: price ? "red" : "gray",
          }}
        >
          {price ? `${price.toLocaleString()}원` : "가격 없음"}
        </div>
      </div>
    );
  })}
</div>

        {/* 판매 리스트 */}
        {sellList.length > 0 && (
          <div className="sell-list-box">
            <h4>구매 가능한 상품</h4>
            <ul className="sell-list">
              {sellList.map((sell) => (
                <li className="sell-item" key={sell.sellId}>
                  <span>{sell.price.toLocaleString()} 원</span>
                  <button className="buy-now" onClick={() => handleBuyNow(sell.sellId)}>즉시 구매</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="bottom-btns">
          <button
            className="btn-buy"
            disabled={sellList.length === 0}
            onClick={() => sellList[0] && handleBuyNow(sellList[0].sellId)}
          >
            즉시 구매하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopBuyModal;
