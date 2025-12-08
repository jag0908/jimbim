import React, { useEffect, useState } from 'react';
import jaxios from '../../util/jwtutil';
import '../../style/shopView.css';
import SellModal from './ShopSellModal';
import BuyModal from './ShopBuyModal';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopView() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [zzimList, setZzimList] = useState([]);

  // 상품 목록 불러오기
  useEffect(() => {
    fetchProducts();
    fetchZzim();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/shop/products`);
      setProducts(res.data);
      if (res.data.length > 0) setSelectedProduct(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchZzim = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/shop/zzim`);
      setZzimList(res.data.map(z => z.productId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleZzim = async (productId) => {
    try {
      await jaxios.post(`${baseURL}/shop/zzim`, { productId });
      setZzimList([...zzimList, productId]);
    } catch (err) {
      console.error(err);
    }
  };

  const openSellModal = (product) => {
    setSelectedProduct(product);
    setShowSellModal(true);
  };

  const openBuyModal = (product) => {
    setSelectedProduct(product);
    setShowBuyModal(true);
  };

  if (!selectedProduct) return <div>상품을 불러오는 중입니다...</div>;

  return (
    <div className="shopView-container" style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      {/* 왼쪽: 상품 목록 */}
      <div className="shopView-list" style={{ width: 300, overflowY: 'auto', borderRight: '1px solid #ddd' }}>
        {products.map(product => (
          <div
            key={product.productId}
            className="shopView-card"
            onClick={() => setSelectedProduct(product)}
            style={{
              padding: 10,
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: selectedProduct.productId === product.productId ? '#f0f0f0' : '#fff'
            }}
          >
            <img
              src={`${baseURL}/${product.imageUrls?.[0]}`}
              alt={product.title}
              style={{ width: '100%', borderRadius: 6 }}
            />
            <h4>{product.title}</h4>
            <p>가격: {product.price?.toLocaleString('ko-KR')}원</p>
            <p>배송비: {product.deliveryPrice}원</p>
            <div>
              <button onClick={(e) => { e.stopPropagation(); handleZzim(product.productId); }}>
                {zzimList.includes(product.productId) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽: 선택된 상품 상세 */}
      <div className="shopView-detail" style={{ flex: 1 }}>
        <img
          src={`${baseURL}/${selectedProduct.imageUrls?.[0]}`}
          alt={selectedProduct.title}
          style={{ width: '100%', borderRadius: 8 }}
        />
        <h2 style={{ marginTop: 20, fontWeight: 'bold', fontSize: 28 }}>
          {selectedProduct.price?.toLocaleString('ko-KR')}원
        </h2>
        <h3 style={{ marginBottom: 24 }}>{selectedProduct.title}</h3>

        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={() => openBuyModal(selectedProduct)}
            style={{
              flex: 1,
              padding: '12px 0',
              backgroundColor: '#ff5c5c',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            구매하기
          </button>
          <button
            onClick={() => openSellModal(selectedProduct)}
            style={{
              flex: 1,
              padding: '12px 0',
              backgroundColor: '#555',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            판매하기
          </button>
        </div>
      </div>

      {/* 모달 */}
      {showSellModal && selectedProduct && (
        <SellModal
          product={selectedProduct}
          onClose={() => setShowSellModal(false)}
          onSuccess={fetchProducts}
        />
      )}

      {showBuyModal && selectedProduct && (
        <BuyModal
          product={selectedProduct}
          onClose={() => setShowBuyModal(false)}
        />
      )}
    </div>
  );
}

export default ShopView;
