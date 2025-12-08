import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import '../../style/shopDetail.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/shop/product/${productId}`);
      setProduct(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("해당 상품을 찾을 수 없습니다.");
      } else {
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  if (error) return <div>{error}</div>;
  if (!product) return <div>상품을 불러오는 중입니다...</div>;

  return (
    <div className="shop-product-detail">
      <h1>{product.title}</h1>

      {/* 이미지 슬라이더 */}
      <div className="product-images">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          product.imageUrls.map((url, i) => (
            <img key={i} src={url} alt={`${product.title}-${i}`} />
          ))
        ) : (
          <span className="noimg">NO IMAGE</span>
        )}
      </div>

      {/* 가격 */}
      <p>
        가격:{" "}
        {product.minPrice !== null && product.minPrice !== undefined
          ? product.minPrice.toLocaleString()
          : "가격 정보 없음"}{" "}
        원
      </p>
    </div>
  );
}

export default ShopProductDetail;
