import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
    try {
        const res = await jaxios.get(`${baseURL}/shop/product/${productId}`);
        setProduct(res.data);
    } catch (err) {
        if (err.response?.status === 404) {
        setProduct({ error: "해당 상품을 찾을 수 없습니다." });
        } else {
        console.error(err);
        }
    }
    };

    if (!product) return <div>상품을 불러오는 중입니다...</div>;

    return (
        <div>
            <h1>{product.title}</h1>
            <img src={`${baseURL}/${product.imageUrls?.[0]}`} alt={product.title} />
            <p>가격: {product.price?.toLocaleString()}원</p>
            <p>배송비: {product.deliveryPrice}원</p>
            <p>{product.content}</p>
        </div>
    );
}

export default ShopProductDetail;
