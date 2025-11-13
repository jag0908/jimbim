import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/StyleEdit.css';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleEdit() {
  const { id } = useParams(); // 수정할 게시물 ID
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); // 새로 업로드할 파일
  const [previews, setPreviews] = useState([]); // 화면에 표시할 이미지
  const [existingImages, setExistingImages] = useState([]); // 서버에 이미 있는 이미지
  const [hashtags, setHashtags] = useState('');

  useEffect(() => {
    // 기존 게시물 데이터 불러오기
    const fetchPost = async () => {
      try {
        const res = await jaxios.get(`${baseURL}/style/post/${id}`);
        const post = res.data;

        setTitle(post.title);
        setContent(post.content);
        setExistingImages(post.s_images || []); // 서버 이미지
        setPreviews(post.s_images || []); // 화면용
        setHashtags(post.hashtags?.join(' ') || '');
      } catch (err) {
        console.error('게시글 불러오기 오류', err);
        alert('게시글을 불러오지 못했습니다.');
        navigate('/style');
      }
    };

    fetchPost();
  }, [id, navigate]);

  // 뒤로가기
  const handleBack = () => navigate(-1);

  // 새 이미지 선택
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 10) {
      alert('이미지는 최대 10장까지 업로드 가능합니다.');
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 이미지 삭제 (서버 이미지 or 새로 선택한 이미지)
  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      const newExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExisting);
    } else {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  // 수정 완료
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

      // 새 이미지 추가
      images.forEach((img) => formData.append('image', img));

      // 서버에 남길 기존 이미지
      existingImages.forEach((img) => formData.append('existingImages', img));

      // 해시태그
      hashtags.split(/\s+/).forEach((tag) => {
        if (tag.trim()) formData.append('hashtags', tag.replace('#', ''));
      });

      // 서버에 수정 요청
      await jaxios.put(`${baseURL}/style/post/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      alert('게시글이 수정되었습니다!');
      navigate(`/style/${id}`);
    } catch (err) {
      console.error('게시글 수정 오류', err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="style-write-container">
      <div className="style-write-header">
        <button onClick={handleBack} className="style-back-btn">
          <FaArrowLeft />
        </button>
        <h2>게시글 수정</h2>
      </div>

      <form onSubmit={handleSubmit} className="style-write-form">
        {/* 제목 */}
        <div className="style-form-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        {/* 이미지 */}
        <div className="style-form-group">
          <label>이미지</label>
          <div className="style-image-upload-container">
            {previews.map((src, i) => (
              <div key={i} className="style-image-box">
                <img src={src} alt={`preview-${i}`} />
                <div
                  className="style-removeBtn"
                  onClick={() => handleRemoveImage(i, i < existingImages.length)}
                >
                  삭제
                </div>
              </div>
            ))}
            <label className="style-upload-btn">
              <FaPlus />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
            </label>
          </div>
        </div>

        {/* 해시태그 */}
        <div className="style-form-group">
          <label>해시태그</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#OOTD #DailyLook"
          />
        </div>

        {/* 내용 */}
        <div className="style-form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows="5"
          />
        </div>

        <button type="submit" className="style-submit-btn">수정 완료</button>
      </form>
    </div>
  );
}

export default StyleEdit;
