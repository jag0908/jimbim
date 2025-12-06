import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jaxios from '../../util/jwtutil';
import { Link, useNavigate } from 'react-router-dom';

import '../../style/shop.css';

function Shop() {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const [categoryArr, setCategoryArr] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const result = await jaxios.get(`${baseURL}/sh-page/sh-category`);
            setCategoryArr([...result.data.categoryList]);
        } catch (err) {
            console.error(err);
        }
    }

    function handleSearch() {
        console.log("검색 값:", searchVal);
    }

    function addProduct() {
        navigate("/shop/shopSuggest");
    }

    return (
        <div className='shop-main'>
            {/* 검색 바 */}
            <div className="shop-search-bar">
                <input 
                    placeholder="상품을 검색해보세요" 
                    aria-label="메인 검색"
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.currentTarget.value)}
                />
                <button type="button" onClick={handleSearch}>검색</button>
            </div>

            {/* 카테고리 메뉴 */}
            <div className='shop-menu-wrap'>
                <div className='shop-list'>
                    <Link to={`/sh-page`}>
                        <img src={`${baseURL}/sh_img/all.png`} alt="전체" />
                        <span className='shop-tit'>전체</span>
                    </Link>
                </div>

                {categoryArr.map((category, i) => (
                    <div className='shop-list' key={category.category_id || i}>
                        <Link to={`/sh-page/ct/${category.category_id}`}>
                            <img src={`${baseURL}/sh_img/${i+1}.png`} alt={category.category_name} />
                            <span className='shop-tit'>{category.category_name}</span>
                        </Link>
                    </div>
                ))}
            </div>

            {/* 상품 요청 버튼 */}
            <div className='shop-btn-wrap'>
                <button className='shop-btn shop-btn-add' onClick={addProduct}>
                    요청하기
                </button>
            </div>
        </div>
    );
}

export default Shop;
