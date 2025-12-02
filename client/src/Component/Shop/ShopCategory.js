import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryList } from "../../api/categoryApi"; // API 함수

function ShopCategory() {
  const baseURL = process.env.REACT_APP_BASE_URL; // 이미지 기본 경로
  const [categoryArr, setCategoryArr] = useState([]);

  useEffect(() => {
    // API 호출 후 상태에 저장
    getCategoryList()
      .then(data => {
        setCategoryArr(data); // API에서 category 배열 반환한다고 가정
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="menuWrap">
      {/* 전체 카테고리 */}
      <div className="list">
        <Link to={`/shop`}>
          <img src={`${baseURL}/sh_img/all.png`} alt="전체" />
          <span className="tit">전체</span>
        </Link>
      </div>

      {/* 카테고리 목록 */}
      {categoryArr.map((c, i) => (
        <div className="list" key={c.category_id}>
          <Link to={`/shop/ct/${c.category_id}`}>
            <img src={`${baseURL}/sh_img/${i + 1}.png`} alt={c.category_name} />
            <span className="tit">{c.category_name}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ShopCategory;
