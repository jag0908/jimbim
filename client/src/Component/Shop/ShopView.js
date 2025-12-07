import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import SellModal from './SellModal';
import BuyModal from './ShopBuyModal';
import '../../style/shopView.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopView() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSellModal, setShowSellModal] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [zzimList, setZzimList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchZzim();
    }, [categoryId]);

    const fetchProducts = async () => {
        try {
            const res = await jaxios.get(`${baseURL}/shop/products`, { params: { categoryId } });
            setProducts(res.data);
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

    return (
        <div className="shopView-main">
            <h2>상품 리스트</h2>
            <div className="shopView-list">
                {products.map(product => (
                    <div className="shopView-card" key={product.productId}>
                        <img src={`${baseURL}/${product.imageUrls?.[0]}`} alt={product.title} />
                        <h4>{product.title}</h4>
                        <p>배송비: {product.deliveryPrice}원</p>
                        <p>조회수: {product.viewCount}</p>
                        <div className="shopView-btns">
                            <button onClick={() => handleZzim(product.productId)}>
                                {zzimList.includes(product.productId) ? '❤️' : '🤍'}
                            </button>
                            <button onClick={() => openSellModal(product)}>판매하기</button>
                            <button onClick={() => openBuyModal(product)}>구매하기</button>
                        </div>
                    </div>
                ))}
            </div>

            {showSellModal && selectedProduct &&
                <SellModal
                    product={selectedProduct}
                    onClose={() => setShowSellModal(false)}
                    onSuccess={fetchProducts}
                />
            }

            {showBuyModal && selectedProduct &&
                <BuyModal
                    product={selectedProduct}
                    onClose={() => setShowBuyModal(false)}
                />
            }
        </div>
    );
}

export default ShopView;
