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
    const [pass, setPass] = useState('');
    const [oldImg, setOldImg] = useState('');
    const [newImgFile, setNewImgFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState('');

    // 로그인 체크 + 게시글 데이터 불러오기
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
                setOldImg(data.fileList?.[0]?.path || '');
            } catch (err) {
                console.error(err);
                alert('게시글 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchData();
    }, [loginUser, navigate, num]);

    // 이미지 선택 시 미리보기
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setNewImgFile(file);
        setPreviewSrc(URL.createObjectURL(file));
    };

    // 수정 완료
    const handleUpdate = async () => {
        if (!pass.trim()) return alert('수정 비밀번호를 입력하세요.');
        if (!title.trim()) return alert('제목을 입력하세요.');
        if (!content.trim()) return alert('내용을 입력하세요.');

        try {
            // 1️⃣ 게시글 업데이트
            const updateData = {
                num,
                userid,
                pass,
                title,
                content,
            };
            const res = await jaxios.post(`${baseURL}/communityList/updateCommunity`, updateData);
            if (res.data.msg !== 'ok') return alert('비밀번호가 맞지 않습니다.');

            // 2️⃣ 이미지 업로드 (선택 시)
            if (newImgFile) {
                const formData = new FormData();
                formData.append('image', newImgFile);
                formData.append('cpostId', num);

                await jaxios.post(`${baseURL}/communityList/fileupload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

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
                <label>비밀번호</label>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} />
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
                <label>기존 이미지</label>
                {oldImg ? <img src={oldImg} alt="기존 이미지" className="image-preview" /> : <p>없음</p>}
            </div>

            <div className="field">
                <label>새 이미지 선택</label>
                <input type="file" onChange={handleFileChange} />
                {previewSrc && <img src={previewSrc} alt="미리보기" className="image-preview" />}
            </div>

            <div className="btns">
                <button className="update-btn" onClick={handleUpdate}>수정완료</button>
                <button className="cancel-btn" onClick={() => navigate(`/communityView/${num}`)}>이전</button>
            </div>
        </div>
    );
}

export default UpdateCommunity;
