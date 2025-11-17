import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/CommunityWrite.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function WriteCommunity() {
    const loginUser = useSelector(state => state.user);

    const [userid, setUserid] = useState('');
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [pass, setPass] = useState("");
    const [image, setImage] = useState("");
    const [savefilename, setSavefilename] = useState("");
    const [imgSrc, setImgSrc] = useState('');
    const [imgStyle, setImgStyle] = useState({ display: 'none' });
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [fileArr, setFileArr] = useState([]);
    const [fileLength, setFileLength] = useState(0);
    
    const [previewUrls, setPreviewUrls] = useState([]); // 이미지 미리보기 URL 배열

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
        if (loginUser && loginUser.userid) {
            setUserid(loginUser.userid);
        }
    }, [loginUser]);

    function fileupload(e) {
        if(!e.target) {return}

        let newfiles = Array.from(e.target.files);

        // 기존 파일과 합치기
        const allFiles = [...fileArr, ...newfiles];

        if (allFiles.length > 10) {
            alert("최대 10개까지 선택 가능합니다.");
            e.target.value = null; // 선택 초기화
            return;
        };

        setFileLength(allFiles.length);
        setFileArr(allFiles);

        // 브라우저에서 바로 미리보기 URL 생성
        const urls = allFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);

        console.log('allfiles', allFiles, 'urls', urls)
        e.target.value = null;
    };
    // 파일 삭제
    const handleRemoveFile = (index) => {
        const newFiles = fileArr.filter((_, i) => i !== index);
        setFileArr(newFiles);

        // 미리보기도 같이 갱신
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);
        setFileLength(fileLength-1)
    };
    // 파일 업로드시 formData 추가
    function createFormData(fileArr) {
        if(!fileArr[0].name) return;

        const formData = new FormData();
        // 파일 데이터 저장
        Object.values(fileArr).forEach((fileArr) => formData.append("imageList", fileArr));

        axios.post("/api/communityList/fileupload", formData)
        .then((result)=> {
            alert("업로드 성공");
            console.log(result.data);
        }).catch(err=>console.error(err));
    }

    /*
    function onFileUpload(e) {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        axios.post(`api/communityList/fileupload`, formData)
            .then((result) => {
                setSavefilename(result.data.savefilename);
                setImage(result.data.image);
                setImgSrc(`${baseURL}/images/${result.data.savefilename}`);
                setImgStyle({ display: 'block', width: '250px' });
            })
            .catch((err) => { console.error(err); })
    }

    */

    function onSubmit() {
        if (!title) return alert('제목을 입력하세요');
        if (!content) return alert('내용을 입력하세요');
        if (!selectedCategoryId) return alert('카테고리를 선택하세요');

        // 익명 선택 시 userid를 '익명'으로 설정
        const postData = {
            userid: isAnonymous ? '익명' : userid,
            pass,
            title,
            content,
            image,
            savefilename,
            categoryId: selectedCategoryId
        };

        axios.post(`api/community/CommunityList`, postData)
            .then(() => {
            })
            .catch((err) => { console.error(err) });

            
        createFormData(fileArr)

        
        alert('게시물이 작성되었습니다');
        navigate('/communityList');
        
    }

    return (
        <div className='writeCommunity'>
            <h2>COMMUNITY WRITE</h2>
            <div className='field'>
                <label>작성자</label>
                {loginUser && loginUser.userid ? (
                    <input type='text' value={userid} readOnly />
                ) : (
                    <input type='text' value={userid} placeholder='익명으로 작성하려면 비워두세요' onChange={(e) => setUserid(e.currentTarget.value)} />
                )}
                <div>
                    <label>
                        <input type='checkbox' checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                        익명으로 작성
                    </label>
                </div>
            </div>
            <div className='field'>
                <label>카테고리</label>
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(Number(e.target.value))}>
                    <option value={0}>선택하세요</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className='field'>
                <label>제목</label>
                <input type='text' value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            </div>
            <div className='field'>
                <label>내용</label>
                <textarea rows='10' value={content} onChange={(e) => setContent(e.currentTarget.value)}></textarea>
            </div>
            <div className='inputWrap file'>
                <label htmlFor="dataFile">+ <span>{fileLength}/10</span></label>
                {/* 파일업로드 인풋 */}
                <input id='dataFile' type='file' className='inpFile' onChange={(e)=> {fileupload(e);}} multiple />
                {/* 미리보기 이미지 */}
                <div className="previewContainer">
                    {previewUrls.map((url, i) => (
                        <div className='imgBox' key={i} >
                            <img src={url} alt={`preview-${i}`} />
                            <div className={`removeBtn removeBtn_${i}`}onClick={()=> {
                                handleRemoveFile(i);
                            }}>X</div>
                        </div>    
                    ))}
                </div>
            </div>
            <div className='btns'>
                <button onClick={onSubmit}>작성완료</button>
                <button onClick={() => navigate('/communityList')}>이전</button>
            </div>
        </div>
    )
}

export default WriteCommunity;
