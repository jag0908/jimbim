import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import '../../style/ShopSuggest.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function ShopSuggest() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState(''); // 가격 상태 추가
    const [fileArr, setFileArr] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [fileLength, setFileLength] = useState(0);

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
        setFileLength(allFiles.length);
        setPreviewUrls(allFiles.map(file => URL.createObjectURL(file)));
        e.target.value = null;
    };

    const handleRemoveFile = (index) => {
        const newFiles = fileArr.filter((_, i) => i !== index);
        setFileArr(newFiles);
        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
        setFileLength(newFiles.length);
    };

    // 가격 입력 변경
    const handlePriceChange = (e) => {
        // 숫자만 필터링
        const value = e.target.value.replace(/\D/g, '');
        setPrice(value);
    };

    // 천 단위 콤마 적용
    const formatPrice = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleSubmit = () => {
        if (!title || !content) {
            alert("제목 및 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        fileArr.forEach(file => formData.append("files", file));
        formData.append("title", title);
        formData.append("content", content);
        formData.append("price", price); // 가격 추가
        formData.append("memberId", loginUser.member_id);

        jaxios.post(`${baseURL}/shop/shopSuggest`, formData)
            .then(res => {
                alert("상품 제안이 등록되었습니다.");
                navigate("/shop");
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="shopSuggest">
            <div className="writeWrap">
                <h2 className="mainTitle">상품 제안하기</h2>

                <div className="inputWrap file">
                    <div className="previewContainer">
                        {previewUrls.map((url, i) => (
                            <div className="imgBox" key={i}>
                                <img src={url} alt={`preview-${i}`} />
                                <div className={`removeBtn removeBtn_${i}`} onClick={() => handleRemoveFile(i)}>X</div>
                            </div>
                        ))}
                    </div>

                    <label htmlFor="fileUpload">+ <span>{fileLength}/10</span></label>
                    <input
                        id="fileUpload"
                        type="file"
                        className="inpFile"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>

                <div className="inputWrap">
                    <h4 className="tit">상품명</h4>
                    <input
                        type="text"
                        placeholder="ex) 나이키 에어 포스 1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="inputWrap">
                    <h4 className="tit">내용</h4>
                    <textarea
                        placeholder="ex) 남성 신발, 블랙, 상품코드"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* 가격 입력 */}
                <div className="inputWrap">
                    <h4 className="tit">가격</h4>
                    <input
                        type="text"
                        placeholder="ex) 139,000"
                        value={formatPrice(price)}
                        onChange={handlePriceChange}
                    />
                </div>
            </div>

            <div className="btnWrap">
                <button className="navBtn pointBtn" onClick={handleSubmit}>제안하기</button>
                <button className="navBtn" onClick={() => navigate(-1)}>취소</button>
            </div>
        </div>
    );
}

export default ShopSuggest;
