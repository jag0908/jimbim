import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';

import '../../style/shop.css';

function Shop() {
    const baseURL = process.env.REACT_APP_BASE_URL;

    const { categoryId } = useParams();   // 카테고리 선택
    const navigate = useNavigate();

    const [categoryArr, setCategoryArr] = useState([]);
    const [productArr, setProductArr] = useState([]);
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [categoryId]);

    // 카테고리 조회
    async function fetchCategories() {
        try {
            const result = await jaxios.get(`${baseURL}/sh-page/sh-category`);
            setCategoryArr(result.data.categoryList);
        } catch (err) {
            console.error(err);
        }
    }

    // 상품 조회
    async function fetchProducts() {
        try {
            const url = categoryId
                ? `${baseURL}/shop/products/category/${categoryId}`
                : `${baseURL}/shop/products`;

            const result = await axios.get(url);
            setProductArr(result.data);
        } catch (err) {
            console.error(err);
        }
    }

    function addProduct() {
        navigate("/shop/shopSuggest");
    }

    function formatPrice(num) {
        return num.toLocaleString('ko-KR');
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
                />
                <button onClick={() => console.log(searchVal)}>검색</button>
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

            {/* 상품 목록 — ShMain 스타일 */}
            <div className='shPostWrap'>
                {productArr.map((item, i) => (
                    <div className="list" key={i}>
                        <Link to={`/shop/product/${item.productId}`}>
                            <div className="imgBox">
                                {item.firstFilePath 
                                    ? <img src={item.firstFilePath} alt={item.title} />
                                    : <span className='noimg'>NO IMAGE</span>}
                            </div>

                            <h3 className='data title'>{item.title}</h3>
                            {/* <h3 className='data price'>{formatPrice(item.price)}원</h3> */}
                            {/* <h3 className='data date'>{item.indate.substring(0, 10)}</h3> */}
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
