import React, { useState, useEffect } from 'react';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopBuyModal({ product, onClose }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [sellList, setSellList] = useState([]);

    useEffect(() => {
        if (selectedOption) fetchSellList();
    }, [selectedOption]);

    const fetchSellList = async () => {
        try {
            const res = await jaxios.get(`${baseURL}/shop/sell`, {
                params: { productId: product.productId, optionId: selectedOption }
            });
            // 가격 오름차순 정렬
            setSellList(res.data.sort((a,b) => a.price - b.price));
        } catch (err) {
            console.error(err);
        }
    };

    const handleBuy = async (sellId) => {
        try {
            await jaxios.post(`${baseURL}/shop/buy`, { sellId });
            alert('구매 완료');
            onClose();
        } catch (err) {
            console.error(err);
            alert('구매 실패');
        }
    };

    return (
        <div className="modal">
            <h3>구매하기: {product.title}</h3>
            <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                <option value="">옵션 선택</option>
                {product.options?.map(opt => (
                    <option key={opt.optionId} value={opt.optionId}>{opt.optionName}</option>
                ))}
            </select>

            {sellList.length > 0 && (
                <div>
                    <h4>판매자 목록</h4>
                    <ul>
                        {sellList.map(sell => (
                            <li key={sell.sellId}>
                                가격: {sell.price}원
                                <button onClick={() => handleBuy(sell.sellId)}>구매</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={onClose}>닫기</button>
        </div>
    );
}

export default ShopBuyModal;
