import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/StyleWrite.css';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { Cookies } from 'react-cookie';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleWrite() {

  // const baseURL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [hashtags, setHashtags] = useState('');
  const cookies = new Cookies();
  const user = cookies.get('user'); // 로그인 시 쿠키에 저장된 유저 정보
  const token = user?.accessToken;  // accessToken 추출

  useEffect(() => {
    
    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login'); // 로그인 페이지로 이동
    }
  }, [token, navigate]);

  // 뒤로가기
  const handleBack = () => navigate(-1);

  // 이미지 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert('이미지는 최대 10장까지 업로드 가능합니다.');
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    console.log(setImages,document.getElementById('intid').value)
    setPreviews((prev) => [...prev, ...newPreviews]);
    
  };

  // 이미지 삭제
  const handleRemoveFile = (index) => {
    const newFiles = images.filter((_, i) => i !== index);
    setImages(newFiles);

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  // 글 등록 시 이미지 업로드 + 글 작성
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title.trim() || !content.trim()) {
    alert('제목과 내용을 입력해주세요.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 이미지 여러 장 추가
    images.forEach((img) => {
      formData.append('image', img);
    });

    // 해시태그 추가
    hashtags.split(/\s+/).forEach((tag) => {
      if (tag.trim()) formData.append('hashtags', tag.replace('#', ''));
    });

    await jaxios.post(`${baseURL}/style/write`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });

    alert('게시글이 등록되었습니다!');
    navigate('/style');
  } catch (error) {
    console.error(error);
    alert('등록 중 오류가 발생했습니다.');
  }
};

  return (
    <div className="write-container">
      {/* 상단 바 */}
      <div className="write-header">
        <button onClick={handleBack} className="back-btn">
          <FaArrowLeft />
        </button>
        <h2>스타일 글쓰기</h2>
      </div>

      <form onSubmit={handleSubmit} className="write-form">
        {/* 제목 */}
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="form-group">
          <label>이미지</label>
          <div className="image-upload-container">
            {previews.map((src, i) => (
              <div key={i} className="image-box">
                <img src={src} alt={`preview-${i}`} />
                  <div 
                  className="removeBtn" 
                  onClick={() => handleRemoveFile(i)}
                  >
                  삭제
                </div>
              </div>
            ))}
            <label className="upload-btn">
              <FaPlus />
              <input id= "intid" type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
            </label>
          </div>
        </div>

        {/* 해시태그 입력란 추가 */}
        <div className="form-group">
          <label>해시태그</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#OOTD #DailyLook"
          />
        </div>

        {/* 내용 */}
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows="5"
          />
        </div>

        {/* 버튼 */}
        <button type="submit" className="submit-btn">올리기</button>
      </form>
    </div>
  );
}

export default StyleWrite