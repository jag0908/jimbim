import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import '../../style/ShopSuggest.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopSuggest() {
  const loginUser = useSelector(state => state.user);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fileArr, setFileArr] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/shop/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const allFiles = [...fileArr, ...newFiles];
    if (allFiles.length > 10) {
      alert("최대 10개까지 선택 가능합니다.");
      e.target.value = null;
      return;
    }
    setFileArr(allFiles);
    setPreviewUrls(allFiles.map(file => URL.createObjectURL(file)));
    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    const newFiles = fileArr.filter((_, i) => i !== index);
    setFileArr(newFiles);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPrice(value);
  };

  const formatPrice = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSubmit = async () => {
    if (!title || !content || !selectedCategory) {
      alert("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    fileArr.forEach(file => formData.append("files", file));
    formData.append("title", title);
    formData.append("content", content);
    formData.append("price", price);
    formData.append("memberId", loginUser.member_id);
    formData.append("categoryId", selectedCategory);

    try {
      await jaxios.post(`${baseURL}/shop/suggest`, formData);
      alert("상품 제안이 등록되었습니다.");
      navigate("/shop");
    } catch (err) {
      console.error(err);
      alert("상품 제안 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="shopSuggest">
      <h2 className="mainTitle">상품 제안하기</h2>

      {/* 이미지 업로드 */}
      <div className="inputWrap file">
        <div className="previewContainer">
          {previewUrls.map((url, i) => (
            <div className="imgBox" key={i}>
              <img src={url} alt={`preview-${i}`} />
              <div className="removeBtn" onClick={() => handleRemoveFile(i)}>X</div>
            </div>
          ))}
        </div>
        <label htmlFor="fileUpload">+ <span>{fileArr.length}/10</span></label>
        <input
          id="fileUpload"
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {/* 제목 */}
      <div className="inputWrap">
        <h4 className="tit">상품명</h4>
        <input
          type="text"
          placeholder="ex) 나이키 에어 포스 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 내용 */}
      <div className="inputWrap">
        <h4 className="tit">내용</h4>
        <textarea
          placeholder="상품 설명을 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* 카테고리 */}
      <div className="inputWrap">
        <h4 className="tit">카테고리</h4>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">카테고리 선택</option>
          {categories.map(cat => (
            <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
          ))}
        </select>
      </div>

      {/* 가격 */}
      <div className="inputWrap">
        <h4 className="tit">가격</h4>
        <input
          type="text"
          placeholder="ex) 139,000"
          value={formatPrice(price)}
          onChange={handlePriceChange}
        />
      </div>

      {/* 버튼 */}
      <div className="btnWrap">
        <button className="navBtn pointBtn" onClick={handleSubmit}>제안하기</button>
        <button className="navBtn" onClick={() => navigate(-1)}>취소</button>
      </div>
    </div>
  );
}

export default ShopSuggest;
