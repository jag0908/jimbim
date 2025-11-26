import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/CommunityWrite.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function WriteCommunity() {
    const loginUser = useSelector(state => state.user);

    const [userid, setUserid] = useState(loginUser?.userid || ''); 
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState('N'); 

    const [fileArr, setFileArr] = useState([]);
    const [fileLength, setFileLength] = useState(0);
    const [previewUrls, setPreviewUrls] = useState([]);

    const navigate = useNavigate();

    const categories = [
        { id: 1, name: "자유게시판" },
        { id: 2, name: "질문게시판" },
        { id: 3, name: "살말" },
        { id: 4, name: "팔말" },
        { id: 5, name: "시세" },
        { id: 6, name: "정품 감정" },
        { id: 7, name: "핫딜" }
    ];

    useEffect(() => {
        if (!loginUser || !loginUser.userid) {
            alert("로그인이 필요한 서비스입니다");
            navigate("/");
        }
    }, [loginUser, navigate]);

    const fileUpload = (e) => { 
        const newFiles = Array.from(e.target.files);
        const allFiles = [...fileArr, ...newFiles];

        if (allFiles.length > 10) {
            alert("최대 10개까지 업로드 가능합니다.");
            e.target.value = null;
            return;
        }

        setFileArr(allFiles);
        setFileLength(allFiles.length);

        const urls = allFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        e.target.value = null;
    };

    const handleRemoveFile = (index) => {
        const newFiles = fileArr.filter((_, i) => i !== index);
        const newUrls = previewUrls.filter((_, i) => i !== index);

        setFileArr(newFiles);
        setPreviewUrls(newUrls);
        setFileLength(newFiles.length);
    };

    const handleAnonymousChange = (e) => {
        const isChecked = e.target.checked;
        setIsAnonymous(isChecked ? 'Y' : 'N');
        setUserid(isChecked ? '익명' : loginUser.userid);
    };

    const createFormData = async (fileArr, cpostId) => {
        if (!fileArr || fileArr.length === 0) return;

        const formData = new FormData();
        fileArr.forEach(file => formData.append("imageList", file));
        formData.append("cpostId", cpostId);

        try {
            await jaxios.post(`${baseURL}/communityList/fileupload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        } catch (err) {
            console.error("파일 업로드 실패:", err);
        }
    };

    const onSubmit = async () => {
        if (!title) return alert('제목을 입력하세요');
        if (!content) return alert('내용을 입력하세요');
        if (!selectedCategoryId) return alert('카테고리를 선택하세요');

        const postData = {
            member: { member_id: loginUser.member_id },
            category: { categoryId: selectedCategoryId },
            title,
            content,
            isAnonymous
        };

        let createdPostId;

        try {
            const response = await jaxios.post(`${baseURL}/communityList/createCommunity`, postData);
            const responseData = response.data;
            createdPostId = responseData.cpostId;
            if (!createdPostId) throw new Error("게시글 ID를 받아오지 못했습니다.");
        } catch (err) {
            console.error("게시글 생성 실패:", err);
            alert('게시글 작성에 실패했습니다.');
            return;
        }

        await createFormData(fileArr, createdPostId);

        alert('게시물이 작성되었습니다');
        navigate('/communityList');
    };

    return (
        <div className='writeCommunity-container'>
            <h2>COMMUNITY WRITE</h2>

            <div className='writeCommunity-field'>
                <label>작성자</label>
                <input type='text' value={userid} readOnly /> 

                <div className='writeCommunity-anonymous'>
                    <label>
                        <input type='checkbox' onChange={handleAnonymousChange} />
                        익명으로 작성
                    </label>
                </div>
            </div>

            <div className='writeCommunity-field'>
                <label>카테고리</label>
                <select 
                    value={selectedCategoryId} 
                    onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                >
                    <option value={0}>선택하세요</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className='writeCommunity-field'>
                <label>제목</label>
                <input 
                    type='text' 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
            </div>

            <div className='writeCommunity-field'>
                <label>내용</label>
                <textarea 
                    rows='10' 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className='writeCommunity-inputWrap file'>
                <label htmlFor="dataFile">+ <span>{fileLength}/10</span></label>
                <input 
                    id='dataFile' 
                    type='file' 
                    className='writeCommunity-inpFile' 
                    onChange={fileUpload}
                    multiple 
                />

                <div className="writeCommunity-previewContainer">
                    {previewUrls.map((url, i) => (
                        <div className='writeCommunity-imgBox' key={i}>
                            <img src={url} alt={`preview-${i}`} />
                            <div className='writeCommunity-removeBtn' onClick={() => handleRemoveFile(i)}>X</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='writeCommunity-btns'>
                <button onClick={onSubmit}>작성완료</button>
                <button onClick={() => navigate('/communityList')}>이전</button>
            </div>
        </div>
    );
}

export default WriteCommunity;
