import React, { useState } from 'react';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopSellModal({ product, onClose, onSuccess }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [price, setPrice] = useState('');

    const handleSell = async () => {
        if (!selectedOption || !price) {
            alert('옵션과 가격을 선택해주세요.');
            return;
        }
        try {
            await jaxios.post(`${baseURL}/shop/sell`, {
                productId: product.productId,
                optionId: selectedOption,
                price: parseInt(price)
            });
            alert('판매 등록 완료');
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('판매 등록 실패');
        }
    };

    return (
        <div className="modal">
            <h3>판매하기: {product.title}</h3>
            <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                <option value="">옵션 선택</option>
                {product.options?.map(opt => (
                    <option key={opt.optionId} value={opt.optionId}>{opt.optionName}</option>
                ))}
            </select>
            <input
                type="number"
                placeholder="가격 입력"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <button onClick={handleSell}>등록</button>
            <button onClick={onClose}>취소</button>
        </div>
    );
}

export default ShopSellModal;
