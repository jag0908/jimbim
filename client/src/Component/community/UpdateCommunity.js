import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/UpdateCommunity.css';

const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:8070";

function UpdateCommunity() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const { num } = useParams();

    const [userid, setUserid] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [deletedIds, setDeletedIds] = useState([]); // 삭제된 기존 이미지 id 저장

    useEffect(() => {
        if (!loginUser?.userid) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await jaxios.get(`${baseURL}/communityList/getCommunity/${num}`);
                const data = res.data.community;

                setUserid(data.member?.userid || '알수없음');
                setTitle(data.title || '');
                setContent(data.content || '');

                // 기존 이미지 세팅
                const oldImages = data.fileList?.map(file => ({
                    id: `old-${file.id}`, // 기존 파일 id
                    src: file.path,
                    isNew: false,
                    file: null,
                })) || [];
                setImages(oldImages);
            } catch (err) {
                console.error(err);
                alert('게시글 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchData();
    }, [loginUser, navigate, num]);

    // 이미지 선택 시
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImgs = files.map((file, idx) => ({
            id: `new-${Date.now()}-${idx}`,
            src: URL.createObjectURL(file),
            isNew: true,
            file,
        }));
        setImages(prev => [...prev, ...newImgs]);
        setNewFiles(prev => [...prev, ...files]);
        e.target.value = null;
    };

    // 이미지 삭제
    const handleRemoveImage = (id) => {
        const imgToRemove = images.find(img => img.id === id);
        if (!imgToRemove) return;

        setImages(prev => prev.filter(img => img.id !== id));

        if (imgToRemove.isNew) {
            // 새 이미지 파일만 newFiles에서 제거
            setNewFiles(prev => prev.filter(file => file !== imgToRemove.file));
        } else {
            // 기존 이미지 삭제 ID 기록
            const oldId = Number(id.replace('old-', ''));
            setDeletedIds(prev => [...prev, oldId]);
        }
    };

    const handleUpdate = async () => {
        if (!title.trim()) return alert('제목을 입력하세요.');
        if (!content.trim()) return alert('내용을 입력하세요.');

        try {
            const formData = new FormData();
            formData.append('cpostId', num);
            formData.append('title', title);
            formData.append('content', content);

            if (deletedIds.length > 0) {
                formData.append('deletedIds', deletedIds.join(','));
            }

            // 새 이미지 추가
            images.filter(img => img.isNew).forEach(img => formData.append('newImages', img.file));

            await jaxios.post(`${baseURL}/communityList/updateCommunity`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert('게시물이 수정되었습니다.');
            navigate(`/communityView/${num}`);
        } catch (err) {
            console.error(err);
            alert('게시물 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="updateCommunity">
            <h2>COMMUNITY UPDATE</h2>

            <div className="field">
                <label>작성자</label>
                <input type="text" value={userid} readOnly />
            </div>

            <div className="field">
                <label>제목</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="field">
                <label>내용</label>
                <textarea rows="8" value={content} onChange={e => setContent(e.target.value)} />
            </div>

            <div className="field">
                <label>이미지</label>
                <input type="file" multiple onChange={handleFileChange} />
                <div className="image-preview-container" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {images.map(img => (
                        <div key={img.id} style={{ position: 'relative' }}>
                            <img src={img.src} alt="" className="image-preview" />
                            <button
                                className="remove-image-btn"
                                onClick={() => handleRemoveImage(img.id)}
                                style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: 'red',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    cursor: 'pointer'
                                }}
                            >X</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="btns">
                <button className="update-btn" onClick={handleUpdate}>수정완료</button>
                <button className="cancel-btn" onClick={() => navigate(`/communityView/${num}`)}>이전</button>
            </div>
        </div>
    );
}

export default UpdateCommunity;
