import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';

import '../../style/shop.css';

function Shop() {
    const baseURL = process.env.REACT_APP_BASE_URL;

    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [categoryArr, setCategoryArr] = useState([]);
    const [productArr, setProductArr] = useState([]);
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId) {
            fetchProducts();
        } else {
            fetchAllProducts();
        }
    }, [categoryId]);

    async function fetchAllProducts() {
        try {
            const result = await axios.get(`${baseURL}/shop/products`);
            setProductArr(result.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchCategories() {
        try {
            const result = await jaxios.get(`${baseURL}/sh-page/sh-category`);
            setCategoryArr(result.data.categoryList);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchProducts() {
        try {
            const url = categoryId
                ? `${baseURL}/shop/products/category/${Number(categoryId)}`
                : `${baseURL}/shop/products`;
            const result = await axios.get(url);
            setProductArr(result.data);
        } catch (err) {
            console.error(err);
        }
    }

    // 🔹 검색 API 호출
    async function handleSearch() {
        try {
            if (!searchVal.trim()) {
                // 검색어 없으면 전체 또는 카테고리별 조회
                categoryId ? fetchProducts() : fetchAllProducts();
                return;
            }

            // 백엔드에 검색용 API가 있다고 가정
            // 카테고리별 검색도 가능하게
            const url = categoryId
                ? `${baseURL}/shop/products/search?keyword=${encodeURIComponent(searchVal)}&categoryId=${categoryId}`
                : `${baseURL}/shop/products/search?keyword=${encodeURIComponent(searchVal)}`;

            const result = await axios.get(url);
            setProductArr(result.data);
        } catch (err) {
            console.error(err);
        }
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
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Enter로 검색
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            {/* 카테고리 메뉴 */}
            <div className='shop-menu-wrap'>
                <div className='shop-list'>
                    <Link to={`/shop`}>
                        <img src={`${baseURL}/sh_img/all.png`} alt="전체" />
                        <span className='shop-tit'>전체</span>
                    </Link>
                </div>

                {categoryArr.map((category, i) => (
                    <div className='shop-list' key={category.category_id}>
                        <Link to={`/shop/${category.category_id}`}>
                            <img src={`${baseURL}/sh_img/${i+1}.png`} alt={category.category_name} />
                            <span className='shop-tit'>{category.category_name}</span>
                        </Link>
                    </div>
                ))}
            </div>

            {/* 상품 목록 */}
            <div className='shPostWrap'>
                {productArr.length === 0 && <p>상품이 없습니다.</p>}
                {productArr.map((item, i) => (
                    <div className="list" key={i}>
                        <Link to={`/shop/product/${item.productId}`}>
                            <div className="imgBox">
                                {item.firstImage 
                                    ? <img src={item.firstImage} alt={item.title} />
                                    : <span className='noimg'>NO IMAGE</span>}
                            </div>
                            <h3 className='data title'>{item.title}</h3>
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
